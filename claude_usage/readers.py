"""Who besides you can read the projects folder: the warnings `serve` prints at start. The token keeps other users out
of the dashboard, not out of the files it reads, so a folder open to them, or files that belong to someone else, are
worth knowing about. Claude Code keeps its folder closed (700), and a closed folder anywhere above closes every file
below it, so only the whole path from / down tells."""
import functools
import os
import re
import stat
from collections import Counter
from collections.abc import Callable
from collections.abc import Sequence
from dataclasses import dataclass
from pathlib import Path

MOUNTS = Path("/proc/self/mounts")
TRANSCRIPT_SUFFIX = ".jsonl"
ROOT_ID = 0                             # root reads every file anyway, so its files open nothing more
OPTION_SEPARATORS = re.compile(r"[,;]")  # WSL 2 lists drvfs's own options in aname's value, split by ;
MOUNT_ESCAPE = re.compile(r"\\([0-7]{3})")


@dataclass(frozen=True)
class Entry:
    """A file's or folder's mode and owners, as stat gives them."""
    mode: int
    uid: int
    gid: int

    @classmethod
    def of(cls, path: Path) -> "Entry":
        """The entry of path, following a symbolic link."""
        status = path.stat()
        return cls(status.st_mode, status.st_uid, status.st_gid)


@dataclass(frozen=True)
class Survey:
    """The projects folder as other users see it: its files, those they can read (and of these the transcripts),
    each other owner (but root) of the folder or anything below it with its count of files and folders, and the
    folder's owner."""
    files: int
    readable: int
    readable_transcripts: int
    foreign: tuple[tuple[int, int], ...]
    owner: int


def can_read(reader_gid: int | None, folders: Sequence[Entry], target: Entry) -> bool:
    """Whether a user other than the owner reads target through folders (from / down to its own), as POSIX decides:
    everyone else (reader_gid None) by the bits for others, a member of reader_gid by the group's bits wherever the
    folder or file has that group, even where the bits for others would let them in."""
    for folder in folders:
        if not folder.mode & bit_for(reader_gid, folder, stat.S_IXGRP, stat.S_IXOTH):
            return False
    return bool(target.mode & bit_for(reader_gid, target, stat.S_IRGRP, stat.S_IROTH))


def bit_for(reader_gid: int | None, entry: Entry, group_bit: int, others_bit: int) -> int:
    """The permission bit that applies to the reader on entry: the group's if entry has the reader's group."""
    return group_bit if reader_gid is not None and entry.gid == reader_gid else others_bit


def survey(folder: Path, above: Sequence[Entry], user_id: int, shared: Callable[[int], bool]) -> Survey:
    """What of folder other users can read, through the folders above it (from / down) and every folder below. A
    reader is anyone else, or a member of a shared group (shared(gid)) of the file or a folder on its way; an entry
    that vanishes while walking, or a folder that can't be listed, is left out."""
    top = Entry.of(folder)
    ways = {str(folder): (*above, top)}
    owners = Counter([top.uid])
    files = 0
    readable = 0
    readable_transcripts = 0
    for path, folder_names, file_names in os.walk(folder):
        way = ways.pop(path)
        for name in list(folder_names):
            try:
                below = Entry.of(Path(path, name))
            except OSError:
                folder_names.remove(name)   # so the walk doesn't go where it has no way to
                continue
            ways[os.path.join(path, name)] = (*way, below)
            owners[below.uid] += 1
        for name in file_names:
            try:
                target = Entry.of(Path(path, name))
            except OSError:
                continue
            owners[target.uid] += 1
            if not stat.S_ISREG(target.mode):
                continue
            files += 1
            groups = sorted({entry.gid for entry in (*way, target) if shared(entry.gid)})
            if any(can_read(reader, way, target) for reader in (None, *groups)):
                readable += 1
                if name.endswith(TRANSCRIPT_SUFFIX):
                    readable_transcripts += 1
    foreign = tuple(sorted((uid, count) for uid, count in owners.items() if uid not in (user_id, ROOT_ID)))
    return Survey(files, readable, readable_transcripts, foreign, top.uid)


def ancestors(folder: Path) -> list[Entry]:
    """The entries of the folders above folder, from / down."""
    return [Entry.of(parent) for parent in reversed(folder.parents)]


def permissionless_mount(path: Path, mounts: str) -> str | None:
    """The mount point of the Windows drive path is on (WSL's drvfs without the metadata option), where chmod does
    nothing; None on any other file system. mounts is /proc/self/mounts; the longest mount point above path wins."""
    found = None
    for line in mounts.splitlines():
        fields = line.split()
        if len(fields) < 4:
            continue
        point = MOUNT_ESCAPE.sub(lambda match: chr(int(match.group(1), 8)), fields[1])
        if path.is_relative_to(point) and (found is None or len(point) >= len(found[0])):
            found = (point, fields[2], set(OPTION_SEPARATORS.split(fields[3])))
    if found is None:
        return None
    point, kind, options = found
    drvfs = kind == "drvfs" or (kind == "9p" and "aname=drvfs" in options)
    return point if drvfs and "metadata" not in options else None


def messages(folder: Path, result: Survey, user_id: int, mount: str | None, name: Callable[[int], str]) -> list[str]:
    """The warnings about folder: files other users can read, with how to close them where you can, and files and
    folders that belong to other users, by name (name(uid))."""
    found = []
    if result.readable:
        if mount is not None:
            fix = (f"it is on {mount}, a Windows drive where chmod does nothing: close it with the mount option "
                   "umask=077, or metadata and then chmod (/etc/wsl.conf)")
        elif result.owner == user_id:
            fix = f"chmod 700 {folder} closes them"
        else:
            fix = None
        warning = (f"{result.readable} of {result.files} files below {folder} can be read by other users "
                   f"({result.readable_transcripts} of them transcripts): the token keeps them out of the dashboard, "
                   "not out of the files")
        found.append(warning if fix is None else f"{warning}; {fix}")
    if result.foreign:
        count = sum(entries for _, entries in result.foreign)
        names = ", ".join(name(uid) for uid, _ in result.foreign)
        found.append(f"{count} files and folders from {folder} down belong to other users ({names}), who read them "
                     "without the token")
    return found


def warnings(projects_dir: Path) -> list[str]:
    """The warnings serve prints at start about who else can read projects_dir; none on a system without POSIX
    permissions, or without the folder."""
    if os.name != "posix" or not projects_dir.is_dir():
        return []
    folder = projects_dir.resolve()
    result = survey(folder, ancestors(folder), os.geteuid(), functools.cache(group_shared))
    return messages(folder, result, os.geteuid(), permissionless_mount(folder, read_mounts()), user_name)


def read_mounts() -> str:
    """/proc/self/mounts, or nothing where there is none (macOS)."""
    try:
        return MOUNTS.read_text(encoding="utf-8")
    except OSError:
        return ""


def group_shared(gid: int) -> bool:
    """Whether the group holds a user besides this process's: a member other than you, or another account whose
    primary group it is. A private group (one per user, as on Debian) lets nobody else in; a group without a name
    counts as shared, since who is in it is unknown."""
    import grp                          # POSIX only, like every caller: an import at the top would fail on Windows
    import pwd
    user_id = os.geteuid()
    try:
        members = grp.getgrgid(gid).gr_mem
    except KeyError:
        return True
    if any(member != user_name(user_id) for member in members):
        return True
    return any(account.pw_gid == gid and account.pw_uid != user_id for account in pwd.getpwall())


def user_name(uid: int) -> str:
    """The account's name, or the uid where it has none."""
    import pwd                          # POSIX only, see group_shared
    try:
        return pwd.getpwuid(uid).pw_name
    except KeyError:
        return str(uid)
