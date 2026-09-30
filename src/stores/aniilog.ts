import aniimoHomelandAbilities from '@/data/aniimo-homeland-abilities.json';
import aniimoData from '@/data/aniimo.json';
import elementsData from '@/data/elements.json';
import formsData from '@/data/forms.json';
import homelandAbilities from '@/data/homeland-abilities.json';
import rolesData from '@/data/roles.json';
import stagesData from '@/data/stages.json';
import { useToastStore } from '@/stores/toast';
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
  homelandAbility: undefined | number;
  status: undefined | number;
  caught: undefined | number;
  stage: undefined | number;
};

type PathfinderCard = {
  background: undefined | string;
  color: undefined | string;
  username: undefined | string;
  uid?: string;
  aniimo: undefined | number;
};

type Settings = {
  umbral: boolean;
  sparkling: boolean;
  homelandAbilities: boolean;
  elements: boolean;
  roles: boolean;
  stages: boolean;
  homeland: boolean;
};

const defaultFilters: Filters = {
  form: undefined,
  element: undefined,
  role: undefined,
  homelandAbility: undefined,
  status: undefined,
  caught: undefined,
  stage: undefined,
};

const defaultPathfinderCard: PathfinderCard = {
  background: '#3d3d50',
  color: '#d3d4eb',
  username: undefined,
  uid: undefined,
  aniimo: undefined,
};

const defaultSettings: Settings = {
  umbral: true,
  sparkling: true,
  homelandAbilities: true,
  elements: true,
  roles: true,
  stages: true,
  homeland: true,
};

export const useAniilogStore = defineStore('aniilog', {
  state: () => ({
    aniimo: <number[]>[],
    sparkling: <number[]>[],
    umbral: <number[]>[],
    homeland: <number[]>[],
    filters: { ...defaultFilters },
    searchQuery: <string>'',
    qrcode: <string>'',
    pathfinderCard: { ...defaultPathfinderCard },
    settings: { ...defaultSettings },
  }),
  getters: {
    activefiltersCount: (state) => {
      return Object.values(state.filters).filter((filter) => filter !== undefined).length;
    },
    statistics: (state) => {
      const caughtIds = [...new Set([...state.aniimo, ...state.sparkling, ...state.umbral])];
      const caught = caughtIds.map((aniimoId) => ({
        ...aniimoData.find((ad) => ad.id === aniimoId),
      })).length;
      const prismana = caughtIds.filter(
        (id) => aniimoData.find((ad) => ad.id === id)?.fields.Form.id === 5,
      ).length;
      const umbral = state.umbral.map((aniimoId) => ({
        ...aniimoData.find((ad) => ad.id === aniimoId),
      })).length;
      const sparkling = state.sparkling.map((aniimoId) => ({
        ...aniimoData.find((ad) => ad.id === aniimoId),
      })).length;
      return {
        caught: caught - prismana,
        prismana,
        sparkling,
        umbral,
      };
    },
    aniimoTotal: (): number => {
      return aniimoData.filter((aniimo) => aniimo.fields.Hide !== true).length;
    },
    aniimoCaughtTotal: (state): number => {
      return [...new Set([...state.aniimo, ...state.sparkling, ...state.umbral])].length;
    },
    aniimoFiltered: (state) => {
      const aniimo = aniimoData
        .filter((aniimo) => aniimo.fields.Hide !== true)
        .map((aniimo) => ({
          ...aniimo,
          caught: state.aniimo.indexOf(aniimo.id) >= 0,
          sparkling: state.sparkling.indexOf(aniimo.id) >= 0,
          umbral: state.umbral.indexOf(aniimo.id) >= 0,
          homeland: state.homeland.indexOf(aniimo.id) >= 0,
          homelandCount: state.homeland.filter((h) => h === aniimo.id)?.length,
        }))
        .filter((aniimo) => {
          if (state.filters.status === undefined) {
            return true;
          }
          if (state.filters.status === 0) {
            return !aniimo.caught && !aniimo.sparkling && !aniimo.umbral;
          }
          return aniimo.caught || aniimo.sparkling || aniimo.umbral;
        })
        .filter((aniimo) => {
          if (!state.filters.stage) {
            return true;
          }
          return aniimo.fields.Stage?.id === state.filters.stage;
        })
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
        .filter((aniimo) => aniimo.fields.Hide !== true)
        .filter((aniimo) => state.homeland.indexOf(aniimo.id) >= 0)
        .map((aniimo) => ({
          ...aniimo,
          homelandCount: state.homeland.filter((h) => h === aniimo.id)?.length,
        }));
    },
    formsFiltered: () => {
      return formsData
        .filter((form) => form.id !== 6)
        .sort((a, b) => a.fields.Title.localeCompare(b.fields.Title));
    },
    formSelected: (state) => {
      return formsData.find((form) => form.id === state.filters.form);
    },
    statusSelected: (state) => {
      return state.filters.status;
    },
    elementsFiltered: () => {
      return elementsData.sort((a, b) => a.fields.Title.localeCompare(b.fields.Title));
    },
    elementSelected: (state) => {
      return elementsData.find((element) => element.id === state.filters.element);
    },
    stagesFiltered: () => {
      return stagesData;
    },
    stageSelected: (state) => {
      return stagesData.find((stage) => stage.id === state.filters.stage);
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
      const code = pack(
        JSON.stringify({ a: state.aniimo, h: state.homeland, s: state.sparkling, u: state.umbral }),
      );
      const link = `${location.origin}/?save=${code}`;
      return link;
    },
  },
  actions: {
    toggleCaught(aniimoId: number) {
      const idx = this.aniimo.findIndex((id) => aniimoId === id);
      const aniimo = aniimoData.find((aniimo) => aniimo.id === aniimoId);
      if (idx < 0) {
        this.aniimo.push(aniimoId);
        useToastStore().addToast(
          `${aniimo?.fields.Title} (${aniimo?.fields.Form.fields.Title}) capturé·e.`,
        );
      } else {
        this.aniimo.splice(idx, 1);
        useToastStore().addToast(
          `${aniimo?.fields.Title} (${aniimo?.fields.Form.fields.Title}) relâché·e.`,
        );
      }
    },
    toggleSparkling(aniimoId: number) {
      const idx = this.sparkling.findIndex((id) => aniimoId === id);
      const aniimo = aniimoData.find((aniimo) => aniimo.id === aniimoId);
      if (idx < 0) {
        this.sparkling.push(aniimoId);
        useToastStore().addToast(
          `${aniimo?.fields.Title} (${aniimo?.fields.Form.fields.Title}) capturé·e (étincelant).`,
        );
      } else {
        this.sparkling.splice(idx, 1);
        useToastStore().addToast(
          `${aniimo?.fields.Title} (${aniimo?.fields.Form.fields.Title}) relâché·e (étincelant).`,
        );
      }
    },
    toggleUmbral(aniimoId: number) {
      const idx = this.umbral.findIndex((id) => aniimoId === id);
      const aniimo = aniimoData.find((aniimo) => aniimo.id === aniimoId);
      if (idx < 0) {
        this.umbral.push(aniimoId);
        useToastStore().addToast(
          `${aniimo?.fields.Title} (${aniimo?.fields.Form.fields.Title}) capturé·e (ombral).`,
        );
      } else {
        this.umbral.splice(idx, 1);
        useToastStore().addToast(
          `${aniimo?.fields.Title} (${aniimo?.fields.Form.fields.Title}) relâché·e (ombral).`,
        );
      }
    },
    setFilter(key: keyof Filters, value: number | undefined) {
      this.filters[key] = value;
    },
    resetFilters() {
      this.filters = { ...defaultFilters };
    },
    resetStoreState() {
      this.aniimo = [];
      this.sparkling = [];
      this.umbral = [];
      this.homeland = [];
      this.pathfinderCard = { ...defaultPathfinderCard };
      this.resetFilters();
      this.settings = { ...defaultSettings };
    },
    resetPathfinderCard() {
      this.pathfinderCard = { ...defaultPathfinderCard };
    },
    addToHomeland(aniimoId: number) {
      const aniimo = aniimoData.find((aniimo) => aniimo.id === aniimoId);
      this.homeland.push(aniimoId);
      useToastStore().addToast(
        `${aniimo?.fields.Title} (${aniimo?.fields.Form.fields.Title}) ajouté·e au foyer.`,
      );
    },
    removeFromHomeland(aniimoId: number) {
      const idx = this.homeland.indexOf(aniimoId);
      const aniimo = aniimoData.find((aniimo) => aniimo.id === aniimoId);
      if (idx >= 0) {
        this.homeland.splice(idx, 1);
        useToastStore().addToast(
          `${aniimo?.fields.Title} (${aniimo?.fields.Form.fields.Title}) retiré·e du foyer.`,
        );
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
      if (data.s) {
        this.sparkling = data.s;
      }
      if (data.u) {
        this.umbral = data.u;
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
    pick: ['aniimo', 'sparkling', 'umbral', 'homeland', 'filters', 'pathfinderCard', 'settings'],
  },
});
