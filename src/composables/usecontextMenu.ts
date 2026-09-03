import { onMounted, onUnmounted, ref } from 'vue';

export function useContextMenu() {
  const visible = ref<boolean>(false);
  const x = ref<number>(0);
  const y = ref<number>(0);

  function open(event: MouseEvent): void {
    event.preventDefault();

    // Ajustement pour éviter que le menu sorte de l'écran
    const menuWidth = 192; // largeur estimée du menu
    const menuHeight = 200; // hauteur estimée du menu

    x.value =
      event.clientX + menuWidth > window.innerWidth ? event.clientX - menuWidth : event.clientX;

    y.value =
      event.clientY + menuHeight > window.innerHeight ? event.clientY - menuHeight : event.clientY;

    visible.value = true;
  }

  function close(): void {
    visible.value = false;
  }

  onMounted(() => {
    window.addEventListener('click', close);
    window.addEventListener('contextmenu', close);
    window.addEventListener('scroll', close);
  });

  onUnmounted(() => {
    window.removeEventListener('click', close);
    window.removeEventListener('contextmenu', close);
    window.removeEventListener('scrool', close);
  });

  return { visible, x, y, open, close };
}
