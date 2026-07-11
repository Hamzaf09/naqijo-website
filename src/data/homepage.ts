import { getPayloadClient } from "@/lib/payload/client";
import { L, mapMedia, type MediaImage } from "@/lib/payload/map";
import { homeContent } from "@/content/home";
import { productsSection } from "@/content/products-section";
import { approvedImages, type ApprovedImageKey } from "@/config/images";
import type { LocalizedString } from "@/data/product-types";

const dual = (ar: string, en: string): LocalizedString => ({ ar, en });

/** Static approved photo → MediaImage, so the unseeded fallback looks identical. */
const staticMedia = (key: ApprovedImageKey): MediaImage => {
  const img = approvedImages[key];
  return { src: img.src, width: img.width, height: img.height, alt: img.alt };
};

export interface SolutionItemData {
  eyebrow: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  bullets: LocalizedString[];
  image: MediaImage | null;
  href: string;
  ctaLabel: LocalizedString;
}

export interface HomepageData {
  hero: {
    eyebrow: LocalizedString;
    titleTop: LocalizedString;
    titleAccent: LocalizedString;
    subtitle: LocalizedString;
    primaryLabel: LocalizedString;
    primaryHref: string;
    secondaryLabel: LocalizedString;
    secondaryHref: string;
    image: MediaImage | null;
    video: MediaImage | null;
  };
  about: { eyebrow: LocalizedString; title: LocalizedString; body: LocalizedString };
  why: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    pillars: { title: LocalizedString; description: LocalizedString }[];
  };
  solutions: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    items: SolutionItemData[];
  };
  featuredProducts: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
    exploreLabel: LocalizedString;
    viewAllLabel: LocalizedString;
  };
  featuredProject: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
    ctaLabel: LocalizedString;
  };
  process: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    steps: { title: LocalizedString; description: LocalizedString }[];
  };
  testimonials: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    items: { quote: LocalizedString; name: LocalizedString; role: LocalizedString }[];
  };
  stats: {
    eyebrow: LocalizedString;
    items: { value: LocalizedString; label: LocalizedString }[];
  };
  cta: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
    whatsappText: LocalizedString;
  };
}

/** Full static fallback so the homepage always renders, even unseeded. */
function fromStatic(): HomepageData {
  const a = homeContent.ar;
  const e = homeContent.en;
  return {
    hero: {
      eyebrow: dual(a.hero.eyebrow, e.hero.eyebrow),
      titleTop: dual(a.hero.titleTop, e.hero.titleTop),
      titleAccent: dual(a.hero.titleAccent, e.hero.titleAccent),
      subtitle: dual(a.hero.subtitle, e.hero.subtitle),
      primaryLabel: dual(a.hero.primary, e.hero.primary),
      primaryHref: "/contact",
      secondaryLabel: dual(a.hero.secondary, e.hero.secondary),
      secondaryHref: "/services",
      image: staticMedia("heroLifestyle"),
      video: null,
    },
    about: {
      eyebrow: dual(a.intro.eyebrow, e.intro.eyebrow),
      title: dual(a.intro.title, e.intro.title),
      body: dual(a.intro.body, e.intro.body),
    },
    why: {
      eyebrow: dual(a.why.eyebrow, e.why.eyebrow),
      title: dual(a.why.title, e.why.title),
      pillars: a.why.pillars.map((p, i) => ({
        title: dual(p.t, e.why.pillars[i].t),
        description: dual(p.d, e.why.pillars[i].d),
      })),
    },
    solutions: {
      eyebrow: dual(a.solutions.eyebrow, e.solutions.eyebrow),
      title: dual(a.solutions.title, e.solutions.title),
      items: a.solutions.items.map((it, i) => ({
        eyebrow: dual(it.eyebrow, e.solutions.items[i].eyebrow),
        title: dual(it.title, e.solutions.items[i].title),
        description: dual(it.desc, e.solutions.items[i].desc),
        bullets: it.bullets.map((b, j) => dual(b, e.solutions.items[i].bullets[j])),
        image: staticMedia(it.image),
        href: it.href,
        ctaLabel: dual(it.cta, e.solutions.items[i].cta),
      })),
    },
    featuredProducts: {
      eyebrow: dual(productsSection.ar.eyebrow, productsSection.en.eyebrow),
      title: dual(productsSection.ar.title, productsSection.en.title),
      subtitle: dual(productsSection.ar.subtitle, productsSection.en.subtitle),
      exploreLabel: dual(productsSection.ar.cta, productsSection.en.cta),
      viewAllLabel: dual(productsSection.ar.viewAll, productsSection.en.viewAll),
    },
    featuredProject: {
      eyebrow: dual(a.featured.eyebrow, e.featured.eyebrow),
      title: dual(a.featured.title, e.featured.title),
      subtitle: dual(a.featured.desc, e.featured.desc),
      ctaLabel: dual(a.featured.cta, e.featured.cta),
    },
    process: {
      eyebrow: dual(a.process.eyebrow, e.process.eyebrow),
      title: dual(a.process.title, e.process.title),
      steps: a.process.steps.map((s, i) => ({
        title: dual(s.t, e.process.steps[i].t),
        description: dual(s.d, e.process.steps[i].d),
      })),
    },
    testimonials: {
      eyebrow: dual(a.testimonials.eyebrow, e.testimonials.eyebrow),
      title: dual(a.testimonials.title, e.testimonials.title),
      items: a.testimonials.items.map((t, i) => ({
        quote: dual(t.q, e.testimonials.items[i].q),
        name: dual(t.n, e.testimonials.items[i].n),
        role: dual(t.r, e.testimonials.items[i].r),
      })),
    },
    stats: {
      eyebrow: dual(a.stats.eyebrow, e.stats.eyebrow),
      items: a.stats.items.map((s, i) => ({
        value: dual(s.v, e.stats.items[i].v),
        label: dual(s.l, e.stats.items[i].l),
      })),
    },
    cta: {
      eyebrow: dual(a.cta.eyebrow, e.cta.eyebrow),
      title: dual(a.cta.title, e.cta.title),
      subtitle: dual(a.cta.subtitle, e.cta.subtitle),
      whatsappText: dual(a.cta.whatsapp, e.cta.whatsapp),
    },
  };
}

/**
 * Homepage content from the CMS global. Falls back to the static content per
 * field, so a partially-filled global still renders a complete page.
 */
export async function getHomepage(): Promise<HomepageData> {
  const payload = await getPayloadClient();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let doc: any = null;
  try {
    doc = await payload.findGlobal({ slug: "homepage", locale: "all", depth: 2 });
  } catch {
    doc = null;
  }
  const s = fromStatic();
  if (!doc || !doc.heroTitleTop) return s;

  const pick = (val: unknown, fallback: LocalizedString): LocalizedString => {
    const l = L(val as any);
    return l.ar || l.en ? l : fallback;
  };
  const arr = (val: unknown): any[] => (Array.isArray(val) ? val : []);
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const solutionsItems = arr(doc.solutions?.items);
  const whyPillars = arr(doc.why?.pillars);
  const processSteps = arr(doc.process?.steps);
  const testimonialItems = arr(doc.testimonials?.items);
  const statItems = arr(doc.stats?.items);

  return {
    hero: {
      eyebrow: pick(doc.heroEyebrow, s.hero.eyebrow),
      titleTop: pick(doc.heroTitleTop, s.hero.titleTop),
      titleAccent: pick(doc.heroTitleAccent, s.hero.titleAccent),
      subtitle: pick(doc.heroSubtitle, s.hero.subtitle),
      primaryLabel: pick(doc.heroPrimaryLabel, s.hero.primaryLabel),
      primaryHref: doc.heroPrimaryHref || s.hero.primaryHref,
      secondaryLabel: pick(doc.heroSecondaryLabel, s.hero.secondaryLabel),
      secondaryHref: doc.heroSecondaryHref || s.hero.secondaryHref,
      image: mapMedia(doc.heroImage) ?? s.hero.image,
      video: mapMedia(doc.heroVideo),
    },
    about: {
      eyebrow: pick(doc.about?.eyebrow, s.about.eyebrow),
      title: pick(doc.about?.title, s.about.title),
      body: pick(doc.about?.body, s.about.body),
    },
    why: {
      eyebrow: pick(doc.why?.eyebrow, s.why.eyebrow),
      title: pick(doc.why?.title, s.why.title),
      pillars: whyPillars.length
        ? whyPillars.map((p) => ({ title: L(p.title), description: L(p.description) }))
        : s.why.pillars,
    },
    solutions: {
      eyebrow: pick(doc.solutions?.eyebrow, s.solutions.eyebrow),
      title: pick(doc.solutions?.title, s.solutions.title),
      items: solutionsItems.length
        ? solutionsItems.map((it, i) => ({
            eyebrow: L(it.eyebrow),
            title: L(it.title),
            description: L(it.description),
            bullets: arr(it.bullets).map((b) => L(b.text)),
            image: mapMedia(it.image) ?? s.solutions.items[i]?.image ?? null,
            href: it.href || "/services",
            ctaLabel: L(it.ctaLabel),
          }))
        : s.solutions.items,
    },
    featuredProducts: {
      eyebrow: pick(doc.featuredProducts?.eyebrow, s.featuredProducts.eyebrow),
      title: pick(doc.featuredProducts?.title, s.featuredProducts.title),
      subtitle: pick(doc.featuredProducts?.subtitle, s.featuredProducts.subtitle),
      exploreLabel: pick(doc.featuredProducts?.exploreLabel, s.featuredProducts.exploreLabel),
      viewAllLabel: pick(doc.featuredProducts?.viewAllLabel, s.featuredProducts.viewAllLabel),
    },
    featuredProject: {
      eyebrow: pick(doc.featuredProject?.eyebrow, s.featuredProject.eyebrow),
      title: pick(doc.featuredProject?.title, s.featuredProject.title),
      subtitle: pick(doc.featuredProject?.subtitle, s.featuredProject.subtitle),
      ctaLabel: pick(doc.featuredProject?.ctaLabel, s.featuredProject.ctaLabel),
    },
    process: {
      eyebrow: pick(doc.process?.eyebrow, s.process.eyebrow),
      title: pick(doc.process?.title, s.process.title),
      steps: processSteps.length
        ? processSteps.map((st) => ({ title: L(st.title), description: L(st.description) }))
        : s.process.steps,
    },
    testimonials: {
      eyebrow: pick(doc.testimonials?.eyebrow, s.testimonials.eyebrow),
      title: pick(doc.testimonials?.title, s.testimonials.title),
      items: testimonialItems.length
        ? testimonialItems.map((t) => ({ quote: L(t.quote), name: L(t.name), role: L(t.role) }))
        : s.testimonials.items,
    },
    stats: {
      eyebrow: pick(doc.stats?.eyebrow, s.stats.eyebrow),
      items: statItems.length
        ? statItems.map((st) => ({ value: L(st.value), label: L(st.label) }))
        : s.stats.items,
    },
    cta: {
      eyebrow: pick(doc.cta?.eyebrow, s.cta.eyebrow),
      title: pick(doc.cta?.title, s.cta.title),
      subtitle: pick(doc.cta?.subtitle, s.cta.subtitle),
      whatsappText: pick(doc.cta?.whatsappText, s.cta.whatsappText),
    },
  };
}
