import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 pt-32 pb-20 md:px-8">
      <h1 className="font-display text-4xl font-semibold">Terms of use</h1>
      <p className="mt-6 leading-7 text-ink-soft">
        Legal placeholder. Replace with confirmed terms, refund policy and tutor-change wording from the content
        document before launch.
      </p>
    </article>
  );
}
