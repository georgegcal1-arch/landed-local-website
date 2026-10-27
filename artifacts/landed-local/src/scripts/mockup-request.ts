/** Front-end preview only. Sending will be connected separately. */
const requestForm = document.querySelector<HTMLFormElement>("[data-mockup-request-form]");

if (requestForm) {
  const input = (id: string) => requestForm.querySelector<HTMLInputElement>(`#request-${id}`)!;
  const name = input("name");
  const business = input("business");
  const city = input("city");
  const trade = requestForm.querySelector<HTMLSelectElement>("#request-trade")!;
  const otherTrade = input("other-trade");
  const email = input("email");
  const phone = input("phone");
  const website = input("website");
  const noWebsite = input("no-website");
  const otherTradeField = requestForm.querySelector<HTMLElement>("[data-other-trade-field]")!;
  const submit = requestForm.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const status = requestForm.querySelector<HTMLElement>("[data-form-status]")!;
  const controls = [name, business, city, trade, otherTrade, email];
  const requiredMessages: Record<string, string> = {
    "request-name": "Please add your name",
    "request-business": "Please add your business name",
    "request-city": "Please add your city or town",
    "request-trade": "Please choose your trade",
    "request-other-trade": "Please add your trade",
    "request-email": "Please add your email",
  };

  const setError = (control: HTMLInputElement | HTMLSelectElement, message: string) => {
    const error = requestForm.querySelector<HTMLElement>(`#${control.id}-error`)!;
    error.textContent = message;
    error.hidden = !message;
    if (message) control.setAttribute("aria-invalid", "true");
    else control.removeAttribute("aria-invalid");
  };

  const validate = (control: HTMLInputElement | HTMLSelectElement) => {
    let error = "";
    if (!control.disabled) {
      const value = control.value.trim();
      if (!value) {
        error = requiredMessages[control.id] ?? "";
      } else if (control === email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "That email doesn't look right";
      }
    }
    setError(control, error);
    return !error;
  };

  const updateTrade = () => {
    const isOther = trade.value === "Other";
    otherTradeField.hidden = !isOther;
    otherTrade.disabled = !isOther;
    otherTrade.required = isOther;
    if (!isOther) setError(otherTrade, "");
  };

  const updateWebsite = () => {
    // Preserve any entered URL so unchecking the box restores it.
    website.disabled = noWebsite.checked;
  };

  const currentUrl = new URL(window.location.href);
  const metadata: Record<string, string> = {
    pageUrl: currentUrl.href,
    referrer: document.referrer,
    utm_source: currentUrl.searchParams.get("utm_source") ?? "",
    utm_medium: currentUrl.searchParams.get("utm_medium") ?? "",
    utm_campaign: currentUrl.searchParams.get("utm_campaign") ?? "",
  };
  for (const [key, value] of Object.entries(metadata)) {
    requestForm.querySelector<HTMLInputElement>(`input[name="${key}"]`)!.value = value;
  }

  requestForm.addEventListener("focusout", (event) => {
    const control = event.target;
    if (controls.some((candidate) => candidate === control)) {
      validate(control as HTMLInputElement | HTMLSelectElement);
    }
  });

  requestForm.addEventListener("input", (event) => {
    status.hidden = true;
    const control = event.target;
    if (controls.some((candidate) => candidate === control) && (control as HTMLElement).hasAttribute("aria-invalid")) {
      validate(control as HTMLInputElement | HTMLSelectElement);
    }
  });

  trade.addEventListener("change", () => {
    updateTrade();
    validate(trade);
  });
  noWebsite.addEventListener("change", updateWebsite);

  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    status.hidden = true;
    const invalid = controls.filter((control) => !validate(control));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const values = {
      name: name.value.trim(),
      businessName: business.value.trim(),
      city: city.value.trim(),
      trade: trade.value,
      otherTrade: trade.value === "Other" ? otherTrade.value.trim() : "",
      email: email.value.trim(),
      phone: phone.value.trim(),
      website: noWebsite.checked ? "" : website.value.trim(),
      noWebsite: noWebsite.checked,
      ...metadata,
    };
    console.log("Mockup request (preview only; not sent)", values);
    status.textContent = "Your details were logged for testing. Nothing has been sent yet.";
    status.hidden = false;
  });

  updateTrade();
  updateWebsite();
  submit.disabled = false;

  // Storage may be unavailable or contain old/malformed data. Neither should block manual entry.
  let prefilled = false;
  try {
    const saved = sessionStorage.getItem("mockupPrefill");
    if (saved) {
      try {
        const values: unknown = JSON.parse(saved);
        if (values && typeof values === "object" && !Array.isArray(values)) {
          const record = values as Record<string, unknown>;
          for (const [key, control] of [["name", name], ["businessName", business], ["email", email]] as const) {
            if (typeof record[key] === "string") {
              control.value = record[key];
              prefilled = true;
            }
          }
        }
      } finally {
        sessionStorage.removeItem("mockupPrefill");
      }
    }
  } catch {
    // Continue with the empty form; no visitor-entered values are cleared.
  }
  if (prefilled) window.requestAnimationFrame(() => city.focus());
}

export {};
