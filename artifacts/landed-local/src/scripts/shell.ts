/** Keep the existing phone-bar behavior independent of the menu-free header. */
const root = document.documentElement;
const bar = document.querySelector<HTMLElement>("[data-action-bar]");
const homeBooking = document.querySelector<HTMLAnchorElement>("[data-home-booking]");

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

homeBooking?.addEventListener("click", (event) => {
  const selector = homeBooking.dataset.homeBooking;
  const target = selector ? document.querySelector<HTMLElement>(selector) : null;
  if (!target) return;

  event.preventDefault();
  if (window.location.hash !== selector) window.history.pushState(null, "", selector);
  target.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
});

export {};
