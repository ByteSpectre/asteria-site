import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Constellation from "@/components/Constellation";
import PracticeMarquee from "@/components/PracticeMarquee";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Team from "@/components/Team";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Constellation />
        <PracticeMarquee />
        <About />
        <Services />
        <Process />
        <Team />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
