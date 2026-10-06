<!--
@component
The header's theme picker: auto (follows the system), light, dark and the gimmick themes. The choice is saved by the
preference's setter, which also takes anything that is no theme for "auto".
-->
<script lang="ts">
  import { getApp } from './app.svelte';

  const { preferences } = getApp();

  function choose(value: string): void {
    preferences.theme = value === 'auto' ? null : value;
  }
</script>

<label class="theme-picker"
  ><span class="muted">Theme</span>
  <select id="theme" value={preferences.theme ?? 'auto'} onchange={(event) => choose(event.currentTarget.value)}>
    <option value="auto">auto</option>
    <option value="light">light</option>
    <option value="dark">dark</option>
    <optgroup label="Just for fun">
      <option value="hacker">terminal hacker 💻</option>
      <option value="startup">startup flex ✨</option>
      <option value="rgb">RGB battlestation 🌈</option>
    </optgroup>
  </select>
</label>
