export const site = {
  name: "Rising Kudos",
  tagline: "Calm tutoring that grows confidence",
  description:
    "Warm, 1:1 tutoring for English, Maths, Science, 11+ and GCSE — built around the child, never the exam hall.",
  address: "Prashant Nagar, Devanahalli Town, Bangalore 562110",
};

export const navLinks = [
  { href: "/#subjects", label: "Subjects" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export const subjects = [
  {
    slug: "english",
    name: "English",
    accent: "english",
    blurb: "Reading, writing and speaking that feel like conversation, not drills.",
    detail:
      "We build fluency through stories, discussion and gentle structure — so children enjoy language, not just pass papers.",
    image: "/subject/english.png",
  },
  {
    slug: "maths",
    name: "Maths",
    accent: "maths",
    blurb: "Number sense first. Confidence follows.",
    detail:
      "Tutors slow down where it matters, make the abstract concrete, and never rush a child past a shaky foundation.",
    image: "/subject/maths.png",
  },
  {
    slug: "science",
    name: "Science",
    accent: "science",
    blurb: "Curiosity-led Biology, Chemistry and Physics.",
    detail:
      "We treat science as wonder with a method: questions, experiments in thought, and explanations that stick.",
    image: "/subject/science.png",
  },
  {
    slug: "11-plus",
    name: "11+",
    accent: "eleven",
    blurb: "Preparation without pressure.",
    detail:
      "Familiarisation, reasoning practice and pastoral care — never countdown clocks or exam-hall imagery.",
    image: "/subject/11+.png",
  },
  {
    slug: "gcse",
    name: "GCSE",
    accent: "gcse",
    blurb: "Clear paths through the specification.",
    detail:
      "Targeted support for exam technique and understanding, with a calm grade note: progress is the measure, not panic.",
    image: "/subject/CGSE.png",
  },
];

export const benefits = [
  {
    title: "Matched with care",
    body: "We pair each child with a tutor who fits their personality as well as their subject — then we stay close to how it feels at home.",
    span: "md:col-span-2 lg:col-span-2 lg:row-span-2",
    featured: true,
    image: "/2nd page/match with care.png",
  },
  {
    title: "Calm by design",
    body: "Sessions are unhurried. No timers, no public leaderboards, no stress theatre.",
    span: "md:col-span-1",
    featured: false,
    image: "/2nd page/calm by design.png",
  },
  {
    title: "Parents in the loop",
    body: "Short, plain-English updates after sessions so you always know what happened and what is next.",
    span: "md:col-span-1",
    featured: false,
    image: "/2nd page/parents in the loop.png",
  },
  {
    title: "Change tutors freely",
    body: "If the fit is not right, we rematch — no fuss, no extra fee. The relationship has to work.",
    span: "md:col-span-2 lg:col-span-2",
    featured: false,
    image: "/2nd page/change tutors freely.png",
  },
];

export const steps = [
  {
    n: "01",
    title: "Tell us about your child",
    body: "A short conversation — strengths, worries, school context. No forms that feel like an interrogation.",
  },
  {
    n: "02",
    title: "We match a tutor",
    body: "Subject expertise plus temperament. You meet them before any paid series begins.",
  },
  {
    n: "03",
    title: "Settle into a rhythm",
    body: "Weekly sessions online, at a time that fits family life. Homework stays light and purposeful.",
  },
  {
    n: "04",
    title: "Review and grow",
    body: "We check in on confidence as much as content, and adjust the plan as your child changes.",
  },
];

export const trustItems = [
  { label: "1:1 sessions", value: "Always" },
  { label: "Tutor rematch", value: "Included" },
  { label: "First consultation", value: "Free" },
  { label: "Year groups", value: "KS2–GCSE" },
];

export const packages = [
  {
    id: "weekly",
    name: "Weekly rhythm",
    price: "From £49",
    period: "",
    highlight: false,
    points: [
      "Ongoing weekly slot",
      "Flexible pause weeks",
      "Parent updates",
      "Resource pack included",
    ],
  },
  {
    id: "intro",
    name: "Intro package",
    price: "£99",
    period: "",
    highlight: true,
    points: [
      "Free parent consultation",
      "Tutor meet-and-greet",
      "Four 1-hour sessions",
      "Written progress note",
    ],
  },
  {
    id: "focused",
    name: "Focused block",
    price: "£649",
    period: "",
    highlight: false,
    points: [
      "Topic-mapped plan",
      "11+ or GCSE options",
      "End-of-block review",
    ],
  },
];

export const faqs = [
  {
    q: "How do you match a tutor to my child?",
    a: "We start with a conversation about personality, pace and subject needs, then introduce a tutor for a no-pressure meet. If it is not the right fit, we rematch at no extra cost.",
  },
  {
    q: "Are sessions online or in person?",
    a: "Sessions are online by default, which keeps travel calm and lets us match from a wider tutor pool. We can discuss in-person options where we have local coverage.",
  },
  {
    q: "Do you teach to the 11+ or GCSE exam?",
    a: "We prepare children thoroughly, without turning home into an exam hall. Practice is familiar and paced. We do not use countdown urgency or aggressive drilling.",
  },
  {
    q: "What if we need to pause or change tutors?",
    a: "Pause with reasonable notice. Tutor changes are part of our promise — we would rather rematch than ask a family to push through a poor fit.",
  },
  {
    q: "How does billing and refunds work?",
    a: "Intro packages are billed up front for the first block. Unused prepaid sessions can be discussed case by case; see the refund note on the enquiry confirmation. This is a placeholder until legal copy is confirmed.",
  },
  {
    q: "What year groups do you support?",
    a: "Primarily Key Stage 2 through GCSE. We keep groups small in spirit even in 1:1: the work is always pitched to the child in front of us, not a year-label average.",
  },
];

export const faqPreview = faqs.slice(0, 4);
