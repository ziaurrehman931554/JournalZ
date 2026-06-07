import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import About from "../components/landing/About";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/landing/Footer";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import CursorFollower from "../components/ui/CursorFollower";
import ScrollToTop from "../components/ui/ScrollToTop";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <CursorFollower />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <About />
        <FAQ />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
