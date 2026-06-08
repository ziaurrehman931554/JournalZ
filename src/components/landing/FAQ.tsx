import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is JournalZ free to use?",
    answer: "Yes! JournalZ offers a generous free tier with unlimited notes, checklists, and reminders. Premium features like advanced organization and priority support are available with a subscription.",
  },
  {
    question: "Can I access my notes offline?",
    answer: "Yes, JournalZ works offline. Your notes are stored locally and sync automatically when you're back online.",
  },
  {
    question: "How secure is my data?",
    answer: "We take privacy seriously. All data is encrypted in transit and at rest. We use industry-standard security practices to ensure your thoughts remain private.",
  },
  {
    question: "Can I organize notes into folders?",
    answer: "Absolutely! You can create nested folders to organize your notes exactly how you want. Drag and drop support makes organization a breeze.",
  },
  {
    question: "Do you support Markdown?",
    answer: "Yes, JournalZ has full Markdown support with real-time preview. You can write in Markdown and see the formatted result instantly.",
  },
  {
    question: "Can I set location-based reminders?",
    answer: "Yes, our reminders support both time-based and location-based triggers, making it easy to remember tasks based on where you are.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl backdrop-blur-2xl bg-[var(--surface-bg)] border border-white/10 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
              >
                <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openIndex === index ? "max-h-48" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
