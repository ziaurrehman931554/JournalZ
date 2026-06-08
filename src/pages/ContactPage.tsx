import { useState } from "react";
import { Send, Mail, MapPin, Phone } from "lucide-react";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@journalz.app" },
  { icon: MapPin, label: "Location", value: "San Francisco, CA" },
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.label} className="flex items-center gap-4 p-4 rounded-2xl backdrop-blur-2xl bg-[var(--surface-bg)] border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                    <Icon size={20} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{info.label}</p>
                    <p className="font-medium text-gray-900 dark:text-white">{info.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl backdrop-blur-2xl bg-[var(--surface-bg)] border border-white/10 p-6">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-gray-500">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)]/50 outline-none transition-colors text-sm"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)]/50 outline-none transition-colors text-sm"
                />
                <textarea
                  placeholder="Your Message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)]/50 outline-none transition-colors text-sm resize-none"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-medium hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  Send Message
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
