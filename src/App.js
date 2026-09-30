import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Services from "./components/Services";
import Process from "./components/Process";
import About from "./components/About";
import Faq from "./components/Faq";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import CallBar from "./components/CallBar";
import CaseStudyPage from "./components/CaseStudyPage";
import PrivacyPage from "./components/PrivacyPage";
import { PAGE_COPY } from "./data/work";
import { useRoute } from "./lib/router";
import useSectionViews from "./hooks/useSectionViews";

const TRACKED_SECTIONS = ["services", "work", "process", "about", "faq", "contact"];

const HomePage = () => {
  useSectionViews(TRACKED_SECTIONS);
  useEffect(() => {
    document.title = PAGE_COPY.homeTitle;
  }, []);

  return (
    <>
      <Hero />
      <Services />
      <Work />
      <Process />
      <About />
      <Faq />
      <ContactUs />
    </>
  );
};

function App() {
  const route = useRoute();

  return (
    <>
      <Navbar isHome={route.page === "home"} />

      <main className={route.page === "case" ? "case-main" : undefined}>
        {route.page === "case" ? <CaseStudyPage slug={route.slug} /> :
          route.page === "privacy" ? <PrivacyPage /> : <HomePage />}
      </main>

      <Footer />
      <CallBar key={route.page} />
    </>
  );
}

export default App;
