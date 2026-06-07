import Navbar from "../components/layout/Navbar";
import Footer from "../components/landing/Footer";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import CursorFollower from "../components/ui/CursorFollower";
import AnimatedSection from "../components/ui/AnimatedSection";
import { Mail, ExternalLink, MessageCircle, Send, ArrowRight } from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "ziaurrehman931554@gmail.com",
    href: "mailto:ziaurrehman931554@gmail.com",
    desc: "I'll respond within 24 hours",
  },
  {
    icon: ExternalLink,
    label: "GitHub Issues",
    value: "Open an issue",
    href: "https://github.com/ziaurrehman931554/JournalZ/issues",
    desc: "Report bugs or request features",
  },
  {
    icon: MessageCircle,
    label: "Discussions",
    value: "GitHub Discussions",
    href: "https://github.com/ziaurrehman931554/JournalZ/discussions",
    desc: "Join the community conversation",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <CursorFollower />
      <Navbar />
      <main className="relative z-10 pt-24">
        <AnimatedSection>
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-sm text-[var(--accent)] mb-6">
                <Send size={14} />
                Get in Touch
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Let's{" "}
                <span className="text-[var(--accent)]">connect</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
                Have a question, suggestion, or just want to say hi? I'd love to hear from you.
              </p>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="pb-20 px-6">
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-3 gap-4 mb-12">
                {contactMethods.map(({ icon: Icon, label, value, href, desc }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="p-6 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/15 dark:hover:bg-white/10 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-4">
                      <Icon size={20} className="text-[var(--accent)]" />
                    </div>
                    <h3 className="font-semibold mb-1">{label}</h3>
                    <p className="text-sm text-[var(--accent)] mb-1 group-hover:underline">{value}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </a>
                ))}
              </div>

              <div className="p-8 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10">
                <h2 className="text-xl font-bold mb-4">Send a Message</h2>
                <form
                  action="mailto:ziaurrehman931554@gmail.com"
                  method="GET"
                  encType="text/plain"
                  className="space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="subject"
                      placeholder="Your Name"
                      required
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      required
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                    />
                  </div>
                  <textarea
                    name="body"
                    placeholder="Your message..."
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 outline-none focus:border-[var(--accent)] transition-colors text-sm resize-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-all duration-200 cursor-pointer"
                  >
                    Send Message
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
}
