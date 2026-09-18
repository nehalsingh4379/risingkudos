import Link from "next/link";
import { faqPreview } from "@/content/site";

export default function FaqPreview() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 md:px-8">
      <h2 className="font-display text-4xl font-semibold">Questions parents ask first</h2>
      <ul className="mt-8 space-y-4">
        {faqPreview.map((item) => (
          <li key={item.q} className="border-b border-ink/10 pb-4">
            <p className="font-medium">{item.q}</p>
          </li>
        ))}
      </ul>
      <Link href="/faq" className="mt-6 inline-block text-sm font-semibold text-coral">
        Read answers →
      </Link>
    </section>
  );
}
