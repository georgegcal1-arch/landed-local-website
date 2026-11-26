/** Keep the existing phone-bar behavior independent of the menu-free header. */
const root = document.documentElement;
const bar = document.querySelector<HTMLElement>("[data-action-bar]");

if (bar && !root.dataset.actionbarInit) {
  root.dataset.actionbarInit = "1";
  let ticking = false;
  const update = () => {
    bar.classList.toggle("is-visible", window.scrollY > 600);
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

export {};
