<!--
@component
A live card's badge as its icon: drawn in currentColor on a 24-unit grid, colored by its tone's class and described on
hover and to screen readers by the badge's words (the icon itself is hidden from them). An agent in a black hat and dark
glasses for a possible secret access, a trash compactor pressing down on its bin for compacting, a speech bubble with a
question mark for a session waiting for the user's answer, a padlock for one waiting for a permission.
-->
<script lang="ts">
  import type { LiveBadge } from './live';

  let { badge }: { badge: LiveBadge } = $props();
</script>

<span
  class={['live-icon', `live-icon-${badge.kind}`, badge.tone && `live-icon-${badge.tone}`]}
  role="img"
  aria-label={badge.text}
  title={badge.text}
>
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {#if badge.kind === 'permission'}
      <path
        d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <rect
        x="4.8"
        y="10.5"
        width="14.4"
        height="10"
        rx="2"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
      />
      <circle cx="12" cy="14.6" r="1.4" fill="currentColor" />
      <path d="M12 15.4v2.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    {:else if badge.kind === 'waiting'}
      <path
        d="M5 3.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8.2L6 20.5v-4H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <path
        d="M9.7 8.2a2.3 2.3 0 1 1 3.3 2.1c-.6.3-1 .8-1 1.5v.3"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <circle cx="12" cy="14.4" r="1" fill="currentColor" />
    {:else if badge.kind === 'secret'}
      <path d="M7.2 9.6 8.6 4.4c.2-.8 1-1.2 1.8-1l1.6.4 1.6-.4c.8-.2 1.6.2 1.8 1l1.4 5.2z" fill="currentColor" />
      <path d="M2.8 10.4c0-.7 4.1-1.2 9.2-1.2s9.2.5 9.2 1.2-4.1 1.4-9.2 1.4-9.2-.7-9.2-1.4z" fill="currentColor" />
      <rect x="6.2" y="13" width="4.8" height="3" rx="1.3" fill="currentColor" />
      <rect x="13" y="13" width="4.8" height="3" rx="1.3" fill="currentColor" />
      <path d="M11 14h2" fill="none" stroke="currentColor" stroke-width="1.4" />
      <!-- the coat, its collar a notch -->
      <path
        d="M4 22.8c.5-2.9 3.6-4.6 8-4.6s7.5 1.7 8 4.6zM10.4 18.4l1.6 2.8 1.6-2.8z"
        fill="currentColor"
        fill-rule="evenodd"
      />
    {:else}
      <rect
        x="3.5"
        y="2.5"
        width="17"
        height="19"
        rx="2"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
      />
      <path
        d="M12 2.5v5.3M9.5 11.6l2.5 1.6 2.5-1.6"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <rect x="6" y="7.8" width="12" height="2.3" rx="0.6" fill="currentColor" />
      <!-- what it crushed, jagged on top -->
      <path d="M6 19h12v-4.2l-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3z" fill="currentColor" />
    {/if}
  </svg>
</span>
