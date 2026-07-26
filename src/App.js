import Navbar from "./components/Navbar";
import Main from "./components/Main";
import WhatWeDo from "./components/WhatWeDo";
import Proof from "./components/Proof";
import Process from "./components/Process";
import ThePowerOfCustomization from "./components/ThePowerOfCustomization";
import WhoWeAre from "./components/WhoWeAre";
import AdvantagesOfWorkingWithUs from "./components/AdvantagesOfWorkingWithUs";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import MobileCTA from "./components/MobileCTA";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Main />
        <WhatWeDo />
        <Proof />
        <Process />
        <ThePowerOfCustomization />
        <WhoWeAre />
        <AdvantagesOfWorkingWithUs />
        <ContactUs />
      </main>

      <Footer />
      <MobileCTA />
    </>
  );
}

export default App;
