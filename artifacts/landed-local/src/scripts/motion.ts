/**
 * Shared once-only reveal motion. Elements with [data-reveal] get .is-in when they
 * enter the viewport, then are unobserved. Hidden start states only apply while
 * <html> has .motion-ok, so content is fully visible without JS or with reduced motion.
 */
const query = window.matchMedia("(prefers-reduced-motion: reduce)");
const root = document.documentElement;
let observer: IntersectionObserver | null = null;

function reveal(el: Element) {
  el.classList.add("is-in");
}

function start() {
  const targets = document.querySelectorAll("[data-reveal]:not(.is-in)");
  if (query.matches || !("IntersectionObserver" in window)) {
    root.classList.remove("motion-ok");
    targets.forEach(reveal);
    return;
  }
  root.classList.add("motion-ok");
  observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target);
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
  );
  targets.forEach((el) => observer!.observe(el));
}

function stop() {
  observer?.disconnect();
  observer = null;
  root.classList.remove("motion-ok");
  document.querySelectorAll("[data-reveal]").forEach(reveal);
}

if (!root.dataset.motionInit) {
  root.dataset.motionInit = "1";
  start();
  query.addEventListener("change", () => (query.matches ? stop() : start()));
}
