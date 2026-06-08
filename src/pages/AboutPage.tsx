import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import About from "../components/landing/About";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/landing/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <About />
      <FAQ />
      <Footer />
    </main>
  );
}
