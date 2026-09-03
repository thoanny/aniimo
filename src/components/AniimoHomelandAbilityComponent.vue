<template>
  <span
    class="badge badge-sm"
    :class="`bg-ability-${ability?.id}`"
    :style="{
      '--badge-color': `var(--color-ability-${ability?.id})`,
      '--badge-fg': 'var(--color-base-100)',
    }"
  >
    <div v-if="ability?.fields.Icon" v-html="ability.fields.Icon" class="size-4"></div>
    <div v-else>X</div>
    <div>{{ aniimoAbility?.fields.Level }}</div>
  </span>
</template>

<script setup lang="ts">
import aniimoHomelandAbilities from '@/data/aniimo-homeland-abilities.json';
import homelandAbilities from '@/data/homeland-abilities.json';

const props = defineProps<{
  abilityId: number;
}>();

const aniimoAbility = aniimoHomelandAbilities.find(
  (aniimoHomelandAbility) => aniimoHomelandAbility.id === props.abilityId,
);
const ability = homelandAbilities.find(
  (homelandAbility) => homelandAbility.id === aniimoAbility?.fields.HomelandAbility.id,
);
</script>

<style scoped>
div :deep(svg) {
  width: 100%;
  height: 100%;
}

.badge {
  padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  gap: 0.15rem;
}
</style>
