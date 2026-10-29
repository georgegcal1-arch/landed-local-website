/** Header menu (focus trap, Escape, scroll lock, focus return) and mobile action bar. */
const root = document.documentElement;
const menu = document.getElementById("site-menu");
const openBtn = document.querySelector<HTMLButtonElement>("[data-menu-open]");
const closeBtn = document.querySelector<HTMLButtonElement>("[data-menu-close]");
const desktop = window.matchMedia("(min-width: 900px)");
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
let background: HTMLElement[] = [];

function isOpen() {
  return !!menu && !menu.hidden;
}

function openMenu() {
  if (!menu) return;
  menu.hidden = false;
  background = Array.from(document.querySelectorAll<HTMLElement>("body > header, body > main, body > footer, [data-action-bar], .skip-link")).filter((el) => !el.inert);
  background.forEach((el) => { el.inert = true; });
  root.classList.add("menu-open");
  root.style.overflow = "hidden";
  openBtn?.setAttribute("aria-expanded", "true");
  closeBtn?.focus();
}

function closeMenu(returnFocus = true) {
  if (!menu || menu.hidden) return;
  menu.hidden = true;
  background.forEach((el) => { el.inert = false; });
  background = [];
  root.classList.remove("menu-open");
  root.style.overflow = "";
  openBtn?.setAttribute("aria-expanded", "false");
  if (returnFocus) openBtn?.focus();
}

if (menu && !root.dataset.shellInit) {
  root.dataset.shellInit = "1";
  openBtn?.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", () => closeMenu());
  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key !== "Tab") return;
    const items = Array.from(menu.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !menu.contains(document.activeElement))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  desktop.addEventListener("change", (e) => {
    if (e.matches) closeMenu(false);
  });

  const bar = document.querySelector<HTMLElement>("[data-action-bar]");
  if (bar) {
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
}
export {};
