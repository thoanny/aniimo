<script setup lang="ts">
import {
  IconCalendarWeek,
  IconExternalLink,
  IconFlame,
  IconMenu2Filled,
  IconNotebook,
  type Icon,
} from '@tabler/icons-vue';

interface MenuItem {
  id: string;
  title: string;
  link: string;
  icon?: Icon;
  external: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: 'tTk4VUSyVQ',
    title: 'Aniimopédia',
    link: '/',
    icon: IconNotebook,
    external: false,
  },
  {
    id: 'y5VgGSgKKY',
    title: 'Évènements',
    link: '/events',
    icon: IconCalendarWeek,
    external: false,
  },
  {
    id: 'OdHCj7Ko1i',
    title: 'T-potes',
    link: '/t-potes',
    icon: IconFlame,
    external: false,
  },
  {
    id: 'HuXguEvitk',
    title: 'Site officiel',
    link: 'https://www.aniimo.com/fr/main',
    external: true,
  },
  {
    id: '1L2mPHTMco',
    title: 'Wiki',
    link: 'https://wiki.aniimo.com',
    external: true,
  },
];

const handleMenuClick = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};
</script>

<template>
  <ul class="hidden md:flex menu menu-horizontal p-0 text-neutral-content">
    <li v-for="item in menuItems" :key="item.id">
      <RouterLink :to="item.link" active-class="menu-active" v-if="!item.external">
        <component :is="item.icon" v-if="item.icon" class="size-5" stroke="1.5" />
        <span>{{ item.title }}</span>
      </RouterLink>
      <a :href="item.link" target="_blank" rel="nofollow" v-else>
        <span>{{ item.title }}</span>
        <IconExternalLink class="size-4" />
      </a>
    </li>
  </ul>

  <div class="dropdown dropdown-end md:hidden">
    <button tabindex="0" role="button" class="btn btn-neutral btn-circle m-1" ref="menuButton">
      <IconMenu2Filled />
    </button>
    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-99 w-52 p-2 shadow-sm">
      <li v-for="item in menuItems" :key="item.id">
        <RouterLink
          :to="item.link"
          active-class="menu-active"
          v-if="!item.external"
          @click="handleMenuClick"
        >
          <component :is="item.icon" v-if="item.icon" class="size-5" stroke="1.5" />
          <span>{{ item.title }}</span>
        </RouterLink>
        <a :href="item.link" target="_blank" rel="nofollow" class="justify-between" v-else>
          <span>{{ item.title }}</span>
          <IconExternalLink class="size-4" />
        </a>
      </li>
    </ul>
  </div>
</template>
