import aniimoHomelandAbilities from '@/data/aniimo-homeland-abilities.json';
import aniimoData from '@/data/aniimo.json';
import elementsData from '@/data/elements.json';
import formsData from '@/data/forms.json';
import homelandAbilities from '@/data/homeland-abilities.json';
import rolesData from '@/data/roles.json';
import Fuse from 'fuse.js/basic';
import {
  compressToEncodedURIComponent as pack,
  decompressFromEncodedURIComponent as unpack,
} from 'lz-string';
import { defineStore } from 'pinia';
import QRCode from 'qrcode';

const aniimoHomelandAbilitiesTable = aniimoHomelandAbilities.map((aniimoHomelandAbility) => ({
  aniimoHomelandAbilityId: aniimoHomelandAbility.id,
  homelandAbilityId: aniimoHomelandAbility.fields.HomelandAbility.id,
  level: aniimoHomelandAbility.fields.Level,
}));

type Filters = {
  form: undefined | number;
  element: undefined | number;
  role: undefined | number;
  caught: undefined | number;
  unavailable: undefined | number;
  homelandAbility: undefined | number;
};

const defaultFilters: Filters = {
  form: undefined,
  element: undefined,
  role: undefined,
  caught: undefined,
  unavailable: undefined,
  homelandAbility: undefined,
};

export const useAniilogStore = defineStore('aniilog', {
  state: () => ({
    aniimo: <number[]>[],
    homeland: <number[]>[],
    filters: { ...defaultFilters },
    searchQuery: <string>'',
    qrcode: <string>'',
  }),
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
          homeland: state.homeland.indexOf(aniimo.id) >= 0,
          homelandCount: state.homeland.filter((h) => h === aniimo.id)?.length,
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
        })
        .filter((aniimo) => {
          if (!state.filters.unavailable) {
            return true;
          }
          return aniimo.fields.Number > 0;
        });

      if (!state.searchQuery) {
        return aniimo;
      }

      const fuse = new Fuse(aniimo, {
        keys: ['fields.Title'],
        ignoreDiacritics: true,
        threshold: 0.25,
      });

      return fuse.search(state.searchQuery).map(({ item, score }) => ({
        ...item,
        _score: score,
      }));
    },
    aniimoHomelandFiltered: (state) => {
      return aniimoData
        .filter((aniimo) => state.homeland.indexOf(aniimo.id) >= 0)
        .map((aniimo) => ({
          ...aniimo,
          homelandCount: state.homeland.filter((h) => h === aniimo.id)?.length,
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
      return homelandAbilities.sort((a, b) => a.fields.Title.localeCompare(b.fields.Title));
    },
    homelandAbilitySelected: (state) => {
      return homelandAbilities.find(
        (homelandAbility) => homelandAbility.id === state.filters.homelandAbility,
      );
    },
    homelandAbilitiesTotals: (state) => {
      const totals = new Map<number, number>();

      state.homeland.forEach((aniimoId) => {
        const aniimo = aniimoData.find((a) => a.id === aniimoId);
        if (!aniimo) return;

        aniimo.fields.HomelandAbilities.forEach((ability) => {
          const entry = aniimoHomelandAbilitiesTable.find(
            (table) => table.aniimoHomelandAbilityId === ability.id,
          );
          if (!entry) return;

          const current = totals.get(entry.homelandAbilityId) ?? 0;
          totals.set(entry.homelandAbilityId, current + entry.level);
        });
      });

      return Array.from(totals.entries()).map(([id, total]) => {
        const homelandAbility = homelandAbilities.find((h) => h.id === id);
        return { id, icon: homelandAbility?.fields.Icon, total };
      });
    },
    exportCodeLink: (state) => {
      // http://localhost:5173/?save=N4IghiBcDaCMsBoBsCBMBmAnAgHA2ALPgKz4pGkDsC2sADPguvs+g6tgQwcwagLoIQACyhxGiIkUQyJc2ZP4BfIA
      const code = pack(JSON.stringify({ a: state.aniimo, h: state.homeland }));
      const link = `${location.origin}/?save=${code}`;
      return link;
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
      this.homeland = [];
      this.filters = { ...defaultFilters };
    },
    toggleHomeland(aniimoId: number) {
      const idx = this.homeland.indexOf(aniimoId);
      if (idx < 0) {
        this.homeland.push(aniimoId);
      } else {
        this.homeland.splice(idx, 1);
      }
    },
    addToHomeland(aniimoId: number) {
      this.homeland.push(aniimoId);
    },
    removeFromHomeland(aniimoId: number) {
      const idx = this.homeland.indexOf(aniimoId);
      if (idx >= 0) {
        this.homeland.splice(idx, 1);
      }
    },
    importAniilogFromUrl() {
      const params = new URLSearchParams(document.location.search);
      const save = params.get('save');

      if (!save) return;

      const data = JSON.parse(unpack(save));
      if (data.a) {
        this.aniimo = data.a;
      }
      if (data.h) {
        this.homeland = data.h;
      }
      return history.replaceState(null, '', '/');
    },
    async generateQRCode() {
      try {
        this.qrcode = await QRCode.toDataURL(this.exportCodeLink, {
          errorCorrectionLevel: 'L',
          margin: 1,
          width: 272,
        });
      } catch {
        this.qrcode = '';
      }
    },
  },
  persist: {
    pick: ['aniimo', 'homeland', 'filters'],
  },
});
