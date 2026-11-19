/** Booking copy and destinations shared by the site and its temporary shell. */
const booking = {
  /** Main button invites visitors to book the free review. */
  buttonLabel: "Book a Free Missed-Jobs Review",
  /** Short wording for compact booking buttons. */
  shortLabel: "Book a call",
  /** shorter label for the desktop header button only */
  headerLabel: "Book a free review",
  /** Reassurance beside the booking invitation. */
  reassurance: "30 minutes · With George · No pitch deck",
  /** Booking-page reassurance explains the review's practical outcome. */
  bookReassurance: "30 minutes. We'll find where jobs are slipping through and what it's costing you.",
  /** Name of the free review call. */
  callName: "Missed-Jobs Review",
  /** Cal.com event used by the future booking embed. */
  calLink: "https://cal.com/george-at-landed-local-u6v7fc/missed-jobs-review",
  /** Local booking page. */
  bookPath: "/book",
  /** Booking section on the future Home page. */
  homeAnchor: "#book",
};

const BRAND = "/brand/";

export const site = {
  /** Site-wide URLs and default sharing information. */
  site: {
    /** Canonical domain without a trailing slash. */
    url: "https://www.landedlocal.com",
    /** Default search and social description for pages without their own. */
    defaultDescription: "Landed Local finds where home-service companies lose jobs and time, then builds the AI systems that fix it. Book a free 30-minute call with George.",
    /** Default social share image under public. */
    ogImage: "/og-image.png",
  },
  /** Existing brand assets; keep the original files and aliases. */
  brand: {
    /** SVG favicon for modern browsers. */
    faviconSvg: BRAND + "favicon_1793055255722.svg",
    /** Legacy browser favicon. */
    faviconIco: BRAND + "favicon_1793055255721.ico",
    /** Small browser-tab icon. */
    favicon16: BRAND + "favicon-16_1793055255722.png",
    /** Standard browser-tab icon. */
    favicon32: BRAND + "favicon-32_1793055255723.png",
    /** Larger browser-tab icon. */
    favicon48: BRAND + "favicon-48_1793055255723.png",
    /** Apple home-screen icon. */
    appleTouchIcon: BRAND + "apple-touch-icon-180_1793055255720.png",
    /** Small app icon. */
    appIcon192: BRAND + "app-icon-192_1793055255719.png",
    /** Large app icon. */
    appIcon512: BRAND + "app-icon-512_1793055255720.png",
    /** Header logo for light backgrounds. */
    headerLogo: BRAND + "website-header-logo.svg",
    /** Reversed logo for dark backgrounds. */
    logoReversed: BRAND + "landed-local_logo-horizontal_reversed.svg",
    /** Orange brand profile tile. */
    profilePhoto: BRAND + "profile-picture-1080_orange_1793055255725.png",
    /** Dark brand profile tile. */
    profilePhotoDark: BRAND + "profile-picture-1080_dark.png",
  },
  /** Public business identity and service area. */
  business: {
    /** Public business name. */
    name: "Landed Local",
    /** Registered legal name. */
    legalName: "Landed Local LLC",
    /** Short business tagline. */
    tagline: "Land more local jobs.",
    /** Owner's public name; use first name only. */
    owner: "George",
    /** First name for friendly copy. */
    ownerFirst: "George",
    /** Home city. */
    city: "Columbus",
    /** Home state. */
    state: "Ohio",
    /** Postal abbreviation for the state. */
    stateCode: "OH",
    /** Country code for structured data. */
    countryCode: "US",
    /** Public description of the service area. */
    serviceArea: "Columbus and Central Ohio",
  },
  /** Ways to contact the business. */
  contact: {
    /** Phone number shown to visitors. */
    phoneDisplay: "614-321-8001",
    /** Tap-to-call destination. */
    phoneHref: "tel:+16143218001",
    /** Tap-to-text destination. */
    smsHref: "sms:+16143218001",
    /** Business email address. */
    email: "george@landedlocal.com",
  },
  /** Main audience shown in the agency copy. */
  audienceLine: "For roofing and HVAC companies",
  /** Invitation for home-service businesses outside the starting niches. */
  otherTradesLine: "Run a different home-service business? The same systems work for plumbing, foundation, restoration and more. Book a call and we'll tell you honestly if it fits.",
  /** Shared booking wording and destinations. */
  booking,
  /** Tool compatibility shown on the future agency site. */
  tools: {
    /** Whether the tools strip is visible. */
    show: true,
    /** Heading above the tools list. */
    label: "Works with the tools you already run",
    /** Only list tools the development team connects to. */
    names: ["GoHighLevel", "Jobber", "ServiceTitan", "Housecall Pro", "JobNimbus", "AccuLynx", "QuickBooks", "Google Calendar"],
  },
  /** Optional local review research. */
  proof: {
    /** The old Columbus review readout; off until the niches are picked. */
    show: false,
    /** Main research figure. */
    value: "51%",
    /** Explanation of the research figure. */
    text: "We read 285 one- and two-star reviews of Columbus home-service companies. For roofers, 51% came down to a call nobody returned or an appointment nobody kept.",
    /** Attribution for the research. */
    source: "Landed Local review research, November 2026",
  },
  /** Development-team case study for the future agency site. */
  caseStudy: {
    /** Whether the case study is visible. */
    show: true,
    /** Attribution above the case study. */
    label: "Built by our development team",
    /** Case-study section heading. */
    heading: "What these systems did for one roofing company",
    /** Work-order reference shown on the ticket. */
    ticketNumber: "0417",
    /** Main result figure, not a service price. */
    headlineValue: "+$612K",
    /** Description of the main result. */
    headlineLabel: "added revenue in the first 12 months",
    /** Anonymous client context. */
    title: "Roofing company · Phoenix, AZ · $4.2M a year",
    /** Before-and-after results shown on the ticket. */
    lines: [
      {
        /** Result being measured. */
        label: "Calls answered",
        /** Reported outcome and earlier figure. */
        value: "100% (was 51%)",
      },
      {
        /** Result being measured. */
        label: "Response to new leads",
        /** Reported outcome and earlier figure. */
        value: "2 min (was 6 hrs)",
      },
      {
        /** Result being measured. */
        label: "Admin work removed",
        /** Time saved. */
        value: "73 hrs a week",
      },
      {
        /** Result being measured. */
        label: "Inspections booked",
        /** Reported booking increase. */
        value: "3.2x a month",
      },
    ],
    /** Leave empty unless the mentor OKs using the client's quote verbatim. */
    quote: "",
    /** Completion stamp wording. */
    stamp: "COMPLETED",
    /** Attribution and results disclaimer. */
    note: "Built by the development team that builds Landed Local's systems. Results vary by business.",
  },
  /** example conversation in the hero; swap the business and job when the niche changes */
  heroDemo: {
    /** Whether the hero shows the example phone (false shows the FREE review ticket). */
    show: true,
    /** Eyebrow label above the phone. */
    label: "Example",
    /** Example business answering the missed call. */
    businessName: "Riverside Heating & Air",
    /** Example caller number; not a real contact or demo line. */
    callerNumber: "(555) 014-2290",
    /** Time of the missed call. */
    missedCallTime: "7:42 PM",
    /** Note under the missed call. */
    missedCallNote: "You're on a job.",
    /** Text messages, in order. */
    messages: [
      { from: "business", text: "Hi, it's Riverside Heating & Air. Sorry we missed you! How can we help?" },
      { from: "customer", text: "AC died again and it's 88° in here. Can someone quote a new one?" },
      { from: "business", text: "Free estimate tomorrow at 9:00 AM or 2:30 PM?" },
      { from: "customer", text: "9 works." },
      { from: "business", text: "Booked for 9:00 AM tomorrow. Reminder coming tonight." },
    ] as { from: "business" | "customer"; text: string }[],
    /** Work-order title on the booked ticket. */
    ticketTitle: "AC replacement estimate",
    /** Booked time on the ticket. */
    ticketTime: "Tomorrow · 9:00 AM",
    /** Estimated value of the example job, not a service price. */
    ticketValueLabel: "Est. job value",
    ticketValue: "$8,500",
    /** Stamp wording on the booked ticket. */
    stamp: "LANDED",
  },
  /** Optional founder photography. */
  photos: {
    /** When null, show the orange brand tile. */
    founder: null as string | null,
  },
  /** Reserved demo settings; nothing uses these yet. */
  demo: {
    /** Whether a future demo number may be shown. */
    showDemo: false,
    /** Future demo number; leave empty until approved. */
    demoPhone: "",
  },
  /** Reserved promise copy; nothing uses this yet. */
  promise: {
    /** Whether a future promise may be shown. */
    show: false,
    /** Future approved promise wording. */
    text: "",
  },
  /** Temporary header, footer and phone-bar settings. */
  shell: {
    /** Main navigation; retired pages have been removed. */
    nav: [
      {
        /** Navigation text. */
        label: "Book a call",
        /** Destination page. */
        href: booking.bookPath,
      },
    ],
    /** Pages listed in the footer. */
    footerPages: [
      {
        /** Navigation text. */
        label: "Home",
        /** Destination page. */
        href: "/",
      },
      {
        /** Navigation text. */
        label: "Book a call",
        /** Destination page. */
        href: booking.bookPath,
      },
    ],
    /** Temporary shell buttons read the shared booking settings. */
    cta: {
      /** Full button text. */
      label: booking.buttonLabel,
      /** Compact button text. */
      shortLabel: booking.shortLabel,
      /** Local booking destination. */
      href: booking.bookPath,
    },
    /** Privacy page destination. */
    privacyHref: "/privacy",
    /** Copyright year. */
    year: 2026,
    /** Existing footer note, retained until the footer step. */
    sampleNote: "This site is a sample of my work. I designed and built it myself.",
    /** Hide the phone bar on the booking page. */
    hideActionBarOn: [booking.bookPath],
  },
  /** Optional analytics settings. */
  analytics: {
    /** Existing Cloudflare token; null keeps analytics off. */
    cloudflareToken: null as string | null,
  },
};

/** Shape of the shared settings for consumers that need a type. */
export type SiteConfig = typeof site;

export default site;
