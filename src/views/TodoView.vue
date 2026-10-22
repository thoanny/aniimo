<script setup lang="ts">
import TaskAddModal from '@/components/TaskAddModal.vue';
import { UNCATEGORIZED, useTodolistStore } from '@/stores/todolist';
import type { TaskKey } from '@/types/todolist';
import {
  IconArrowDown,
  IconArrowUp,
  IconEdit,
  IconExternalLink,
  IconEye,
  IconEyeClosed,
  IconFolderLock,
  IconFolderOpen,
  IconFolderPlus,
  IconGripVertical,
  IconRefreshDot,
  IconRestore,
  IconSquareRounded,
  IconSquareRoundedCheck,
  IconSquareRoundedX,
  IconTrash,
} from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import sanitizeHtml from 'sanitize-html';
import { computed, ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

const todolist = useTodolistStore();
const { tasksFiltered, tasksById, categories, layout, statistics } = storeToRefs(todolist);
const {
  toggleTaskHidden,
  resetTasksWherePeriod,
  resetTasksCompleted,
  toggleTaskCompleted,
  removeTask,
  addCategory,
  removeCategory,
  toggleCategoryCollapsed,
  moveCategory,
} = todolist;

todolist.syncLayout();

const sanitizeOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'kbd'],
};

const sections = computed(() => [
  { id: UNCATEGORIZED, title: 'Sans catégorie', collapsed: false, custom: false },
  ...categories.value,
]);

const tasksOf = (sectionId: string) =>
  (layout.value[sectionId] ?? []).map((id) => tasksById.value.get(id)!);

const completedPc = (sectionId: string) => {
  const min = tasksOf(sectionId).filter((task) => task.completed && !task.hidden).length || 0;
  const max = tasksOf(sectionId).filter((task) => !task.hidden).length || 0;
  return Math.round((min / max) * 100);
};

const newCategory = ref('');
const submitCategory = () => {
  addCategory(newCategory.value);
  newCategory.value = '';
};

const isEditMode = ref(false);
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="grid sm:grid-cols-2 lg:flex lg:flex-row gap-2 px-2">
      <TaskAddModal />
      <button class="btn btn-neutral" @click="resetTasksWherePeriod('daily')">
        <IconRestore class="size-5" />
        Réinit. quoti.
      </button>
      <button class="btn btn-neutral" @click="resetTasksWherePeriod('weekly')">
        <IconRefreshDot class="size-5" />
        Réinit. hebdo.
      </button>
      <button class="btn btn-neutral" @click="resetTasksCompleted">
        <IconSquareRoundedX class="size-5" />
        Tout décocher
      </button>
      <div class="grow hidden lg:block"></div>
      <button
        class="btn btn-circle"
        @click="isEditMode = !isEditMode"
        :class="{ 'btn-success': isEditMode, 'btn-neutral': !isEditMode }"
      >
        <IconEdit />
      </button>
    </div>
    <div class="p-2 bg-base-100 mt-4 flex items-center rounded-box text-xs flex-col">
      <progress
        class="progress progress-success w-full"
        :value="statistics.min"
        :max="statistics.max"
      ></progress>
    </div>
    <div class="flex flex-col gap-3 mt-4" v-if="tasksFiltered.length > 0">
      <section v-for="section in sections" :key="section.id" class="flex flex-col gap-3">
        <header
          class="flex items-center gap-2 p-2 bg-neutral rounded-full text-neutral-content min-h-14"
          :class="{
            'pl-6': section.id === UNCATEGORIZED,
          }"
          v-if="categories.length > 0"
        >
          <button
            v-if="section.id !== UNCATEGORIZED"
            class="btn btn-circle"
            @click="toggleCategoryCollapsed(section.id)"
          >
            <IconFolderLock class="size-5" v-if="section.collapsed" />
            <IconFolderOpen class="size-5" v-else />
          </button>
          <h2 class="font-semibold grow">{{ section.title }}</h2>
          <div
            class="radial-progress text-[.65rem]"
            :class="{
              'text-success': completedPc(section.id) >= 100,
            }"
            :style="`--size: 2.5rem; --value: ${completedPc(section.id)}`"
            :aria-valuenow="completedPc(section.id)"
            role="progressbar"
            v-show="completedPc(section.id) > 0 && !isEditMode"
          >
            {{ completedPc(section.id) }}%
          </div>

          <template v-if="section.id !== UNCATEGORIZED && isEditMode">
            <button
              class="btn btn-circle"
              @click="moveCategory(section.id, -1)"
              :disabled="categories[0]?.id === section.id"
            >
              <IconArrowUp class="size-5" />
            </button>
            <button
              class="btn btn-circle"
              @click="moveCategory(section.id, 1)"
              :disabled="categories.at(-1)?.id === section.id"
            >
              <IconArrowDown class="size-5" />
            </button>
          </template>

          <button
            v-if="section.custom && isEditMode"
            class="btn btn-ghost btn-error btn-circle"
            @click="removeCategory(section.id)"
          >
            <IconTrash class="size-5" />
          </button>
        </header>
        <VueDraggable
          v-show="!section.collapsed"
          :model-value="layout[section.id] ?? []"
          @update:model-value="(ids: TaskKey[]) => (layout[section.id] = ids)"
          group="tasks"
          handle=".drag-handle"
          :animation="150"
          class="flex flex-col gap-3 rounded-box"
        >
          <div
            class="card bg-base-100 card-xs shadow hover:shadow-lg rounded-full select-none"
            :class="{ 'opacity-40': task.completed && !isEditMode }"
            v-for="task in tasksOf(section.id)"
            :key="task.id"
            v-show="!task.hidden || isEditMode"
          >
            <div class="card-body text-sm">
              <span
                class="badge badge-xs absolute -top-[6px] left-19 font-bold"
                v-if="task.period"
                :class="{
                  'badge-accent': task.period === 'daily',
                  'badge-secondary': task.period === 'weekly',
                }"
              >
                {{ task.period }}
              </span>
              <div class="flex gap-3 items-center">
                <IconGripVertical
                  class="drag-handle size-5 shrink-0 cursor-grab opacity-50 -mr-2"
                />
                <button
                  class="btn btn-circle"
                  @click="toggleTaskCompleted(task.id)"
                  :class="{
                    'btn-success btn-soft': task.completed,
                  }"
                  :disabled="isEditMode"
                >
                  <IconSquareRounded v-if="!task.completed" />
                  <IconSquareRoundedCheck v-else />
                </button>
                <div class="grow">
                  <div class="font-bold">
                    {{ task.title }}
                  </div>
                  <div
                    v-html="sanitizeHtml(task.description, sanitizeOptions)"
                    class="text-xs"
                    v-if="task.description"
                  ></div>
                </div>
                <div class="flex gap-2 items-center">
                  <a
                    :href="task.link"
                    target="_blank"
                    class="btn btn-neutral btn-circle"
                    v-if="task.link"
                  >
                    <IconExternalLink class="size-5" />
                  </a>
                  <TaskAddModal :task v-if="task.custom && isEditMode" />
                  <button
                    class="btn btn-soft btn-circle"
                    @click="toggleTaskHidden(task.id)"
                    v-if="isEditMode"
                  >
                    <IconEye class="size-5" v-if="!task.hidden" />
                    <IconEyeClosed class="size-5" v-else />
                  </button>
                  <button
                    class="btn btn-soft btn-error btn-circle"
                    @click="removeTask(task.id)"
                    v-if="isEditMode && task.custom"
                  >
                    <IconTrash class="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </VueDraggable>
      </section>
    </div>
    <div class="flex mt-4" v-else>
      <div class="alert">Aucune tâche à afficher...</div>
    </div>

    <form class="join w-full mt-4 px-2" @submit.prevent="submitCategory">
      <input
        type="text"
        v-model="newCategory"
        class="input join-item grow"
        placeholder="Nouvelle catégorie"
      />
      <button class="btn btn-neutral join-item" :disabled="!newCategory.trim()">
        <IconFolderPlus class="size-5" /> Ajouter
      </button>
    </form>
  </div>
</template>

<style scoped></style>
