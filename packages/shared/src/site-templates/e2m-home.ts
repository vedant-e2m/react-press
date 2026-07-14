/** Asset URLs from the live E2M Solutions site (for editor/CMS page data only). */
export const E2M_ASSETS = {
  logo: "https://www.e2msolutions.com/app/uploads/2026/02/E2m-black-logo.png",
  heroVideo: "https://www.e2msolutions.com/app/uploads/2026/04/Colleague_Leadership.mp4",
  heroPoster: "https://www.e2msolutions.com/app/uploads/2026/04/E2M-Colleague-Leadership.webp",
  magicWand: "https://www.e2msolutions.com/app/uploads/2026/04/e2m-icon-magic-wand-abracadabra.svg",
  handshake: "https://www.e2msolutions.com/app/uploads/2026/04/e2m-icon-handshake-white-label-evolution.svg",
  handoff: "https://www.e2msolutions.com/app/uploads/2026/04/e2m-icon-handoff-magic-process.svg",
  endorsed: "https://www.e2msolutions.com/app/uploads/2026/04/e2m-icon-endorsed-industry-icons.svg",
  news: "https://www.e2msolutions.com/app/uploads/2026/04/e2m-icon-news-whats-happening.svg",
  arrowBlue: "https://www.e2msolutions.com/app/themes/e2m-solutions/assets/imgs/E2M_Arrow-GraphicsBlue.svg",
  teamCollab:
    "https://www.e2msolutions.com/app/uploads/2026/04/e2m-home-black-label-standard-team-collaboration.webp",
  growthGuideBook:
    "https://www.e2msolutions.com/app/uploads/2026/04/e2m-home-lead-magnet-digital-agency-growth-guide-ebook.webp",
  khushbu: "https://www.e2msolutions.com/app/uploads/2026/04/e2m-home-cta-book-growth-call-khushbu.webp",
  khushbuVishal: "https://www.e2msolutions.com/app/uploads/2026/04/khushbu-vishal.webp",
  jasonSwenk:
    "https://www.e2msolutions.com/app/uploads/2026/02/e2m-home-endorsement-jason-swenk-agency-mastery-360.webp",
  services: {
    webDev:
      "https://www.e2msolutions.com/app/uploads/2026/04/e2m-home-services-white-label-website-design-development.webp",
    digitalMarketing:
      "https://www.e2msolutions.com/app/uploads/2026/04/e2m-home-services-white-label-digital-marketing-dashboard.webp",
    ppc: "https://www.e2msolutions.com/app/uploads/2026/04/e2m-home-services-white-label-ppc-paid-media.webp",
    ai: "https://www.e2msolutions.com/app/uploads/2026/04/e2m-home-services-white-label-ai-solutions-technology.webp",
  },
  features: {
    calendar: "https://www.e2msolutions.com/app/uploads/2026/03/payday.svg",
    support: "https://www.e2msolutions.com/app/uploads/2026/03/Refresh.svg",
    workflow: "https://www.e2msolutions.com/app/uploads/2026/03/startup.svg",
    results: "https://www.e2msolutions.com/app/uploads/2026/03/presentation-profits.svg",
    proactive: "https://www.e2msolutions.com/app/uploads/2026/03/planning.svg",
    nda: "https://www.e2msolutions.com/app/uploads/2026/03/signing.svg",
  },
  testimonials: {
    grant: "https://www.e2msolutions.com/app/uploads/2026/04/grant-sparks-nieddu-state-of-the-spark.webp",
    chris: "https://www.e2msolutions.com/app/uploads/2026/04/chris-bates-agora-eversol-marketing.webp",
    phillip: "https://www.e2msolutions.com/app/uploads/2026/04/phillip-atwood-vessel.webp",
    meg: "https://www.e2msolutions.com/app/uploads/2026/04/meg-clark-clipping-dog-media.webp",
    alex: "https://www.e2msolutions.com/app/uploads/2026/04/alex-covert-lasso-up.webp",
  },
  blog: {
    vistara: "https://www.e2msolutions.com/app/uploads/2026/05/Vistara-AI-Event-1.webp",
    brent:
      "https://www.e2msolutions.com/app/uploads/2025/06/E2M-Solutions-Appoints-Brent-Weaver-as-CEO-to-Lead-the-Next-Phase-of-Global-Growth-1.png",
    dotCo:
      "https://www.e2msolutions.com/app/uploads/2026/01/Whats-New-at-E2M-in-2026_-E2M-Acquires-DOT-Company.webp",
    evolution:
      "https://www.e2msolutions.com/app/uploads/2026/04/White-Label-Services.-Black-Label-Standard.-The-E2M-Evolution.jpg",
  },
} as const;

const BLUE = "#1638FB";
const ORANGE = "#FF6B00";

type SeedBlock = { type: string; props: Record<string, unknown> };

function block(type: string, id: string, props: Record<string, unknown>): SeedBlock {
  return { type, props: { id, ...props } };
}

const NAV_LINKS = [
  { label: "Website Services", href: "https://www.e2msolutions.com/white-label-website-design-development/" },
  { label: "Digital Marketing", href: "https://www.e2msolutions.com/white-label-digital-marketing-services/" },
  { label: "AI Services", href: "https://www.e2msolutions.com/white-label-ai-solutions-for-agencies/" },
  { label: "About E2M", href: "https://www.e2msolutions.com/about-us/" },
  { label: "Resources", href: "https://www.e2msolutions.com/blog/" },
];

/**
 * Full E2M Solutions homepage — CMS custom blocks + core interactive blocks.
 * Reference: https://www.e2msolutions.com/
 */
export function buildE2MHomeBlocks(): SeedBlock[] {
  return [
    block("NavBar", "e2m-nav", {
      brandLabel: "E2M Solutions",
      brandHref: "/",
      logoUrl: E2M_ASSETS.logo,
      logoInvert: true,
      backgroundColor: "#000000",
      textColor: "#ffffff",
      sticky: true,
      accentColor: BLUE,
      links: NAV_LINKS,
      ctaLabel: "Book a Growth Call",
      ctaHref: "https://www.e2msolutions.com/book-a-growth-call/",
    }),

    block("HeroBanner", "e2m-hero", {
      videoUrl: E2M_ASSETS.heroVideo,
      posterUrl: E2M_ASSETS.heroPoster,
      title: "White Label Services.",
      titleHighlight: "Black Label",
      titleSuffix: "Standard.",
      subtitle:
        "E2M delivers white-label website development, digital marketing, PPC, and AI services you need, and the premium experience your digital agency deserves. World-class strategy and execution for digital agencies who refuse to compromise… That's the E2M Black Label Standard",
      primaryCtaLabel: "Talk With A Growth Partner",
      primaryCtaHref: "https://www.e2msolutions.com/book-a-growth-call/",
      primaryButtonColor: BLUE,
      primaryButtonTextColor: "#FFFFFF",
      secondaryCtaLabel: "See Plans",
      secondaryCtaHref: "https://www.e2msolutions.com/pricing/",
      secondaryButtonColor: "transparent",
      secondaryButtonTextColor: "#FFFFFF",
      highlightColor: BLUE,
      overlayOpacity: 55,
      minHeight: "screen",
      contentAlign: "center",
    }),

    block("CustomBlock-section-heading", "e2m-quality", {
      title: "Most White Label Partners Compete on Price. We Compete on",
      highlight: "Quality.",
      description:
        "E2M boasts hundreds of specialists and a senior-level team that's the best in the industry, all backed by proactive communication and an incredible dedication to service.",
      alignment: "center",
      highlightColor: BLUE,
      backgroundColor: "#ffffff",
    }),

    block("CustomBlock-e2m-stat-row", "e2m-stats", {
      stat1Value: "13+",
      stat1Label: "Years",
      stat2Value: "400+",
      stat2Label: "Active Agency Partners",
      stat3Value: "350+",
      stat3Label: "Full-Time Experts",
      stat4Value: "25k+",
      stat4Label: "Hours Delivered Monthly",
      stat5Value: "15,000+",
      stat5Label: "Websites Built",
      stat6Value: "98%",
      stat6Label: "Client Retention",
      accentColor: BLUE,
    }),

    block("CustomBlock-e2m-services", "e2m-services", {
      iconUrl: E2M_ASSETS.magicWand,
      title: "Abracadabra. Your Agency Just Got Bigger. (And Better.)",
      description:
        "Whether you're reselling web design and development, PPC and paid media, digital marketing, or AI solutions, E2M integrates seamlessly into your agency as if we were your own in-house team. Full-Service White Label Partner You Can Trust.",
      service1Title: "White Label Website Design and Development",
      service1Image: E2M_ASSETS.services.webDev,
      service1Url: "https://www.e2msolutions.com/white-label-website-design-development/",
      service2Title: "White Label Digital Marketing",
      service2Image: E2M_ASSETS.services.digitalMarketing,
      service2Url: "https://www.e2msolutions.com/white-label-digital-marketing-services/",
      service3Title: "White Label PPC and Paid Media",
      service3Image: E2M_ASSETS.services.ppc,
      service3Url: "https://www.e2msolutions.com/white-label-ppc-services/",
      service4Title: "White Label AI Solutions",
      service4Image: E2M_ASSETS.services.ai,
      service4Url: "https://www.e2msolutions.com/white-label-ai-solutions-for-agencies/",
      ctaLabel: "Talk With A White Label Growth Partner",
      ctaUrl: "https://www.e2msolutions.com/book-a-growth-call/",
      accentColor: BLUE,
    }),

    block("CustomBlock-e2m-testimonials", "e2m-testimonials", {
      title: "Proof Over Promises.",
      description:
        "We think our agency partners' success stories speak louder than sales copy. See how agencies like yours are scaling smarter, faster, and stronger.",
      quote: "Unstuck Our Pipeline. Freed Our Team. Scaled Our Business.",
      name: "Grant (Sparks) Nieddu",
      role: "Owner, State of the Spark Web Design & Support Company · Florida, USA",
      imageUrl: E2M_ASSETS.testimonials.grant,
      videoUrl: "#",
      accentColor: BLUE,
    }),

    block("CustomBlock-e2m-evolution", "e2m-evolution", {
      iconUrl: E2M_ASSETS.handshake,
      title: "E2M: The Evolution of White Label.",
      description:
        "Traditional white labeling fixes a capacity problem. Our black label approach to white labelling is the smarter way to scale because it fixes a quality problem. We layer strategy, senior-level leadership, & proactive systems on top of execution to deliver an experience indistinguishable from your own in-house team.",
      feature1Icon: E2M_ASSETS.features.calendar,
      feature1Title: "Month-to-Month Agreements",
      feature1Description: "No long-term contracts. Scale your plan up or down. Cancel any time.",
      feature2Icon: E2M_ASSETS.features.support,
      feature2Title: "360-Degree Support",
      feature2Description: "Pre-sales strategy. Full builds, reporting & maintenance. All under your brand.",
      feature3Icon: E2M_ASSETS.features.workflow,
      feature3Title: "Integrated with Your Workflows",
      feature3Description: "Onboarding in 24-48 hours. Assign tasks like we're your in-house team.",
      feature4Icon: E2M_ASSETS.features.results,
      feature4Title: "Incredible Results",
      feature4Description: "Fast turnaround, high quality, and no hassles. Clear communication every step.",
      feature5Icon: E2M_ASSETS.features.proactive,
      feature5Title: "Proactive by Default",
      feature5Description: "We flag issues before they become problems. No chasing. No surprises.",
      feature6Icon: E2M_ASSETS.features.nda,
      feature6Title: "Strict Non-Disclosure",
      feature6Description: "Iron-clad NDAs. All client deliverables are yours.",
    }),

    block("CustomBlock-e2m-black-label", "e2m-black-label", {
      title: "What is the E2M Black Label Standard?",
      description:
        'Most white-label partners compete on price and treat you like a transaction. We take a different approach. "Black Label" means premium, consistent, and rock-solid reliable. With E2M you get more than a white label partner; you benefit from sophisticated execution, proactive communication, strategic thinking, and a team that backs you up every step of the way.',
      imageUrl: E2M_ASSETS.teamCollab,
      linkLabel: "More about E2M's Black Label Standard",
      linkUrl: "https://www.e2msolutions.com/about-us/",
      bullet1: "High standards and attention to detail.",
      bullet2: "Strategic thinking included.",
      bullet3: "A full suite of white label services.",
      bullet4: "We reach out first with proactive updates.",
      bullet5: "Your tools, your way.",
      accentColor: BLUE,
    }),

    block("CustomBlock-e2m-steps", "e2m-process", {
      iconUrl: E2M_ASSETS.handoff,
      title: "Make the Hand-Off. Watch the Magic Happen.",
      description:
        "Zero contracts. Zero confusion. We onboard in 24-48 hours, instantly equipping you with a dedicated team of 350+ experts ready to execute for your agency, under your brand.",
      step1Number: "01",
      step1Title: "Book a Discovery Call",
      step1Description:
        "Share where your agency is headed. We'll map out how E2M integrates with your systems, scales with your team, and clears your fulfillment bottlenecks.",
      step2Number: "02",
      step2Title: "Choose Your Plan",
      step2Description:
        "Select the level of support that fits your workflow. All plans are flexible, flat-rate, and designed to grow with you. No contracts required.",
      step3Number: "03",
      step3Title: "Kick Off in 24-48 Hours",
      step3Description:
        "We plug into your tools, adapt to your workflows, and align with your team so you can start assigning work the same week.",
      numberColor: ORANGE,
    }),

    block("CustomBlock-e2m-endorsement", "e2m-endorsement", {
      iconUrl: E2M_ASSETS.endorsed,
      title: "Endorsed By Industry Icons",
      description:
        "We're the trusted white label partner for top agency coaches and communities who've helped thousands of digital agencies grow.",
      quote:
        "When industry leaders need a trusted, dedicated white label team they can count on, they turn to us.",
      imageUrl: E2M_ASSETS.jasonSwenk,
      personName: "Jason Swenk",
      personRole: "Founder & CEO, Agency Mastery 360",
      videoUrl: "#",
      accentColor: BLUE,
    }),

    block("ArticleGrid", "e2m-blog", {
      title: "What's Happening at E2M?",
      description: "News, insights, and stories from the team behind 1100+ growing agencies.",
      backgroundColor: "#000000",
      textColor: "#ffffff",
      linkColor: BLUE,
      layout: "grid",
      sectionCtaLabel: "View All Articles",
      sectionCtaUrl: "https://www.e2msolutions.com/blog/",
      sectionCtaStyle: "button",
      articles: [
        {
          title: "The AI Event Built For Agencies: E2M's Vistara Hits Austin This May, 2026",
          href: "https://www.e2msolutions.com/blog/",
          imageUrl: E2M_ASSETS.blog.vistara,
          featured: true,
        },
        {
          title: "E2M Solutions Appoints Brent Weaver as CEO to Lead the Next Phase of Global Growth",
          href: "https://www.e2msolutions.com/blog/",
          imageUrl: E2M_ASSETS.blog.brent,
        },
        {
          title: "What's New at E2M in 2026: E2M Acquires DOT & Company",
          href: "https://www.e2msolutions.com/blog/",
          imageUrl: E2M_ASSETS.blog.dotCo,
        },
        {
          title: "White Label Services. Black Label Standard. The E2M Evolution",
          href: "https://www.e2msolutions.com/blog/",
          imageUrl: E2M_ASSETS.blog.evolution,
        },
      ],
    }),

    block("CustomBlock-e2m-growth-guide", "e2m-guide", {
      bookImageUrl: E2M_ASSETS.growthGuideBook,
      title: "The Digital Agency Growth Guide",
      description:
        "Learn how to overcome common growth challenges, streamline operations, & scale your agency with confidence using battle-tested agency frameworks.",
      buttonLabel: "Download the Guide",
      buttonUrl: "https://www.e2msolutions.com/guide/",
      accentColor: BLUE,
      backgroundColor: "#F9F9F9",
    }),

    block("CustomBlock-e2m-growth-call", "e2m-growth-call", {
      title: "Book A Growth Call",
      subtitle: "Hi, I'm Khushbu at E2M.",
      description:
        "Ready to grow your digital agency with a world-class white label team? Schedule a call today. We'll talk through your needs and create a plan that fits your budget, then show you next steps on how to move forward.",
      avatarImageUrl: E2M_ASSETS.khushbu,
      buttonLabel: "Schedule a Call",
      buttonUrl: "https://www.e2msolutions.com/book-a-growth-call/",
      accentColor: BLUE,
    }),

    block("SiteFooter", "e2m-footer", {
      logoUrl: E2M_ASSETS.logo,
      backgroundColor: "#000000",
      textColor: "#ffffff",
      linkColor: "#ffffff",
      columnTitleColor: BLUE,
      copyright: `© Copyright ${new Date().getFullYear()}. E2M. All Rights Reserved.`,
      columns: [
        {
          title: "Website Services",
          links: [
            { label: "WordPress Development", href: "https://www.e2msolutions.com/white-label-wordpress-development/" },
            { label: "Webflow Development", href: "https://www.e2msolutions.com/white-label-webflow-development/" },
            { label: "Shopify Development", href: "https://www.e2msolutions.com/white-label-shopify-development/" },
            { label: "WooCommerce Development", href: "https://www.e2msolutions.com/white-label-woocommerce-development/" },
            { label: "HighLevel", href: "https://www.e2msolutions.com/white-label-highlevel/" },
          ],
        },
        {
          title: "Digital Marketing",
          links: [
            { label: "SEO Services", href: "https://www.e2msolutions.com/white-label-seo-services/" },
            { label: "AI SEO", href: "https://www.e2msolutions.com/white-label-ai-seo/" },
            { label: "PPC Services", href: "https://www.e2msolutions.com/white-label-ppc-services/" },
            { label: "Google Ads", href: "https://www.e2msolutions.com/white-label-google-ads/" },
            { label: "Content Writing Services", href: "https://www.e2msolutions.com/white-label-content-writing-services/" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About E2M", href: "https://www.e2msolutions.com/about-us/" },
            { label: "Leadership Team", href: "https://www.e2msolutions.com/leadership-team/" },
            { label: "Careers", href: "https://www.e2msolutions.com/careers/" },
            { label: "Testimonials", href: "https://www.e2msolutions.com/testimonials/" },
            { label: "Contact Us", href: "https://www.e2msolutions.com/contact-us/" },
          ],
        },
        {
          title: "Resources",
          links: [
            { label: "Blog", href: "https://www.e2msolutions.com/blog/" },
            { label: "Events", href: "https://www.e2msolutions.com/events/" },
            { label: "Guide", href: "https://www.e2msolutions.com/guide/" },
            { label: "Affiliate Program", href: "https://www.e2msolutions.com/affiliate-program/" },
            { label: "White Label", href: "https://www.e2msolutions.com/white-label/" },
          ],
        },
      ],
      legalLinks: [
        { label: "Privacy Policy", href: "https://www.e2msolutions.com/privacy-policy/" },
        { label: "Terms of Service", href: "https://www.e2msolutions.com/terms-of-service/" },
        { label: "Cookie Policy", href: "https://www.e2msolutions.com/cookie-policy/" },
        { label: "Sitemap", href: "https://www.e2msolutions.com/sitemap_index.xml" },
      ],
    }),
  ];
}

export function buildE2MHomePuckData() {
  return {
    root: { props: { title: "E2M Solutions — White Label Partner for Digital Agencies" } },
    content: buildE2MHomeBlocks(),
  };
}
