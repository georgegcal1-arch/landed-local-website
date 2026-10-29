import { site } from "../config/site";

export type FAQItem = {
  question: string;
  answer: string;
  showOnHome: boolean;
};

export const faqItems: FAQItem[] = [
  {
    question: "Do I own the website?",
    answer: "Yes. The site and the domain are in your name. If we ever stop working together, you keep everything.",
    showOnHome: true,
  },
  {
    question: "Is there a monthly fee?",
    answer: `No. It's $${site.pricing.standard.toLocaleString("en-US")} one time ($${site.pricing.founding.toLocaleString("en-US")} for founding clients). There's an optional $${site.pricing.carePlanMonthly}/month care plan if you'd like me to handle updates and send a monthly call report.`,
    showOnHome: true,
  },
  {
    question: "How fast can it be live?",
    answer: "Within 7 days of getting your logo, photos and list of services.",
    showOnHome: true,
  },
  {
    question: "Are you new?",
    answer: "Yes, and I'll be straight with you: that's why my first 3 clients get the founding price. You get my full attention, and if you don't like the first draft, I refund your deposit.",
    showOnHome: true,
  },
  {
    question: "What if I already have a website?",
    answer: "I'll rebuild it. Your free mockup will show you what the new one would look like before you decide anything.",
    showOnHome: false,
  },
  {
    question: "What do you need from me?",
    answer: "Your logo if you have one, a few photos of your work, your services and the areas you serve. I handle the writing and setup.",
    showOnHome: false,
  },
];
