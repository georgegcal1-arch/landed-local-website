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
  "index.html": "AI Receptionist, Lead Follow-Up and Automation for Roofing and HVAC Companies | Landed Local",
  "book/index.html": "Book a Free Missed-Jobs Review | Landed Local",
  "privacy/index.html": "Privacy &amp; Terms | Landed Local",
  "before-our-call/index.html": "Before Our Call | Landed Local",
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
const schema = [...home.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
const business = schema.find((item) => item["@type"] === "ProfessionalService");
assert.ok(business);
for (const field of ["name", "legalName", "url", "logo", "image", "telephone", "email", "address", "areaServed"]) assert.ok(business[field], field);
assert.ok(!/price|founder|owner/i.test(JSON.stringify(business)));
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
assert.ok(workOrderText[0].includes("Work order No. 0001 Your Missed-Jobs Review"));
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

const bookingSection = (html) => html.match(/<section\b[^>]*id="book"[\s\S]*?<\/section>/)?.[0];
assert.ok(bookingSection(home));
assert.equal(bookingSection(home), bookingSection(book).replace(/<h1\b/g, "<h2").replace(/<\/h1>/g, "</h2>"));
assert.equal((home.match(/<main\b[\s\S]*?<\/main>/)?.[0].match(/<section\b/g) || []).length, 7);
assert.equal((book.match(/<main\b[\s\S]*?<\/main>/)?.[0].match(/<section\b/g) || []).length, 1);
assert.ok(home.includes("data-booking-embed") && book.includes("data-booking-embed"));
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
  assert.ok(!/\b(?:997|mockup|founding)\b/i.test(visible(html).replace(/\/get-a-mockup\/?/g, "")), `Retired visible copy: ${path.pathname}`);
}
const png = await readFile(new URL("public/og-image.png", root));
assert.equal(png.readUInt32BE(16), 1200);
assert.equal(png.readUInt32BE(20), 630);
console.log("Static output passed: exact titles/copy, shared booking, schema, robots, six redirects, sitemap, hidden links, retired copy, and OG dimensions.");
