import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import About from "../components/landing/About";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/landing/Footer";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import ScrollToTop from "../components/ui/ScrollToTop";
import ShareBanner from "../components/ui/ShareBanner";

export default function Home() {
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
