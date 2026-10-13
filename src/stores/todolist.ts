import todolist from '@/data/todolist.json';
import type { Period, Settings, Task, UserTask } from '@/types/todolist';
import { defineStore } from 'pinia';

const defaultSettings: Settings = {
  showHidden: true,
};

export const useTodolistStore = defineStore('todolist', {
  state: () => ({
    tasks: <UserTask[]>[],
    completed: <number[]>[],
    hidden: <number[]>[],
    settings: { ...defaultSettings },
  }),
  getters: {
    tasksFiltered: (state) => {
      const dataTasks: Task[] = todolist.map((task) => ({
        id: task.id,
        title: task.fields.Title,
        description: task.fields.Description ?? '',
        period: (task.fields.Period ?? null) as Period,
        link: task.fields.Link ?? null,
        hidden: state.hidden.includes(task.id),
        completed: state.completed.includes(task.id),
      }));

      const all: Task[] = [...dataTasks, ...state.tasks];

      return all
        .filter((task) => {
          if (state.settings.showHidden) {
            return true;
          }

          return task.hidden === false;
        })
        .sort((a, b) => {
          return Number(a.completed) - Number(b.completed);
        });
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
    addTask(task: UserTask) {
      if (!task.title || task.title.length < 1) {
        throw new Error('Le titre est obligatoire');
      }

      this.tasks.push(task);

      return true;
    },
    removeTask(taskId: string | number) {
      if (typeof taskId === 'number') {
        return;
      }

      const idx = this.tasks.findIndex((task) => task.id === taskId);
      if (idx >= 0) {
        this.tasks.splice(idx, 1);
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
      const dailyCompletedIds = this.tasksFiltered
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
    pick: ['completed', 'hidden', 'settings', 'tasks'],
  },
});
