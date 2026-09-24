<script setup lang="ts">
import events from '@/data/events.json';
import { useConveyer } from '@egjs/vue-conveyer';
import MarkdownIt from 'markdown-it';
import { computed, ref } from 'vue';

const { ref: conveyerRef, onBeginScroll, onFinishScroll } = useConveyer({ useSideWheel: true });

const scrolling = ref(false);

const eventModal = ref();
const eventSelected = ref();
const toDay = (d: string) => Date.parse(String(d).slice(0, 10)) / 864e5;
const first = Math.min(...events.map((e) => toDay(e.fields.StartDate)));
const last = Math.max(...events.map((e) => toDay(e.fields.EndDate)));
const start = new Date(first * 864e5);
const days = last - first + 1;

const header = Array.from({ length: days }, (_, i) => new Date(+start + i * 864e5));

const filteredEvents = computed(() => {
  const md = new MarkdownIt();

  return events.map((e) => ({
    ...e,
    start: dayIndex(e.fields.StartDate),
    end: dayIndex(e.fields.EndDate) + 1,
    row: e.fields.Row + 1,
    description: e.fields.Description ? md.render(e.fields.Description) : null,
    isCurrent: isCurrent(e.fields.StartDate, e.fields.EndDate),
    isEnded: e.fields.EndDate < new Date().toLocaleDateString('sv-SE'),
  }));
});

const dayIndex = (d: string) => toDay(d) - first + 1;

const label = (d: Date) => {
  return d.toLocaleDateString('fr-FR', { month: '2-digit', timeZone: 'UTC', day: '2-digit' });
};

const handleEventModal = (EventId: number) => {
  if (scrolling.value) return;
  eventSelected.value = filteredEvents.value.find((e) => e.id === EventId);
  eventModal.value.showModal();
};

const isCurrent = (start: string, end?: string): boolean => {
  const today = new Date().toLocaleDateString('sv-SE');
  if (!end) {
    if (start === today) {
      return true;
    }
    return false;
  }

  if (start <= today && end >= today) {
    return true;
  }

  return false;
};

onBeginScroll(() => {
  scrolling.value = true;
});

onFinishScroll(() => {
  scrolling.value = false;
});
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Évènements</h1>
  <!-- <pre>{{ filteredEvents }}</pre> -->
  <div
    class="scroller py-2 rounded-lg relative select-none bg-base-100 shadow-md"
    ref="conveyerRef"
  >
    <div class="grid absolute top-0 left-0 h-full w-full">
      <div
        v-for="(d, i) in header"
        :key="i"
        class="w-[3rem] z-10"
        :class="`${isCurrent(d.toLocaleDateString('sv-SE')) ? 'bg-primary/25' : 'bg-neutral/10'}`"
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
        class="rounded-box text-sm font-bold cursor-pointer py-1 px-3 h-8 flex items-center z-1"
        :style="{
          gridColumn: `${dayIndex(event.fields.StartDate)} / ${dayIndex(event.fields.EndDate)} + 1`,
          gridRow: event.row + 1,
        }"
        :class="`col-start-${event.start} col-end-${event.end} ${event.isCurrent ? 'bg-primary text-base-100' : 'bg-neutral text-neutral-content'} ${event.isEnded ? 'opacity-25' : ''}`"
        @click="handleEventModal(event.id)"
      >
        <span class="sticky left-2 line-clamp-1">
          {{ event.fields.Title }}
        </span>
      </div>
    </div>
  </div>
  <dialog ref="eventModal" class="modal">
    <div class="modal-box" v-if="eventSelected">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-lg font-bold mb-4">{{ eventSelected.fields.Title }}</h3>
      <!-- <pre>{{ eventSelected }}</pre> -->
      <div v-if="eventSelected.fields.StartDate">
        <strong>Début :</strong>
        {{
          new Intl.DateTimeFormat('fr-FR', {
            dateStyle: 'full',
          }).format(new Date(eventSelected.fields.StartDate))
        }}
      </div>
      <div v-if="eventSelected.fields.EndDate">
        <strong>Fin :</strong>
        {{
          new Intl.DateTimeFormat('fr-FR', {
            dateStyle: 'full',
          }).format(new Date(eventSelected.fields.EndDate))
        }}
      </div>
      <div
        v-if="eventSelected.description"
        v-html="eventSelected.description"
        class="description"
      ></div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
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

.day {
  color: var(--color-neutral);
  font-weight: bold;
  text-align: center;
}

.description :deep(ul),
.description :deep(ol),
.description :deep(p) {
  margin: 1rem 0;
}

.description :deep(ul),
.description :deep(ol) {
  margin-left: 1.75rem;
}

.description :deep(ul) {
  list-style-type: disc;
}

.description :deep(ol) {
  list-style-type: decimal;
}

.description :deep(code) {
  background: var(--color-neutral);
  color: var(--color-neutral);
  user-select: none;
  padding: 0.25rem 0.75rem;
  border-radius: calc(var(--radius-box) / 4);
  font-size: 0.875rem;
  transition: all ease-in-out 100ms;
  cursor: pointer;
  font-family: var(--font-sans);
  font-weight: 600;
}

.description :deep(code:active) {
  color: var(--color-neutral-content);
  user-select: none;
}
</style>
