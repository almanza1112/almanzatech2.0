import React from 'react'
import {Link} from 'react-scroll'
import bgVideo from '../assets/main_vid_bg.mp4'

const Main = () => {
  return (
        <div className='main'>
          <div className='overlay'></div>
          <video src={bgVideo} autoPlay loop muted playsInline/>
            <div className='main-content'>
              <div className='text-2xl sm:text-4xl md:text-6xl font-bold'>WE BUILD YOUR VISION</div>  
              <div className=' my-4'>Serving businesses and entrepreneurs since 2019</div>
              <div>
                <Link to="whatWeDo" smooth={true} duration={500} offset={-80}>
                  <button className='flat-btn my-2'>LEARN MORE ABOUT US</button>
                </Link>
              </div>
            </div>
        </div>
  )
}

export default Main