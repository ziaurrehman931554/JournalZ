import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 hover:scale-105 active:scale-95 transition-all duration-200">
              <img src={logo} alt="JournalZ" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                <span className="text-[var(--accent)]">J</span>ournalZ.
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your intelligent journaling companion for capturing thoughts beautifully.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Product</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <Link to="/#features" className="block hover:text-[var(--accent)] hover:scale-105 active:scale-95 transition-all duration-200">Features</Link>
              <Link to="/#faq" className="block hover:text-[var(--accent)] hover:scale-105 active:scale-95 transition-all duration-200">FAQ</Link>
              <Link to="/about" className="block hover:text-[var(--accent)] hover:scale-105 active:scale-95 transition-all duration-200">About</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Support</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <Link to="/faq" className="block hover:text-[var(--accent)] hover:scale-105 active:scale-95 transition-all duration-200">FAQ</Link>
              <Link to="/contact" className="block hover:text-[var(--accent)] hover:scale-105 active:scale-95 transition-all duration-200">Contact</Link>
              <a href="#" className="block hover:text-[var(--accent)] hover:scale-105 active:scale-95 transition-all duration-200">Documentation</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Legal</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <a href="#" className="block hover:text-[var(--accent)] hover:scale-105 active:scale-95 transition-all duration-200">Privacy Policy</a>
              <a href="#" className="block hover:text-[var(--accent)] hover:scale-105 active:scale-95 transition-all duration-200">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex items-center justify-center gap-1 text-sm text-gray-500 hover:scale-105 active:scale-95 transition-all duration-300 cursor-default">
          Made with <Heart size={14} className="text-red-500 fill-red-500" /> by JournalZ Team. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
