import { defineStore } from 'pinia';

type ToastType = 'success' | 'error' | 'warning';

type Toast = {
  key: string;
  message: string;
  type: ToastType;
};

const TOAST_TIMEOUT = 3000;

export const useToastStore = defineStore('toast', {
  state: () => ({ toasts: <Toast[]>[] }),
  getters: {},
  actions: {
    initToast() {
      this.toasts.forEach((toast) => {
        setTimeout(this.removeToast, TOAST_TIMEOUT, toast.key);
      });
    },
    addToast(message: string, type: ToastType = 'success') {
      const key = (Math.random() + 1).toString(36).substring(5);
      this.toasts.push({ key, message, type });
      setTimeout(this.removeToast, TOAST_TIMEOUT, key);
    },
    removeToast(key: string) {
      const idx = this.toasts.findIndex((toast) => toast.key === key);
      if (idx >= 0) {
        this.toasts.splice(idx, 1);
      }
    },
  },
});
