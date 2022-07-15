import React from 'react'
import {Link} from 'react-scroll'
import bgVideo from '../assets/bgVideo.mp4'

const Main = () => {
  return (
        <div className='main'>
          <div className='overlay'></div>
          <video src={bgVideo} autoPlay loop muted/>
            <div className='main-content'>
              <div className='text-2xl sm:text-6xl font-bold'>WE BUILD YOUR VISION</div>  
              <div>
                <Link to="whatWeDo" smooth={true} duration={500}>
                  <button className='flat-btn my-2'>LEARN MORE ABOUT US</button>
                </Link>
              </div>
            </div>
        </div>
  )
}

export default Main