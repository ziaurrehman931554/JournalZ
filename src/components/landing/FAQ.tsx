import { useState } from "react";
import { ChevronDown } from "lucide-react";
import AnimatedSection from "../ui/AnimatedSection";

const faqs = [
  {
    q: "Is my data really encrypted?",
    a: "Yes. All your notes are encrypted with AES-256 before leaving your device. The encryption key never leaves your device, so only you can read your notes.",
  },
  {
    q: "Can I use JournalZ offline?",
    a: "Absolutely. JournalZ works fully offline. All your notes are stored locally using IndexedDB. Changes sync to the cloud when you're back online.",
  },
  {
    q: "What happens if I lose my encryption key?",
    a: "Your encryption key is derived from your password. As long as you remember your password, your key can be regenerated. Consider enabling biometric authentication for convenience.",
  },
  {
    q: "Which platforms are supported?",
    a: "JournalZ runs on any modern browser. It's a Progressive Web App (PWA), so you can install it on desktop and mobile devices.",
  },
  {
    q: "How does syncing work?",
    a: "Notes are saved locally first, then synced to Firebase when online. We use a sync queue system that ensures no changes are lost, even if you go offline mid-sync.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. JournalZ is free to use with generous storage limits. Premium features like advanced AI analysis and custom authentication are coming soon.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <AnimatedSection id="faq">
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="text-[var(--accent)]">Questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-medium cursor-pointer"
                >
                  {faq.q}
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
