import aniimoHomelandAbilities from '@/data/aniimo-homeland-abilities.json';
import aniimoData from '@/data/aniimo.json';
import elementsData from '@/data/elements.json';
import formsData from '@/data/forms.json';
import homelandAbilities from '@/data/homeland-abilities.json';
import rolesData from '@/data/roles.json';
import Fuse from 'fuse.js/basic';
import { defineStore } from 'pinia';

const aniimoHomelandAbilitiesTable = aniimoHomelandAbilities.map((aniimoHomelandAbility) => ({
  aniimoHomelandAbilityId: aniimoHomelandAbility.id,
  homelandAbilityId: aniimoHomelandAbility.fields.HomelandAbility.id,
}));

type Filters = {
  form: undefined | number;
  element: undefined | number;
  role: undefined | number;
  caught: undefined | number;
  homelandAbility: undefined | number;
};

const defaultFilters: Filters = {
  form: undefined,
  element: undefined,
  role: undefined,
  caught: undefined,
  homelandAbility: undefined,
};

export const useAniilogStore = defineStore('aniilog', {
  state: () => ({ aniimo: <number[]>[], filters: { ...defaultFilters }, searchQuery: <string>'' }),
  getters: {
    aniimoTotal: (): number => {
      return aniimoData.length;
    },
    aniimoCaughtTotal: (state): number => {
      return state.aniimo.length;
    },
    aniimoFiltered: (state) => {
      const aniimo = aniimoData
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
          if (!state.filters.homelandAbility) {
            return true;
          }

          const ids = aniimoHomelandAbilitiesTable
            .filter((table) => table.homelandAbilityId === state.filters.homelandAbility)
            .map((ability) => ability.aniimoHomelandAbilityId);

          return aniimo.fields.HomelandAbilities.some((ability) => ids.includes(ability.id));
        })
        .filter((aniimo) => {
          if (!state.filters.caught) {
            return true;
          }
          return aniimo.caught !== true;
        });

      if (!state.searchQuery) {
        return aniimo;
      }

      const fuse = new Fuse(aniimo, {
        keys: ['fields.Title'],
        ignoreDiacritics: true,
      });

      return fuse.search(state.searchQuery).map(({ item, score }) => ({
        ...item,
        _score: score,
      }));
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
    homelandAbilitiesFiltered: () => {
      return homelandAbilities;
    },
    homelandAbilitySelected: (state) => {
      return homelandAbilities.find(
        (homelandAbility) => homelandAbility.id === state.filters.homelandAbility,
      );
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
      this.filters.homelandAbility = undefined;
    },
    resetStoreState() {
      this.aniimo = [];
      this.filters = { ...defaultFilters };
    },
  },
  persist: {
    pick: ['aniimo', 'filters'],
  },
});
