import Navbar from "./components/Navbar";
import Main from './components/Main';
import WhatWeDo from './components/WhatWeDo'
import WhoWeAre from './components/WhoWeAre'
import ContactUs from './components/ContactUs'
import PowerOfCustomization from "./components/PowerOfCustomization";
import AdvantagesOfWorkingWtihUs from "./components/AdvantagesOfWorkingWtihUs";

function App() {
  return (
    <div>
      <Navbar/>
      <Main/>
      <WhatWeDo/>
      <AdvantagesOfWorkingWtihUs/>
      <WhoWeAre/>
      <PowerOfCustomization/>
      <ContactUs/>
    </div>

   
  );
}

export default App;
