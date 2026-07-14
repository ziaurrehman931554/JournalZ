import { Navigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import About from "../components/landing/About";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/landing/Footer";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import ScrollToTop from "../components/ui/ScrollToTop";
import ShareBanner from "../components/ui/ShareBanner";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/app" replace />;

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <About />
        <FAQ />
      </main>
      <Footer />
      <ShareBanner />
      <ScrollToTop />
    </div>
  );
}
