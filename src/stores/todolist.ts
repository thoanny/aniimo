import todolist from '@/data/todolist.json';
import type { Category, Period, Task, TaskKey, UserTask } from '@/types/todolist';
import { defineStore } from 'pinia';

export const UNCATEGORIZED = 'none';

const defaultCategories: Category[] = [];

export const useTodolistStore = defineStore('todolist', {
  state: () => ({
    tasks: <UserTask[]>[],
    completed: <number[]>[],
    hidden: <number[]>[],
    categories: <Category[]>[],
    layout: <Record<string, TaskKey[]>>{ [UNCATEGORIZED]: [] },
  }),
  getters: {
    allTasks: (state): Task[] => {
      const dataTasks: Task[] = todolist.map((task) => ({
        id: task.id,
        title: task.fields.Title,
        description: task.fields.Description ?? '',
        period: (task.fields.Period ?? null) as Period,
        link: task.fields.Link ?? null,
        hidden: state.hidden.includes(task.id),
        completed: state.completed.includes(task.id),
        custom: false,
      }));

      return [...dataTasks, ...state.tasks.map((task) => ({ ...task, custom: true }))];
    },
    tasksById(): Map<TaskKey, Task> {
      return new Map(this.allTasks.map((task) => [task.id, task]));
    },
    tasksFiltered(): Task[] {
      return this.allTasks.filter((task) => !task.hidden);
    },
    statistics: (state) => {
      const min = state.completed.length + state.tasks.filter((task) => task.completed).length;
      const max = todolist.length + state.tasks.length;
      return {
        min,
        max,
        pc: Math.min(Math.round((min / max) * 100), 100),
      };
    },
  },
  actions: {
    syncLayout() {
      for (const category of defaultCategories) {
        if (!this.categories.some((c) => c.id === category.id)) {
          this.categories.push({ ...category });
        }
      }

      const valid = new Set(this.allTasks.map((task) => task.id));
      const placed = new Set<TaskKey>();

      for (const key of [UNCATEGORIZED, ...this.categories.map((c) => c.id)]) {
        this.layout[key] = (this.layout[key] ?? []).filter((id) => {
          if (!valid.has(id) || placed.has(id)) {
            return false;
          }
          placed.add(id);
          return true;
        });
      }

      for (const id of valid) {
        if (!placed.has(id)) {
          this.layout[UNCATEGORIZED]?.push(id);
        }
      }
    },
    addCategory(title: string) {
      const clean = title.trim();
      if (!clean) {
        return;
      }

      const key = (Math.random() + 1).toString(36).substring(5);
      this.categories.push({ id: key, title: clean, collapsed: false, custom: true });
      this.layout[key] = [];
    },
    removeCategory(categoryId: string) {
      const idx = this.categories.findIndex((c) => c.id === categoryId && c.custom);
      if (idx < 0) {
        return;
      }

      this.layout[UNCATEGORIZED]?.push(...(this.layout[categoryId] ?? []));
      delete this.layout[categoryId];
      this.categories.splice(idx, 1);
    },
    toggleCategoryCollapsed(categoryId: string) {
      const category = this.categories.find((c) => c.id == categoryId);
      if (category) {
        category.collapsed = !category.collapsed;
      }
    },
    addTask(task: UserTask) {
      if (!task.title || task.title.length < 1) {
        throw new Error('Le titre est obligatoire');
      }

      this.tasks.push(task);
      this.syncLayout();

      return true;
    },
    updateTask(task: UserTask) {
      if (!task.title || task.title.length < 1) {
        throw new Error('Le titre est obligatoire');
      }

      const idx = this.tasks.findIndex((t) => t.id === task.id);
      if (idx < 0) {
        throw new Error('Tâche introuvable');
      }

      this.tasks[idx] = task;
      this.syncLayout();

      return true;
    },
    removeTask(taskId: string | number) {
      if (typeof taskId === 'number') {
        return;
      }

      const idx = this.tasks.findIndex((task) => task.id === taskId);
      if (idx >= 0) {
        this.tasks.splice(idx, 1);
        this.syncLayout();
      }
    },
    toggleTaskCompleted(taskId: number | string) {
      if (typeof taskId === 'number') {
        const idx = this.completed.indexOf(taskId);
        if (idx >= 0) {
          this.completed.splice(idx, 1);
        } else {
          this.completed.push(taskId);
        }
      } else {
        const task = this.tasks.find((t) => t.id === taskId);
        if (task) {
          task.completed = !task.completed;
        }
      }
    },
    toggleTaskHidden(taskId: number | string) {
      if (typeof taskId === 'number') {
        const idx = this.hidden.indexOf(taskId);
        if (idx >= 0) {
          this.hidden.splice(idx, 1);
        } else {
          this.hidden.push(taskId);
        }
      } else {
        const task = this.tasks.find((t) => t.id === taskId);
        if (task) {
          task.hidden = !task.hidden;
        }
      }
    },
    resetTasksWherePeriod(type: 'daily' | 'weekly') {
      const dailyCompletedIds = this.allTasks
        .filter((task) => task.completed === true && task.period === type)
        .map((task) => task.id);

      dailyCompletedIds.forEach((id) => {
        if (typeof id === 'number') {
          const idx = this.completed.findIndex((taskId) => taskId === id);
          if (idx >= 0) {
            this.completed.splice(idx, 1);
          }
        } else {
          const task = this.tasks.find((t) => t.id === id);
          if (task) {
            task.completed = !task.completed;
          }
        }
      });
    },
    resetTasksCompleted() {
      this.completed = [];
      this.tasks = this.tasks.map((task) => ({ ...task, completed: false }));
    },
  },
  persist: {
    pick: ['completed', 'hidden', 'tasks', 'categories', 'layout'],
  },
});
