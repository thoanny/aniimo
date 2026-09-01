import aniimoData from '@/data/aniimo.json';
import elementsData from '@/data/elements.json';
import formsData from '@/data/forms.json';
import rolesData from '@/data/roles.json';
import { defineStore } from 'pinia';

type Filters = {
  form: undefined | number;
  element: undefined | number;
  role: undefined | number;
  caught: undefined | number;
};

const defaultFilters: Filters = {
  form: undefined,
  element: undefined,
  role: undefined,
  caught: undefined,
};

export const useAniilogStore = defineStore('aniilog', {
  state: () => ({ aniimo: <number[]>[], filters: { ...defaultFilters } }),
  getters: {
    aniimoTotal: (): number => {
      return aniimoData.length;
    },
    aniimoCaughtTotal: (state): number => {
      return state.aniimo.length;
    },
    aniimoFiltered: (state) => {
      return aniimoData
        .map((aniimo) => ({
          ...aniimo,
          caught: state.aniimo.indexOf(aniimo.id) >= 0,
        }))
        .filter((aniimo) => {
          if (!state.filters.form) {
            return true;
          }
          return aniimo.fields.Form.id === state.filters.form;
        })
        .filter((aniimo) => {
          if (!state.filters.element) {
            return true;
          }
          return (
            aniimo.fields.Elements.map((element) => element.id).indexOf(state.filters.element) >= 0
          );
        })
        .filter((aniimo) => {
          if (!state.filters.role) {
            return true;
          }
          return aniimo.fields.Roles.map((role) => role.id).indexOf(state.filters.role) >= 0;
        })
        .filter((aniimo) => {
          if (!state.filters.caught) {
            return true;
          }
          return aniimo.caught !== true;
        });
    },
    formsFiltered: () => {
      return formsData.sort((a, b) => a.fields.Title.localeCompare(b.fields.Title));
    },
    formSelected: (state) => {
      return formsData.find((form) => form.id === state.filters.form);
    },
    elementsFiltered: () => {
      return elementsData.sort((a, b) => a.fields.Title.localeCompare(b.fields.Title));
    },
    elementSelected: (state) => {
      return elementsData.find((element) => element.id === state.filters.element);
    },
    rolesFiltered: () => {
      return rolesData.sort((a, b) => a.fields.Title.localeCompare(b.fields.Title));
    },
    roleSelected: (state) => {
      return rolesData.find((role) => role.id === state.filters.role);
    },
  },
  actions: {
    toggleCaught(aniimoId: number) {
      const idx = this.aniimo.findIndex((id) => aniimoId === id);
      if (idx < 0) {
        this.aniimo.push(aniimoId);
      } else {
        this.aniimo.splice(idx, 1);
      }
    },
    setFilter(key: keyof Filters, value: number | undefined) {
      this.filters[key] = value;
    },
    resetFilters() {
      this.filters.form = undefined;
      this.filters.element = undefined;
      this.filters.role = undefined;
    },
    resetStoreState() {
      this.aniimo = [];
      this.filters = { ...defaultFilters };
    },
  },
  persist: true,
});
