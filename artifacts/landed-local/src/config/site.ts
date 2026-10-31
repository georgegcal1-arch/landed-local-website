/** Allowed hero layouts. */
export type HeroMode = "workorder" | "devices" | "photo";

/** One finished site shown as a sample. */
export interface Sample {
  /** Business name shown on the sample. */
  name: string;
  /** Trade, e.g. "Plumbing". */
  trade: string;
  /** Live URL of the sample site. */
  url: string;
  /** Screenshot path, e.g. "/samples/smith-plumbing.png". */
  image: string;
  /** Laptop screenshot path shown in featured layouts and sample cards. */
  laptopImage?: string;
}

export interface SiteConfig {
  /** Site-wide technical settings. */
  site: {
    /** Canonical domain, no trailing slash. Used for canonical and Open Graph URLs. */
    url: string;
    /** Default meta description when a page doesn't set one. */
    defaultDescription: string;
    /** Default social share image (path under /public). */
    ogImage: string;
  };
  /** Paths to the files in /public/brand. Update if you re-upload with new names. */
  brand: {
    /** SVG favicon for modern browsers. */
    faviconSvg: string;
    /** Legacy .ico favicon. */
    faviconIco: string;
    /** 16px PNG favicon. */
    favicon16: string;
    /** 32px PNG favicon. */
    favicon32: string;
    /** 48px PNG favicon. */
    favicon48: string;
    /** 180px iOS home-screen icon. */
    appleTouchIcon: string;
    /** 192px app icon. */
    appIcon192: string;
    /** 512px app icon. */
    appIcon512: string;
    /** Header logo for light backgrounds. */
    headerLogo: string;
    /** Horizontal logo for dark backgrounds. */
    logoReversed: string;
    /** George's profile photo. Not used for sharing by default. */
    profilePhoto: string;
    /** Dark-background carpenter-square placeholder for light photo slots. */
    profilePhotoDark: string;
  };
  /** Who the business is. */
  business: {
    /** Public business name. */
    name: string;
    /** Registered legal name. */
    legalName: string;
    /** One-line tagline. */
    tagline: string;
    /** Owner full name. */
    owner: string;
    /** Owner first name for friendly copy. */
    ownerFirst: string;
    /** Home city. */
    city: string;
    /** Home state. */
    state: string;
    /** Postal region and country codes used in business structured data. */
    stateCode: string;
    countryCode: string;
    /** How the service area is described. */
    serviceArea: string;
  };
  /** How people reach George. */
  contact: {
    /** Phone number as shown on the page. */
    phoneDisplay: string;
    /** Tap-to-call link. */
    phoneHref: string;
    /** Tap-to-text link. */
    smsHref: string;
    /** Email address. */
    email: string;
    /** Google Calendar booking link. */
    bookingUrl: string;
  };
  /** Prices in whole US dollars. */
  pricing: {
    /** Regular price for a site. */
    standard: number;
    /** Founding-client price. */
    founding: number;
    /** How many founding spots exist. */
    foundingSpotsTotal: number;
    /** How many founding spots remain. */
    foundingSpotsLeft: number;
    /** Show the "spots left" count on the page. */
    showSpotsLeft: boolean;
    /** Monthly care plan price. */
    carePlanMonthly: number;
    /** Payment options, one line each. */
    paymentOptions: string[];
    /** The guarantee, in one sentence. */
    guarantee: string;
  };
  /** What the offer includes. */
  offer: {
    /** Days from kickoff to live site. */
    liveInDays: number;
    /** Maximum pages included. */
    maxPages: number;
    /** Rounds of revisions included. */
    revisionRounds: number;
    /** Days of call tracking included after launch. */
    callTrackingDays: number;
  };
  /** Form settings. */
  forms: {
    /** Web3Forms public access key (meant to be published in the page). */
    web3formsKey: string;
    /** Promised reply time, shown near forms. */
    responseTime: string;
  };
  /** Homepage hero settings. */
  hero: {
    /** Which hero layout to show: "workorder", "devices" or "photo". */
    mode: HeroMode;
    /** Phone screenshot for "devices" mode, or null. */
    devicePhoneImage: string | null;
    /** Laptop screenshot for "devices" mode, or null. */
    deviceLaptopImage: string | null;
    /** Link to a live sample site, or null. */
    sampleUrl: string | null;
  };
  /** Photos of George. */
  photos: {
    /** Photo for the homepage hero ("photo" mode), or null. */
    founderHero: string | null;
    /** Photo for the About page, or null. */
    founderAbout: string | null;
  };
  /** Finished sample sites. Empty until there are some. */
  samples: Sample[];
  /** After-launch page settings. */
  afterLaunch: {
    /** Set true to publish the after-launch page. */
    pageLive: boolean;
  };
  /** Header, footer and action-bar copy. */
  shell: {
    /** Main nav links. "afterLaunch" link is only shown when afterLaunch.pageLive. */
    nav: { label: string; href: string; afterLaunchOnly?: boolean }[];
    /** Footer "Pages" column. */
    footerPages: { label: string; href: string }[];
    /** Primary call to action. */
    cta: { label: string; shortLabel: string; href: string };
    /** Privacy page link. */
    privacyHref: string;
    /** Copyright year. */
    year: number;
    /** Footer sample note. */
    sampleNote: string;
    /** Routes where the mobile action bar is hidden. */
    hideActionBarOn: string[];
  };
  /** Analytics. */
  analytics: {
    /** Cloudflare Web Analytics token, or null to turn analytics off. */
    cloudflareToken: string | null;
  };
}

const BRAND = "/brand/";

export const site: SiteConfig = {
  site: {
    url: "https://www.landedlocal.com",
    defaultDescription: "Fast, phone-first websites for plumbers, electricians and local trades in Columbus, Ohio. $997 one time, live in 7 days, and you own it. Get a free mockup.",
    ogImage: "/og-image.png",
  },
  brand: {
    faviconSvg: BRAND + "favicon_1793055255722.svg",
    faviconIco: BRAND + "favicon_1793055255721.ico",
    favicon16: BRAND + "favicon-16_1793055255722.png",
    favicon32: BRAND + "favicon-32_1793055255723.png",
    favicon48: BRAND + "favicon-48_1793055255723.png",
    appleTouchIcon: BRAND + "apple-touch-icon-180_1793055255720.png",
    appIcon192: BRAND + "app-icon-192_1793055255719.png",
    appIcon512: BRAND + "app-icon-512_1793055255720.png",
    headerLogo: BRAND + "website-header-logo.svg",
    logoReversed: BRAND + "landed-local_logo-horizontal_reversed.svg",
    profilePhoto: BRAND + "profile-picture-1080_orange_1793055255725.png",
    profilePhotoDark: BRAND + "profile-picture-1080_dark.png",
  },
  business: {
    name: "Landed Local",
    legalName: "Landed Local LLC",
    tagline: "Land more local jobs.",
    owner: "George",
    ownerFirst: "George",
    city: "Columbus",
    state: "Ohio",
    stateCode: "OH",
    countryCode: "US",
    serviceArea: "Columbus and Central Ohio",
  },
  contact: {
    phoneDisplay: "614-321-8001",
    phoneHref: "tel:+16143218001",
    smsHref: "sms:+16143218001",
    email: "george@landedlocal.com",
    bookingUrl: "https://calendar.app.google/czz2D9uJiQhCZsVB9",
  },
  pricing: {
    standard: 997,
    founding: 500,
    foundingSpotsTotal: 3,
    foundingSpotsLeft: 3,
    showSpotsLeft: false,
    carePlanMonthly: 49,
    paymentOptions: ["50% to start, 50% at launch", "Or 3 monthly payments"],
    guarantee: "Don't like the first draft? I refund your deposit.",
  },
  offer: {
    liveInDays: 7,
    maxPages: 5,
    revisionRounds: 2,
    callTrackingDays: 30,
  },
  forms: {
    web3formsKey: "0ca06fe0-1bac-4a90-9e7c-699654b767fa",
    responseTime: "within one business day",
  },
  hero: {
    mode: "devices",
    devicePhoneImage: "/images/sample-copper-lantern-phone.webp",
    deviceLaptopImage: "/images/sample-copper-lantern-laptop.webp",
    sampleUrl: "https://demo.landedlocal.com/copper-lantern-plumbing/",
  },
  photos: {
    founderHero: null,
    founderAbout: null,
  },
  samples: [
    {
      name: "Copper Lantern Plumbing",
      trade: "Plumbing",
      url: "https://demo.landedlocal.com/copper-lantern-plumbing/",
      image: "/images/sample-copper-lantern-phone.webp",
      laptopImage: "/images/sample-copper-lantern-laptop.webp",
    },
  ],
  afterLaunch: {
    pageLive: false,
  },
  shell: {
    nav: [
      { label: "Websites", href: "/websites" },
      { label: "About", href: "/about" },
      { label: "After launch", href: "/after-launch", afterLaunchOnly: true },
    ],
    footerPages: [
      { label: "Home", href: "/" },
      { label: "Websites", href: "/websites" },
      { label: "About", href: "/about" },
      { label: "Get my free mockup", href: "/get-a-mockup" },
    ],
    cta: { label: "Get my free mockup", shortLabel: "Get my mockup", href: "/get-a-mockup" },
    privacyHref: "/privacy",
    year: 2026,
    sampleNote: "This site is a sample of my work. I designed and built it myself.",
    hideActionBarOn: ["/get-a-mockup", "/thanks"],
  },
  analytics: {
    cloudflareToken: null,
  },
};

export default site;
