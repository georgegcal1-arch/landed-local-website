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
assert.equal(meta(await read("styleguide/index.html"), "robots"), "noindex");

const bookingSection = (html) => html.match(/<section\b[^>]*id="book"[\s\S]*?<\/section>/)?.[0];
assert.ok(bookingSection(home));
assert.equal(bookingSection(home), bookingSection(book).replace(/<h1\b/g, "<h2").replace(/<\/h1>/g, "</h2>"));
assert.equal((home.match(/<main\b[\s\S]*?<\/main>/)?.[0].match(/<section\b/g) || []).length, 7);
assert.equal((book.match(/<main\b[\s\S]*?<\/main>/)?.[0].match(/<section\b/g) || []).length, 1);
assert.ok(home.includes("data-booking-embed") && book.includes("data-booking-embed"));
for (const copy of ["Cal.com", "name", "company", "phone", "email", "booking answers", "Consent to calls and texts", "booking form", "Cloudflare Web Analytics", "do not sell", "information only", "guarantee", "Ohio law", "george@landedlocal.com"]) assert.ok(visible(privacy).includes(copy), copy);
const spec = await readFile(new URL("../../attached_assets/Pasted-Step-6-finish-the-other-pages-and-tidy-up-Do-1-book-tur_1795108156150.txt", root), "utf8");
const preCallSpec = spec.slice(spec.indexOf("   a)"), spec.indexOf("4. 404:"));
for (const [, copy] of preCallSpec.matchAll(/"([^"]+)"/g)) assert.ok(visible(preCall).includes(copy), `Exact preparation copy: ${copy}`);
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
