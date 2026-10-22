<template>
  <button class="btn btn-neutral btn-block lg:btn-square" @click="openModal">
    <IconEdit class="size-5" v-if="task?.id" />
    <template v-else>
      <IconPlus class="size-5" />
      <span class="lg:hidden">Ajouter une tâche</span>
    </template>
  </button>
  <dialog ref="modal" class="modal">
    <div class="modal-box max-w-sm max-h-[95dvh]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-lg font-bold leading-none flex gap-2 items-center mb-4">
        <IconPlus />
        {{ task?.id ? 'Modifier' : 'Ajouter' }} une tâche
      </h3>

      <form @submit.prevent="saveTask">
        <div class="alert alert-error alert-soft" v-if="error">{{ error }}</div>

        <fieldset class="fieldset">
          <label class="label" for="name">Titre (requis)</label>
          <input
            type="text"
            id="name"
            class="input w-full"
            v-model="editedTask.title"
            @input="error = ''"
            autocomplete="off"
            maxlength="100"
            :autofocus="!editedTask.title"
          />
        </fieldset>
        <fieldset class="fieldset">
          <label class="label" for="description">Description</label>
          <input
            type="text"
            id="description"
            class="input w-full"
            v-model="editedTask.description"
            autocomplete="off"
            maxlength="100"
          />
        </fieldset>
        <fieldset class="fieldset">
          <label class="label" for="link">Lien</label>
          <input
            type="text"
            id="link"
            class="input w-full"
            v-model="editedTask.link"
            autocomplete="off"
          />
        </fieldset>
        <fieldset class="fieldset">
          <label class="label" for="period">Période</label>
          <select id="period" class="select w-full" v-model="editedTask.period">
            <option :value="null">-- Aucune --</option>
            <option value="daily">Quotidienne</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="season">Saison</option>
          </select>
        </fieldset>
        <fieldset class="fieldset">
          <label class="label" for="category">Catégorie</label>
          <select id="category" class="select w-full" v-model="editedTask.category">
            <option :value="UNCATEGORIZED">-- Sans catégorie --</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.title }}
            </option>
          </select>
        </fieldset>
        <button class="btn btn-neutral btn-block mt-2 transition-all" type="submit">
          Enregistrer la tâche
        </button>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { UNCATEGORIZED, useTodolistStore } from '@/stores/todolist';
import { IconEdit, IconPlus } from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const props = defineProps(['task']);

const todolist = useTodolistStore();
const { addTask, updateTask } = todolist;
const { categories } = storeToRefs(todolist);

const initialTask = {
  id: undefined,
  title: '',
  description: '',
  period: null,
  link: '',
  category: UNCATEGORIZED,
};

const modal = ref();
const editedTask = ref({ ...initialTask, ...props.task });
const error = ref();

const openModal = () => {
  editedTask.value = {
    ...initialTask,
    ...props.task,
    category: props.task?.id ? todolist.categoryOf(props.task.id) : UNCATEGORIZED,
  };
  modal.value.showModal();
};

const saveTask = () => {
  const { category, ...fields } = editedTask.value;
  const payload = { ...fields, period: fields.period || null };

  try {
    if (payload.id) {
      updateTask(payload, category);
    } else {
      const key = (Math.random() + 1).toString(36).substring(5);
      addTask({ ...payload, id: key, completed: false, hidden: false, custom: true }, category);
    }
    editedTask.value = { ...initialTask };
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
