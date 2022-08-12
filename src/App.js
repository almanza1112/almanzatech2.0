import Navbar from "./components/Navbar";
import Main from './components/Main';
import WhatWeDo from './components/WhatWeDo'
import WhoWeAre from './components/WhoWeAre'
import ContactUs from './components/ContactUs'
import AdvantagesOfWorkingWithUs from "./components/AdvantagesOfWorkingWithUs";
import ThePowerOfCustomization from "./components/ThePowerOfCustomization";

function App() {
  return (
    <div>
      <Navbar/>
      <Main/>
      <WhatWeDo/>
      <ThePowerOfCustomization/>
      <WhoWeAre/>
      <AdvantagesOfWorkingWithUs/>
      <ContactUs/>
    </div>

   
  );
}

export default App;
