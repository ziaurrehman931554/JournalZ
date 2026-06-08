import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">JournalZ</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your intelligent journaling companion for capturing thoughts beautifully.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Product</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <Link to="/features" className="block hover:text-[var(--accent)] transition-colors">Features</Link>
              <Link to="/pricing" className="block hover:text-[var(--accent)] transition-colors">Pricing</Link>
              <Link to="/about" className="block hover:text-[var(--accent)] transition-colors">About</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Support</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <Link to="/faq" className="block hover:text-[var(--accent)] transition-colors">FAQ</Link>
              <Link to="/contact" className="block hover:text-[var(--accent)] transition-colors">Contact</Link>
              <a href="#" className="block hover:text-[var(--accent)] transition-colors">Documentation</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Legal</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <a href="#" className="block hover:text-[var(--accent)] transition-colors">Privacy Policy</a>
              <a href="#" className="block hover:text-[var(--accent)] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex items-center justify-center gap-1 text-sm text-gray-500">
          Made with <Heart size={14} className="text-red-500 fill-red-500" /> by JournalZ Team. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
