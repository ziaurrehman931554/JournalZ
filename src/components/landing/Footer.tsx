import { Heart, ExternalLink, Mail, Globe } from "lucide-react";
import logo from "../../assets/logo.png";

const links = [
  { label: "Features", href: "/#features" },
  { label: "FAQ", href: "/#faq" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "mailto:ziaurrehman931554@gmail.com" },
  { label: "GitHub", href: "https://github.com/ziaurrehman931554/JournalZ" },
];

export default function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2.5 font-bold text-xl mb-4">
              <img src={logo} alt="JournalZ" className="w-8 h-8 object-contain" />
              <span className="text-[var(--accent)]">J</span>ournalZ.
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              A privacy-first notes app with end-to-end encryption, offline support, and smart reminders.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Links</h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com/ziaurrehman931554/JournalZ"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200"
              >
                <ExternalLink size={18} />
              </a>
              <a
                href="mailto:ziaurrehman931554@gmail.com"
                className="p-2.5 rounded-xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200"
              >
                <Mail size={18} />
              </a>
              <a
                href="/"
                className="p-2.5 rounded-xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200"
              >
                <Globe size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart size={14} className="text-red-400" /> for privacy lovers
          </p>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} JournalZ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
