import { defineStore } from 'pinia';

export const useAniilogStore = defineStore('aniilog', {
  state: () => ({ aniimo: <number[]>[] }),
  getters: {},
  actions: {
    toggle(aniimoId: number) {
      const idx = this.aniimo.findIndex((id) => aniimoId === id);
      if (idx < 0) {
        this.aniimo.push(aniimoId);
      } else {
        this.aniimo.splice(idx, 1);
      }
    },
  },
  persist: true,
});
