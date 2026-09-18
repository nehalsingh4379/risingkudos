import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 pt-32 pb-20 md:px-8">
      <h1 className="font-display text-4xl font-semibold">Privacy policy</h1>
      <p className="mt-6 leading-7 text-ink-soft">
        Legal placeholder. Replace with the confirmed privacy policy from the Rising Kudos content document before
        launch. This page exists so the information architecture and footer links are in place.
      </p>
    </article>
  );
}
