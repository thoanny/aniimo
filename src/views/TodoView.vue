<script setup lang="ts">
import TaskAddModal from '@/components/TaskAddModal.vue';
import { useTodolistStore } from '@/stores/todolist';
import {
  IconExternalLink,
  IconEye,
  IconEyeClosed,
  IconRefreshDot,
  IconRestore,
  IconSquareRounded,
  IconSquareRoundedCheck,
  IconSquareRoundedX,
} from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import sanitizeHtml from 'sanitize-html';

const todolist = useTodolistStore();
const { tasksFiltered, settings, statistics } = storeToRefs(todolist);
const {
  toggleTaskHidden,
  resetTasksWherePeriod,
  resetTasksCompleted,
  toggleTaskCompleted,
  removeTask,
} = todolist;

const sanitizeOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'kbd'],
};
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
        class="btn btn-neutral btn-block lg:btn-circle"
        @click="settings.showHidden = !settings.showHidden"
      >
        <IconEyeClosed class="size-5" v-if="!settings.showHidden" />
        <IconEye class="size-5" v-else />
        <span class="lg:hidden">
          {{ settings.showHidden ? 'Afficher toutes les tâches' : 'Masquer les tâches' }}
        </span>
      </button>
    </div>
    <div class="p-2 bg-base-100 mt-4 flex items-center rounded-box text-xs">
      <progress
        class="progress progress-success w-full"
        :value="statistics.min"
        :max="statistics.max"
      ></progress>
    </div>
    <div class="flex flex-col gap-3 mt-4" v-if="tasksFiltered.length > 0">
      <div
        class="card bg-base-100 card-xs shadow hover:shadow-lg rounded-full select-none"
        v-for="task in tasksFiltered"
        :key="task.id"
        @dblclick="removeTask(task.id)"
      >
        <div class="card-body text-sm">
          <span
            class="badge badge-xs absolute -top-[6px] left-13 font-bold"
            v-if="task.period"
            :class="{
              'badge-accent': task.period === 'daily',
              'badge-secondary': task.period === 'weekly',
            }"
          >
            {{ task.period }}
          </span>
          <div class="flex gap-3 items-center">
            <button
              class="btn btn-circle"
              @click="toggleTaskCompleted(task.id)"
              :class="{
                'btn-success btn-soft': task.completed,
              }"
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
              <button class="btn btn-soft btn-circle" @click="toggleTaskHidden(task.id)">
                <IconEye class="size-5" v-if="!task.hidden" />
                <IconEyeClosed class="size-5" v-else />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex mt-4" v-else>
      <div class="alert">Aucune tâche à afficher...</div>
    </div>
  </div>
</template>

<style scoped></style>
