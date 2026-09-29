"""readers.py: who besides you can read the projects folder, and the warnings serve prints about it."""
import os
import stat
import unittest
from pathlib import Path
from unittest import mock

from claude_usage import readers
from helpers import TempDirTestCase

FOLDER = stat.S_IFDIR
FILE = stat.S_IFREG
OWNER = 1000
GROUP = 5
WSL_DRIVE = (r"C:\134 /mnt/c 9p rw,noatime,aname=drvfs;path=C:\;uid=1000;gid=1000;symlinkroot=/mnt/,cache=0x5,"
             "access=client,msize=65536,trans=fd,rfd=6,wfd=6 0 0")
ROOT_FS = "/dev/sdc / ext4 rw,relatime 0 0"


def private_group(gid):
    """No group holds anyone but you."""
    return False


def shared_group(gid):
    """Every group holds someone else."""
    return True


def user_name(uid):
    """A name per uid, as pwd would give it."""
    return f"user{uid}"


class CanReadTest(unittest.TestCase):
    def test_everyone_else_reads_through_the_others_bits(self):
        folders = [readers.Entry(FOLDER | 0o755, OWNER, OWNER)]
        self.assertTrue(readers.can_read(None, folders, readers.Entry(FILE | 0o644, OWNER, OWNER)))

    def test_a_folder_closed_to_others_stops_them(self):
        folders = [readers.Entry(FOLDER | 0o750, OWNER, OWNER)]
        self.assertFalse(readers.can_read(None, folders, readers.Entry(FILE | 0o644, OWNER, OWNER)))

    def test_a_file_closed_to_others_stops_them(self):
        folders = [readers.Entry(FOLDER | 0o755, OWNER, OWNER)]
        self.assertFalse(readers.can_read(None, folders, readers.Entry(FILE | 0o640, OWNER, OWNER)))

    def test_a_group_member_goes_through_the_group_bits(self):
        folders = [readers.Entry(FOLDER | 0o750, OWNER, GROUP)]
        self.assertTrue(readers.can_read(GROUP, folders, readers.Entry(FILE | 0o640, OWNER, GROUP)))

    def test_a_group_member_is_bound_by_the_group_bits_where_others_may_read(self):
        folders = [readers.Entry(FOLDER | 0o755, OWNER, GROUP)]
        self.assertFalse(readers.can_read(GROUP, folders, readers.Entry(FILE | 0o604, OWNER, GROUP)))

    def test_a_group_member_goes_through_the_others_bits_of_another_groups_folder(self):
        folders = [readers.Entry(FOLDER | 0o751, OWNER, OWNER)]
        self.assertTrue(readers.can_read(GROUP, folders, readers.Entry(FILE | 0o640, OWNER, GROUP)))


@unittest.skipUnless(os.name == "posix", "POSIX permissions")
class SurveyTest(TempDirTestCase):
    def setUp(self):
        super().setUp()
        self.root = add_folder(self.tmp / "open-projects", 0o755)

    def survey(self, above=(), user_id=None, shared=private_group):
        """survey() of the folder, by default as its owner, with nothing open above it and no shared group."""
        return readers.survey(self.root, list(above), os.geteuid() if user_id is None else user_id, shared)

    def test_files_closed_by_their_mode_are_not_readable(self):
        add_file(self.root / "s1.jsonl", 0o600)
        self.assertEqual((self.survey().files, self.survey().readable), (1, 0))

    def test_an_open_file_in_open_folders_is_readable(self):
        add_file(self.root / "s1.jsonl", 0o644)
        self.assertEqual(self.survey().readable, 1)

    def test_readable_transcripts_are_counted_apart(self):
        add_file(self.root / "s1.jsonl", 0o644)
        add_file(self.root / "agent-a1.meta.json", 0o644)
        self.assertEqual((self.survey().readable, self.survey().readable_transcripts), (2, 1))

    def test_a_folder_above_closed_to_others_closes_everything_below(self):
        add_file(self.root / "s1.jsonl", 0o644)
        above = [readers.Entry(FOLDER | 0o700, os.geteuid(), os.getegid())]
        self.assertEqual(self.survey(above=above).readable, 0)

    def test_a_closed_folder_below_closes_its_files(self):
        slug = add_folder(self.root / "-home-dev-app", 0o700)
        add_file(slug / "s1.jsonl", 0o644)
        self.assertEqual(self.survey().readable, 0)

    def test_group_bits_open_a_file_to_a_shared_group(self):
        self.root.chmod(0o750)
        add_file(self.root / "s1.jsonl", 0o640)
        self.assertEqual(self.survey(shared=shared_group).readable, 1)

    def test_group_bits_open_nothing_in_a_private_group(self):
        self.root.chmod(0o750)
        add_file(self.root / "s1.jsonl", 0o640)
        self.assertEqual(self.survey().readable, 0)

    @unittest.skipIf(os.geteuid() == 0, "root's files never count")
    def test_the_folder_and_files_of_another_owner_are_counted_by_owner(self):
        add_file(self.root / "s1.jsonl", 0o600)
        self.assertEqual(self.survey(user_id=os.geteuid() + 1).foreign, ((os.geteuid(), 2),))

    def test_your_own_files_are_not_foreign(self):
        add_file(self.root / "s1.jsonl", 0o600)
        self.assertEqual(self.survey().foreign, ())

    def test_roots_files_are_not_foreign(self):
        add_file(self.root / "s1.jsonl", 0o600)
        with mock.patch.object(readers, "ROOT_ID", os.geteuid()):
            self.assertEqual(self.survey(user_id=os.geteuid() + 1).foreign, ())

    def test_the_folders_owner_is_noted(self):
        self.assertEqual(self.survey().owner, os.geteuid())


class PermissionlessMountTest(unittest.TestCase):
    def test_a_windows_drive_without_metadata_is_found(self):
        path = Path("/mnt/c/Users/dev/.claude/projects")
        self.assertEqual(readers.permissionless_mount(path, f"{ROOT_FS}\n{WSL_DRIVE}"), "/mnt/c")

    def test_a_windows_drive_with_metadata_has_permissions(self):
        mounts = WSL_DRIVE.replace("uid=1000;", "metadata;uid=1000;")
        self.assertIsNone(readers.permissionless_mount(Path("/mnt/c/projects"), mounts))

    def test_wsl1s_drvfs_is_found(self):
        mounts = "C: /mnt/c drvfs rw,noatime,uid=1000,gid=1000 0 0"
        self.assertEqual(readers.permissionless_mount(Path("/mnt/c/projects"), mounts), "/mnt/c")

    def test_the_closest_mount_decides(self):
        mounts = f"{WSL_DRIVE}\n/dev/sdd /mnt/c/linux ext4 rw 0 0"
        self.assertIsNone(readers.permissionless_mount(Path("/mnt/c/linux/projects"), mounts))

    def test_a_path_off_the_drive_is_not_on_it(self):
        path = Path("/home/dev/.claude/projects")
        self.assertIsNone(readers.permissionless_mount(path, f"{ROOT_FS}\n{WSL_DRIVE}"))

    def test_a_sibling_with_the_same_prefix_is_not_on_it(self):
        self.assertIsNone(readers.permissionless_mount(Path("/mnt/cx/projects"), WSL_DRIVE))

    def test_an_escaped_mount_point_is_read_as_its_path(self):
        mounts = r"D:\134 /mnt/my\040drive 9p rw,aname=drvfs;path=D:\ 0 0"
        self.assertEqual(readers.permissionless_mount(Path("/mnt/my drive/p"), mounts), "/mnt/my drive")


class MessagesTest(unittest.TestCase):
    def messages(self, readable=0, foreign=(), owner=OWNER, mount=None):
        """messages() for the folder /p with 3 files, 1 of the readable ones a transcript, as user OWNER."""
        survey = readers.Survey(files=3, readable=readable, readable_transcripts=min(readable, 1), foreign=foreign,
                                owner=owner)
        return readers.messages(Path("/p"), survey, OWNER, mount, user_name)

    def test_a_closed_folder_of_your_own_gives_no_warning(self):
        self.assertEqual(self.messages(), [])

    def test_open_files_are_counted_with_the_fix(self):
        self.assertEqual(self.messages(readable=2), [
            "2 of 3 files below /p can be read by other users (1 of them transcripts): the token keeps them out of "
            "the dashboard, not out of the files; chmod 700 /p closes them"])

    def test_on_a_windows_drive_the_fix_is_its_mount_options(self):
        warning = self.messages(readable=2, mount="/mnt/c")[0]
        self.assertIn("it is on /mnt/c, a Windows drive where chmod does nothing: close it with the mount option "
                      "umask=077", warning)

    def test_another_owners_folder_gets_no_chmod_advice(self):
        warning = self.messages(readable=2, foreign=((1001, 1),), owner=1001)[0]
        self.assertNotIn("chmod", warning)

    def test_files_of_other_owners_are_named(self):
        self.assertEqual(self.messages(foreign=((1001, 4), (1002, 1))), [
            "5 files and folders from /p down belong to other users (user1001, user1002), who read them without "
            "the token"])


@unittest.skipUnless(os.name == "posix", "POSIX permissions")
class WarningsTest(TempDirTestCase):
    def test_a_missing_folder_gives_no_warning(self):
        self.assertEqual(readers.warnings(self.tmp / "missing"), [])

    def test_a_system_without_posix_permissions_gives_no_warning(self):
        folder = add_folder(self.tmp / "open-projects", 0o755)
        with mock.patch.object(readers.os, "name", "nt"):
            self.assertEqual(readers.warnings(folder), [])

    def test_open_files_in_a_folder_open_from_the_root_are_warned_about(self):
        folder = add_folder(self.tmp / "open-projects", 0o755)
        add_file(folder / "s1.jsonl", 0o644)
        with mock.patch.object(readers, "ancestors", return_value=[]):
            warnings = readers.warnings(folder)
        self.assertEqual(len(warnings), 1)
        self.assertIn("1 of 1 files below", warnings[0])

    def test_a_closed_folder_above_is_found_on_the_way_down(self):
        private = add_folder(self.tmp / "private", 0o700)
        folder = add_folder(private / "projects", 0o755)
        add_file(folder / "s1.jsonl", 0o644)
        self.assertEqual(readers.warnings(folder), [])


def add_folder(path, mode):
    """A new folder with exactly this mode, whatever the umask."""
    path.mkdir()
    path.chmod(mode)
    return path


def add_file(path, mode):
    """A new file with exactly this mode."""
    path.write_text("{}\n", encoding="utf-8")
    path.chmod(mode)
    return path


if __name__ == "__main__":
    unittest.main()
