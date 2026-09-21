<script setup lang="ts">
import events from '@/data/events.json';
import { computed } from 'vue';

const toDay = (d: string) => Date.parse(String(d).slice(0, 10)) / 864e5;
const first = Math.min(...events.map((e) => toDay(e.fields.StartDate)));
const last = Math.max(...events.map((e) => toDay(e.fields.EndDate)));
const start = new Date(first * 864e5);
const days = last - first + 1;

const header = Array.from({ length: days }, (_, i) => new Date(+start + i * 864e5));

const filteredEvents = computed(() => {
  return events.map((e) => ({
    ...e,
    start: dayIndex(e.fields.StartDate),
    end: dayIndex(e.fields.EndDate) + 1,
    row: e.fields.Row + 1,
  }));
});

const dayIndex = (d: string) => toDay(d) - first + 1;

const label = (d: Date) => {
  return d.toLocaleDateString('fr-FR', { month: '2-digit', timeZone: 'UTC', day: '2-digit' });
};
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Évènements</h1>
  <div class="scroller py-2 border rounded-box relative">
    <div class="grid absolute top-0 left-0 h-full w-full">
      <div
        v-for="(d, i) in header"
        :key="i"
        class="placeholder w-[3rem] bg-neutral/10 z-10"
        :style="{ gridColumn: i + 1, gridRow: 1 }"
      ></div>
    </div>
    <div class="grid relative z-20" :style="{ '--days': days }">
      <div
        v-for="(d, i) in header"
        :key="i"
        class="day text-xs"
        :style="{ gridColumn: i + 1, gridRow: 1 }"
      >
        {{ label(d) }}
      </div>
      <div
        v-for="event in filteredEvents"
        :key="event.id"
        class="bar text-sm font-bold bg-neutral text-neutral-content"
        :style="{
          gridColumn: `${dayIndex(event.fields.StartDate)} / ${dayIndex(event.fields.EndDate)} + 1`,
          gridRow: event.row + 1,
        }"
        :class="`col-start-${event.start} col-end-${event.end}`"
      >
        <span class="sticky left-2 line-clamp-1">{{ event.fields.Title }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroller {
  overflow-x: auto;
  max-width: 100%;
}
.grid {
  grid-template-columns: repeat(var(--days), 3rem);
  gap: 0.5rem 0.5rem;
}
.bar {
  border-radius: var(--radius-box);
  padding: 0.25rem 0.75rem;
  height: 2rem;
  display: flex;
  align-items: center;
}
.day {
  color: var(--color-neutral);
  font-weight: bold;
  text-align: center;
}
</style>
