import type { Metadata } from "next";
import EnquiryForm from "@/components/enquiry/EnquiryForm";

export const metadata: Metadata = {
  title: "Book a free consultation",
  description: "Send an enquiry for a calm, no-pressure consultation with Rising Kudos.",
};

export default function EnquiryPage() {
  return (
    <div className="pt-24 sm:pt-28">
      <section className="mx-auto grid max-w-6xl gap-8 sm:gap-12 px-5 py-10 sm:px-6 sm:py-16 md:grid-cols-2 md:px-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink">Tell us about your child.</h1>
          <p className="mt-3 sm:mt-4 max-w-md leading-relaxed sm:leading-7 text-ink-soft">
            A short note is enough. We will reply to arrange a free consultation — no pop-ups, no urgency timers.
          </p>
        </div>
        <EnquiryForm />
      </section>
    </div>
  );
}
