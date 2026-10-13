<template>
  <button class="btn btn-neutral btn-block lg:btn-square" @click="openModal">
    <IconPlus class="size-5" />
    <span class="lg:hidden">Ajouter une tâche</span>
  </button>
  <dialog ref="modal" class="modal">
    <div class="modal-box max-w-sm max-h-[95dvh]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-lg font-bold leading-none flex gap-2 items-center mb-4">
        <IconPlus />
        Ajouter une tâche
      </h3>

      <div class="alert alert-error alert-soft" v-if="error">{{ error }}</div>

      <fieldset class="fieldset">
        <label class="label" for="name">Titre (requis)</label>
        <input
          type="text"
          id="name"
          class="input w-full"
          v-model="task.title"
          @input="error = ''"
          autocomplete="off"
          maxlength="100"
        />
      </fieldset>
      <fieldset class="fieldset">
        <label class="label" for="description">Description</label>
        <input
          type="text"
          id="description"
          class="input w-full"
          v-model="task.description"
          autocomplete="off"
          maxlength="100"
        />
      </fieldset>
      <fieldset class="fieldset">
        <label class="label" for="link">Lien</label>
        <input type="text" id="link" class="input w-full" v-model="task.link" autocomplete="off" />
      </fieldset>
      <fieldset class="fieldset">
        <label class="label" for="period">Période</label>
        <select id="period" class="select w-full" v-model="task.period">
          <option value="">Aucune</option>
          <option value="daily">Quotidienne</option>
          <option value="weekly">Hebdomadaire</option>
          <option value="season">Saison</option>
        </select>
      </fieldset>
      <button class="btn btn-neutral btn-block mt-2 transition-all" @click="saveTask(task)">
        Enregistrer la tâche
      </button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useTodolistStore } from '@/stores/todolist';
import type { NewTask } from '@/types/todolist';
import { IconPlus } from '@tabler/icons-vue';
import { ref } from 'vue';

const todolist = useTodolistStore();
const { addTask } = todolist;

const initialTask = {
  title: '',
  description: '',
  period: null,
  link: '',
};

const modal = ref();
const task = ref({ ...initialTask });
const error = ref();

const openModal = () => {
  task.value = { ...initialTask };
  modal.value.showModal();
};

const saveTask = (newTask: NewTask) => {
  const key = (Math.random() + 1).toString(36).substring(5);

  try {
    addTask({ id: key, ...newTask, completed: false, hidden: false });
    task.value = { ...initialTask };
    modal.value.close();
  } catch (err) {
    error.value = err;
  }
};
</script>

<style scoped>
.label {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
</style>
