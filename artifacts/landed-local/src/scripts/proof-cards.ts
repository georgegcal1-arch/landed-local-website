/** The native overflow row remains readable and swipeable without this enhancement. */
document.querySelectorAll<HTMLElement>("[data-proof]").forEach((proof) => {
  const row = proof.querySelector<HTMLElement>("[data-proof-row]");
  const controls = proof.querySelector<HTMLElement>("[data-proof-dots]");
  const cards = Array.from(proof.querySelectorAll<HTMLElement>(".home-proof__card"));
  const dots = Array.from(proof.querySelectorAll<HTMLButtonElement>("[data-proof-dot]"));
  if (!row || !controls || !cards.length || cards.length !== dots.length) return;

  const update = () => {
    const left = row.getBoundingClientRect().left;
    const nearest = cards.reduce((best, card, index) =>
      Math.abs(card.getBoundingClientRect().left - left) <
      Math.abs(cards[best].getBoundingClientRect().left - left) ? index : best, 0);
    dots.forEach((dot, index) => dot.setAttribute("aria-current", String(index === nearest)));
  };
  const navigate = (index: number) => {
    row.scrollTo({
      left: cards[index].getBoundingClientRect().left - cards[0].getBoundingClientRect().left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => navigate(index));
    dot.addEventListener("keydown", (event) => {
      let next: number;
      if (event.key === "ArrowRight") next = (index + 1) % dots.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + dots.length) % dots.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = dots.length - 1;
      else return;
      event.preventDefault();
      dots[next].focus({ preventScroll: true });
      navigate(next);
    });
  });
  let pending = false;
  row.addEventListener("scroll", () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; update(); });
  }, { passive: true });
  new ResizeObserver(update).observe(row);
  controls.hidden = false;
  update();
});

export {};
