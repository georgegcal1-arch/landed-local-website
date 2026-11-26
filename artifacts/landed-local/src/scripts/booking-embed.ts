/**
 * Cal's official embed queue protocol, loaded only by BookingEmbed.
 * Each instance has its own namespace, readiness callbacks and failure fallback.
 */
import { site } from "../config/site";
import { registerBookingSuccess } from "./booking-success";

type Instruction = unknown[];
type CalQueue = ((...args: unknown[]) => void) & { q: Instruction[] };
type CalApi = CalQueue & { ns: Record<string, CalQueue>; loaded?: boolean };
type CalWindow = Window & { Cal?: CalApi };

let scriptPromise: Promise<CalApi> | undefined;

function loadCal(): Promise<CalApi> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const calWindow = window as CalWindow;
    if (calWindow.Cal?.loaded) {
      resolve(calWindow.Cal);
      return;
    }
    // Match the official bootstrap: queue instructions until embed.js takes over.
    const cal = ((...args: unknown[]) => {
      if (args[0] === "init" && typeof args[1] === "string") {
        const namespace = args[1];
        if (!cal.ns[namespace]) {
          const api = ((...instructions: unknown[]) => { api.q.push(instructions); }) as CalQueue;
          api.q = [];
          cal.ns[namespace] = api;
        }
        cal.ns[namespace].q.push(args);
        cal.q.push(["initNamespace", namespace]);
        return;
      }
      cal.q.push(args);
    }) as CalApi;
    cal.q = [];
    cal.ns = {};
    cal.loaded = true;
    calWindow.Cal = cal;
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    script.onload = () => resolve(cal);
    script.onerror = () => reject(new Error("The Cal.com embed script could not load."));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

document.querySelectorAll<HTMLElement>("[data-booking-embed]").forEach((panel, index) => {
  const host = panel.querySelector<HTMLElement>("[data-cal-host]");
  const status = panel.querySelector<HTMLElement>("[data-cal-status]");
  const fallback = panel.querySelector<HTMLElement>("[data-cal-fallback]");
  const calLink = panel.dataset.calLink;
  if (!host || !status || !fallback || !calLink || panel.dataset.calInit) return;
  panel.dataset.calInit = "1";

  async function start() {
    panel.dataset.calState = "loading";
    host!.hidden = false;
    status!.hidden = false;
    let finished = false;
    const failed = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      panel.dataset.calState = "failed";
      host!.hidden = true;
      status!.hidden = false;
      status!.textContent = "The inline calendar couldn't load. You can still book using the button below.";
      fallback!.hidden = false;
    };
    const ready = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      panel.dataset.calState = "ready";
      status!.hidden = true;
      // Keep the same-event link available even when the inline calendar loads.
      fallback!.hidden = false;
    };
    const timeout = window.setTimeout(failed, 20000);
    try {
      const cal = await loadCal();
      if (finished) return;
      const namespace = `landed-local-${index}`;
      const styles = getComputedStyle(panel);
      const token = (name: string) => {
        const value = styles.getPropertyValue(`--${name}`).trim();
        if (!value) throw new Error(`Missing calendar design token: ${name}`);
        return value;
      };
      const theme = {
        "cal-brand": token("color-orange"),
        "cal-brand-emphasis": token("color-orange"),
        "cal-brand-text": token("color-charcoal"),
        "cal-brand-accent": token("color-charcoal"),
        "cal-bg": token("color-paper"),
        "cal-bg-subtle": token("color-offwhite"),
        "cal-text": token("color-charcoal"),
        "cal-text-emphasis": token("color-charcoal"),
        "cal-border": token("color-rule"),
        radius: token("radius-sharp"),
      };
      cal("init", namespace, { origin: "https://cal.com" });
      const api = cal.ns[namespace];
      api("on", { action: "linkReady", callback: ready });
      api("on", { action: "linkFailed", callback: failed });
      registerBookingSuccess(api, site.preCall.path, (path) => window.location.assign(path));
      api("inline", {
        elementOrSelector: host,
        calLink,
        config: { layout: "month_view", theme: "light" },
      });
      api("ui", {
        theme: "light",
        layout: "month_view",
        hideEventTypeDetails: true,
        showTimezoneWhenEventDetailsHidden: true,
        cssVarsPerTheme: { light: theme, dark: theme },
      });
    } catch (error) {
      console.warn("Booking calendar unavailable.", error);
      failed();
    }
  }

  // Avoid downloading a third-party calendar until its panel is near the viewport.
  if ("IntersectionObserver" in window) {
    const margin = getComputedStyle(panel).getPropertyValue("--section-y").trim();
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      void start();
    }, { rootMargin: margin || "0px" });
    observer.observe(panel);
  } else {
    void start();
  }
});

export {};
