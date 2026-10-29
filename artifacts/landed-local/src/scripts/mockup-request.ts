import { site } from "../config/site";

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
  const botcheck = requestForm.querySelector<HTMLInputElement>('input[name="botcheck"]')!;
  const otherTradeField = requestForm.querySelector<HTMLElement>("[data-other-trade-field]")!;
  const submit = requestForm.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const status = requestForm.querySelector<HTMLElement>("[data-form-status]")!;
  const controls = [name, business, city, trade, otherTrade, email];
  let sending = false;
  const submitLabel = submit.textContent;
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

  requestForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending || botcheck.checked) return;
    status.hidden = true;
    const invalid = controls.filter((control) => !validate(control));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const values = {
      access_key: site.forms.web3formsKey,
      subject: `New mockup request: ${business.value.trim()} (${city.value.trim()})`,
      from_name: "Landed Local website",
      name: name.value.trim(),
      business: business.value.trim(),
      city: city.value.trim(),
      trade: trade.value === "Other" ? otherTrade.value.trim() : trade.value,
      email: email.value.trim(),
      phone: phone.value.trim(),
      website: noWebsite.checked ? "" : website.value.trim(),
      no_website: noWebsite.checked ? "Yes" : "No",
      page: metadata.pageUrl,
      referrer: metadata.referrer,
      utm_source: metadata.utm_source,
      utm_medium: metadata.utm_medium,
      utm_campaign: metadata.utm_campaign,
      botcheck: false,
    };
    sending = true;
    submit.disabled = true;
    submit.textContent = "Sending...";
    requestForm.setAttribute("aria-busy", "true");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12_000);
    try {
      if (!values.access_key.trim()) throw new Error("Missing form configuration");
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
        signal: controller.signal,
      });
      const result: unknown = await response.json();
      if (!response.ok || !result || typeof result !== "object" ||
          !("success" in result) || result.success !== true) {
        throw new Error("Submission was not accepted");
      }
      try {
        sessionStorage.setItem("mockupFirstName", values.name.split(/\s+/)[0]);
      } catch {
        // A blocked storage policy must not prevent confirmation of a sent request.
      }
      window.location.assign("/thanks");
    } catch {
      status.textContent = `Something went wrong sending your request. Please try again, or call or text ${site.contact.phoneDisplay}.`;
      status.hidden = false;
      sending = false;
      submit.disabled = false;
      submit.textContent = submitLabel;
    } finally {
      window.clearTimeout(timeout);
      requestForm.removeAttribute("aria-busy");
    }
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
