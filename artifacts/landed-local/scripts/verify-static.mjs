// Run after `pnpm --filter @workspace/landed-local run build`.
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const dist = new URL("dist/", root);
const read = (path) => readFile(new URL(path, dist), "utf8");
const decode = (text) => text.replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const visible = (html) => decode(html.replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const meta = (html, name) => html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`))?.[1];
const pages = {
  "index.html": "AI Receptionist, Lead Follow-Up and Automation for Local Service Businesses | Landed Local",
  "book/index.html": "Book a Consultation | Landed Local",
  "privacy/index.html": "Privacy &amp; Terms | Landed Local",
  "before-our-call/index.html": "Before Our Consultation | Landed Local",
};
for (const [file, title] of Object.entries(pages)) {
  const html = await read(file);
  assert.equal(html.match(/<title>(.*?)<\/title>/)?.[1], title, file);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: single h1`);
  assert.ok(meta(html, "description")?.length > 50, `${file}: description`);
  assert.equal(meta(html, "og:title"), title);
  assert.equal(meta(html, "og:image:width"), "1200");
  assert.equal(meta(html, "og:image:height"), "630");
}
const home = await read("index.html");
const book = await read("book/index.html");
const preCall = await read("before-our-call/index.html");
const privacy = await read("privacy/index.html");
const homeDescription = "Landed Local finds where local service businesses lose jobs and time, then builds the AI systems that fix it. Book a 30-minute consultation with George.";
const bookDescription = "Book a 30-minute consultation with George to find where jobs slip through, what that costs, and what to fix first.";
for (const [html, title, description] of [
  [home, pages["index.html"], homeDescription],
  [book, pages["book/index.html"], bookDescription],
]) {
  assert.equal(meta(html, "description"), description);
  assert.equal(meta(html, "og:title"), title);
  assert.equal(meta(html, "twitter:title"), title);
  assert.equal(meta(html, "og:description"), description);
  assert.equal(meta(html, "twitter:description"), description);
  const imageAlt = "Landed Local — Land more local jobs. AI systems for local service businesses";
  assert.equal(meta(html, "og:image:alt"), imageAlt);
  assert.equal(meta(html, "twitter:image:alt"), imageAlt);
}
const schema = [...home.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
const business = schema.find((item) => item["@type"] === "ProfessionalService");
assert.ok(business);
for (const field of ["name", "legalName", "url", "logo", "image", "telephone", "email", "address", "areaServed"]) assert.ok(business[field], field);
assert.ok(!/price|founder|owner/i.test(JSON.stringify(business)));
assert.ok(!/free|roofing|hvac|missed-jobs review|ohio[\s\u00a0]+state/i.test(JSON.stringify(schema)));
assert.equal(schema.filter((item) => item["@type"] === "ProfessionalService").length, 1);
assert.ok(schema.some((item) => item["@type"] === "FAQPage"));
assert.equal(meta(preCall, "robots"), "noindex, nofollow");
assert.ok(!preCall.includes("FAQPage"));
assert.ok(!/<a\b[^>]*class="[^"]*\bhdr__booking\b/.test(preCall));
assert.ok(!/<\w+\b[^>]*\sdata-action-bar(?:\s|=|>)/.test(preCall));
assert.ok(!preCall.includes("data-booking-embed"));
assert.ok(preCall.includes('class="hdr__phone'));
assert.ok(preCall.includes("<footer"));
assert.equal((preCall.match(/<details\b/g) || []).length, 4);
const preCallVisible = visible(preCall);
assert.ok(preCallVisible.includes("You're booked. Here's what to expect."));
assert.ok(preCallVisible.includes("A few minutes here makes our 30 minutes far more useful."));
assert.ok(preCallVisible.includes("Join from a computer if you can."));
assert.ok(preCallVisible.includes("I'll share my screen, including a live demo. The Google Meet link is in your invite."));
assert.ok(!preCallVisible.includes("Video coming soon"));
assert.ok(!preCall.includes("<iframe"));
const prepCards = preCall.match(/<ol\b[^>]*\bclass="pc-cards"[^>]*>([\s\S]*?)<\/ol>/)?.[1];
assert.ok(prepCards, "pre-call preparation cards");
const prepCardText = [...prepCards.matchAll(/<li\b[\s\S]*?<\/li>/g)].map((match) => visible(match[0]));
assert.ok(prepCardText[0]?.includes("Accept the calendar invite so it's on your calendar, and mark the email as 'I know this sender' so reminders don't go to spam."));
assert.ok(prepCardText[1]?.includes("Read this page."));
assert.ok(prepCardText[1]?.includes("What we'll cover, what to have handy, and whether it's a fit."));
const workOrdersStart = preCall.indexOf('class="pc-work-orders"');
const workOrdersEnd = preCall.indexOf("</section>", workOrdersStart);
assert.ok(workOrdersStart >= 0 && workOrdersEnd > workOrdersStart, "pre-call work orders");
assert.ok(/\.pc-work-orders\[data-astro-cid-[\w-]+\]\{[^}]*grid-template-columns:minmax\(0,1fr\)/.test(preCall), "work orders stack by default");
assert.ok(/@media \(width>=768px\)\{\.pc-work-orders\[data-astro-cid-[\w-]+\]\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)\}\}/.test(preCall), "work orders sit side by side on desktop");
const workOrders = preCall.slice(workOrdersStart, workOrdersEnd);
const workOrderHTML = [...workOrders.matchAll(/<article\b[\s\S]*?<\/article>/g)].map((match) => match[0]);
assert.equal(workOrderHTML.length, 2, "two preparation work orders");
const workOrderText = workOrderHTML.map(visible);
assert.ok(workOrderText[0].includes("Work order No. 0001 Your Consultation"));
assert.ok(workOrderText[1].includes("Work order No. 0002 Bring to the call"));
assert.deepEqual(
  [...workOrderHTML[0].matchAll(/<span class="ticket__label"[^>]*>([\s\S]*?)<\/span>/g)].map((match) => visible(match[1])),
  [
    "Where your leads come from and what happens when the phone rings",
    "How you follow up on new leads and open estimates",
    "Where jobs slip through and where your time goes",
    "Whether AI can fix it, and what that would look like",
    "About how many calls you get a week",
    "Your average job value",
  ],
);
assert.equal((workOrderHTML[0].match(/class="ticket__check"/g) || []).length, 6, "checked review items");
assert.ok(!workOrderHTML[0].includes("ticket__stamp"), "review work order has no stamp");
assert.ok(workOrderHTML[1].includes("ticket__items--plain"), "bring-to-call items are plain");
assert.ok(!workOrderHTML[1].includes("ticket__check"), "bring-to-call items have no checkmarks");
assert.ok(!workOrderHTML[1].includes("ticket__stamp"), "bring-to-call work order has no stamp");
assert.deepEqual(
  [...workOrderHTML[1].matchAll(/<span class="ticket__label"[^>]*>([\s\S]*?)<\/span>/g)].map((match) => visible(match[1])),
  [
    "About how many calls you get a week",
    "Your average job value",
    "How new leads come in today",
    "What happens to calls after hours",
    "The two or three things that frustrate you most right now",
    "30 minutes without interruptions",
  ],
);
const afterCall = preCall.match(/<section\b[^>]*>[\s\S]*?<h2[^>]*>What happens after the call<\/h2>([\s\S]*?)<\/section>/)?.[1];
assert.ok(afterCall?.includes('class="wos__list"'), "post-call work order steps");
for (const copy of [
  "No. 01 Proposal What we'd build, how it fits your business, the timeline and the investment. QUOTED",
  "No. 02 Build Usually a few weeks. We handle setup, testing and training. BUILT",
  "No. 03 Launch and support I stay your point of contact and send you a monthly report on results. LIVE",
]) assert.ok(visible(afterCall).includes(copy), copy);
assert.equal(meta(await read("styleguide/index.html"), "robots"), "noindex");

const main = (html) => html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "";
const homeMain = main(home);
const bookMain = main(book);
const mobileBar = home.match(/<div class="bar"[^>]*data-action-bar[^>]*>([\s\S]*?)<\/div>/)?.[1];
assert.ok(mobileBar && visible(mobileBar).includes("Call Book a Consultation"), "mobile bar retains Call and the full consultation CTA");
assert.equal((homeMain.match(/<section\b/g) || []).length, 7, "hero, tools, costs, services, steps, about/FAQ, CTA");
assert.equal((bookMain.match(/<section\b/g) || []).length, 2, "booking details followed by full-width calendar");
assert.ok(!/data-phone-demo|data-proof|id="proof"|id="book"|data-booking-embed|home-proof/.test(homeMain), "Home has no live demo, proof or calendar");
assert.ok(!/href=["'][^"']*#(?:book|proof)/.test(home), "no obsolete Home anchors");
assert.ok(!home.includes("data-home-booking"), "sticky bar uses normal page navigation");
const homeBookingLinks = [...home.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)]
  .filter((m) => /Book a Consultation|See if this fits your business/.test(visible(m[2])));
assert.ok(homeBookingLinks.length >= 11, "header, hero, costs, services, mobile service links, CTA and sticky bar");
for (const [, attrs] of homeBookingLinks) assert.match(attrs, /href="\/book"/, "every Home booking destination");
assert.ok(home.includes('class="svc__grid"') && home.includes('class="svc__rows"'), "both service presentations retained");
for (const copy of [
  "More Landed Jobs.", "No New Hires.",
  "We build systems that answer calls, follow up on leads and clear the admin off your plate, so you get your evenings back.",
  "30 minutes · With George · No pitch deck", "What it's costing you",
  "Five ways we fix the leaks", "Three work orders, start to finish",
  "Takes the repeat office work off your plate: invoices, estimates, follow-up texts, review requests and reports. Connected to the tools you already use.",
  "Follow-ups and review requests on autopilot",
  "The person you'll work with", "Straight answers",
  "Find out what missed calls are costing you.",
  "30-minute consultation. You'll leave with a dollar number, whether we work together or not.",
]) assert.ok(visible(homeMain).includes(copy), copy);
const tools = [...homeMain.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)].map((m) => m[0]).find((section) => section.includes("Works with the tools you already run"));
assert.ok(tools, "tools band exists");
const accessibleTools = tools.replace(/<ul\b[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/ul>/g, "");
for (const name of ["GoHighLevel", "Jobber", "ServiceTitan", "Housecall Pro", "QuickBooks", "Google Calendar"]) {
  assert.equal(visible(accessibleTools).split(name).length - 1, 1, `${name} appears once accessibly`);
}
assert.ok(tools.includes("data-tool-toggle"), "loop has a pause/play control");
assert.match(tools, /<ul\b[^>]*aria-hidden="true"/, "loop repeat is decorative");
assert.ok(!visible(tools).includes("Trusted by"), "no trust claim");
const homeHeadline = homeMain.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1];
assert.ok(homeHeadline, "Home headline");
assert.ok(homeMain.includes("draft-sheet") && homeMain.includes("hero-intro"), "Home composes the reusable drafting components");
assert.equal((homeHeadline.match(/class="[^"]*\bpencil\b/g) || []).length, 1, "only one headline underline");
assert.match(homeHeadline, /pencil__text[^>]*>Landed Jobs\.<\/span>/, "underline belongs to Landed Jobs.");
assert.ok(!/pencil__text[^>]*>No New Hires\./.test(homeHeadline), "No New Hires has no underline");
const cta = [...homeMain.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)].map((m) => m[0]).find((section) => section.includes("cta-band--ticket"));
assert.ok(cta, "Home ticket CTA");
for (const copy of ["NEXT STEP", "No. 0001", "Consultation", "How calls and leads move today", "What slips through, in dollars", "The one fix to start with", "30 min", "With George"]) {
  assert.ok(visible(cta).includes(copy), `CTA: ${copy}`);
}
assert.equal((cta.match(/class="ticket__check"/g) || []).length, 3, "CTA uses checked ticket items");
assert.match(cta, /href="\/book"[^>]*>[\s\S]*?Book a Consultation/, "ticket action navigates to booking");
const calendarSection = [...bookMain.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)].map((m) => m[0]).find((section) => section.includes("data-booking-embed"));
assert.match(calendarSection, /sec--charcoal/);
assert.match(calendarSection, /sec--blueprint/);
for (const copy of ["Pick a time that works", "Times show in your time zone. You'll get a confirmation email right away."]) {
  assert.ok(visible(calendarSection).includes(copy), `calendar: ${copy}`);
}
assert.ok(calendarSection.includes("booking-embed--card"), "calendar uses the bounded light-card variant");
assert.ok(!/Systems built by our partner developers|Past builds by our partner development team/.test(visible(homeMain)), "proof copy removed");
for (const copy of [
  "BOOK A CONSULTATION", "Book a Consultation", "30 minutes · No pressure · Clear numbers",
  "No. 0001", "Consultation",
  "How leads come in today, and where they slip through",
  "A rough dollar number on what that's costing you",
  "What fixing it looks like, and what it would take",
  "30 min", "With George", "Have these handy",
  "calls a week", "average job value", "how leads come in", "what happens to calls after hours",
  "I only take on a few new companies at a time.",
  "Google Meet or phone. Or call or text George: 614-321-8001",
]) assert.ok(visible(bookMain).toLowerCase().includes(copy.toLowerCase()), copy);
assert.ok(!/\bFREE\b|\$0|Run a different home-service business/.test(visible(bookMain)), "no free stats or other-trades note");
assert.ok(bookMain.includes("data-booking-embed"), "calendar is on /book");
const event = "https://cal.com/george-at-landed-local-u6v7fc/missed-jobs-review";
assert.match(bookMain, /data-cal-link="george-at-landed-local-u6v7fc\/missed-jobs-review"/);
assert.ok(bookMain.indexOf("data-cal-host") < bookMain.indexOf("data-cal-fallback"), "fallback is below calendar");
assert.ok(bookMain.includes(`href="${event}"`), "fallback uses same event");
assert.ok(visible(bookMain).includes("Open the booking calendar"));
const styleguide = await read("styleguide/index.html");
for (const variant of ["draft-sheet", "hero-intro", "cta-band--ticket", "tools--lg", "booking-embed--card", "pencil--lg", "tools-band", "booking-embed--inline", "hero--centered", "Not used on live pages", "Find out what missed calls are costing you."]) {
  assert.ok(styleguide.includes(variant), `styleguide: ${variant}`);
}
assert.ok(styleguide.includes("More Landed Jobs.") && styleguide.includes("No New Hires."), "styleguide hero");
assert.ok(styleguide.includes("data-phone-demo"), "retained PhoneDemo sample");
for (const copy of ["Local service", "Consultation", "30 min", "Service company", "40% → 95%", "SAMPLE", "30-minute consultation. We put a dollar number on what's slipping."]) {
  assert.ok(visible(styleguide).includes(copy), `styleguide copy: ${copy}`);
}
const embedScript = await readFile(new URL("src/scripts/booking-embed.ts", root), "utf8");
assert.ok(embedScript.includes('https://app.cal.com/embed/embed.js'), "official embed");
assert.ok(embedScript.includes('layout: "month_view"') && embedScript.includes('theme: "light"'), "month view and light theme");
assert.ok(embedScript.includes('"cal-brand": token("color-orange")'), "brand color from existing token");
assert.ok(embedScript.includes("showTimezoneWhenEventDetailsHidden: true"), "timezone selector remains available");
assert.ok(!embedScript.includes("fallback!.hidden = true"), "fallback remains available after readiness");
// The shared footer and the explicitly preserved pages should not acquire new copy.
const footer = (html) => html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0].replace(/ruler-[a-z0-9]{7}/g, "ruler-instance");
assert.equal(footer(home), footer(book), "same shared footer apart from unique SVG pattern IDs");
for (const copy of ["Cal.com", "name", "company", "phone", "email", "booking answers", "Consent to calls and texts", "booking form", "Cloudflare Web Analytics", "do not sell", "information only", "guarantee", "Ohio law", "george@landedlocal.com"]) assert.ok(visible(privacy).includes(copy), copy);
const error = visible(await read("404.html"));
assert.ok(error.includes("This page moved."));
assert.ok(error.includes("The site changed. Here's where to go next."));
const sitemap = await read("sitemap.xml");
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname).sort(), ["/", "/book", "/privacy"]);
assert.equal(sitemap, await read("sitemap-0.xml"));
for (const [from, to] of Object.entries({ websites: "/", "get-a-mockup": "/", thanks: "/", "after-launch": "/", about: "/", terms: "/privacy" })) {
  const html = await read(`${from}/index.html`);
  assert.ok(html.includes(`http-equiv="refresh" content="0;url=${to}"`), from);
  assert.ok(html.includes('content="noindex"'));
}
async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = new URL(entry.name + (entry.isDirectory() ? "/" : ""), dir);
    if (entry.isDirectory()) yield* files(path);
    else yield path;
  }
}
for await (const path of files(dist)) {
  if (!path.pathname.endsWith(".html")) continue;
  const html = await readFile(path, "utf8");
  assert.ok(!/<a\b[^>]*href=["'][^"']*\/before-our-call(?:[\/#?"'])/i.test(html), `Incoming hidden-page link: ${path.pathname}`);
  // Do not scan SVG coordinates, preserved brand paths, scripts, or historical uploads.
  const visibleText = visible(html).replace(/\/get-a-mockup\/?/g, "");
  assert.ok(!/\b(?:997|mockup|founding)\b/i.test(visibleText), `Retired visible copy: ${path.pathname}`);
  const withoutPhoneDemo = visibleText.replace(/Free estimate tomorrow at 9:00 AM or 2:30 PM\?/g, "");
  assert.ok(!/\b(?:free|roofing|hvac|trusted by)\b|ohio[\s\u00a0]+state|\$0|missed-jobs review/i.test(withoutPhoneDemo), `Stale consultation or niche wording: ${path.pathname}`);
}
const png = await readFile(new URL("public/og-image.png", root));
assert.equal(png.readUInt32BE(16), 1200);
assert.equal(png.readUInt32BE(20), 630);
console.log("Static output passed: consultation copy and metadata, booking destinations, accessible tools loop, styleguide variants, calendar configuration, schema, robots, redirects, sitemap, hidden links, and OG dimensions.");
