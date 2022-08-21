import React from 'react'
import {Link} from 'react-scroll'
import {CgWebsite} from 'react-icons/cg'
import {FaMobileAlt} from 'react-icons/fa'
import {BsFillPeopleFill, BsTools} from 'react-icons/bs'
import {SiSimpleanalytics} from 'react-icons/si'

const WhatWeDo = () => {

  return (
    <div name='whatWeDo' className='section-style'>
        <div className='max-w-screen-2xl w-full h-full mx-auto justify-center flex'>
            <div className='w-full grid lg:grid-cols-2 gap-8 items-center'>
                <div className='flex flex-col'>
                    <p className='section-title md:self-start'>What We Do</p>
                    <div className='my-8 md:my-16'>
                        <p>
                            Every business nowadays needs to have an internet presence as well as a good technological infrastructure to
                            market, scale, and adapt as your business grows. This is where we at AlmanzaTech excel in. We create and design 
                            custom websites and mobile apps with the most modern technologies. We also offer amazing IT support and consulting
                            so that your business stays up and running. Join our network of amazing engineers today!
                        </p>
                    </div>
                    
                      <Link to="contactUs" className='self-center md:self-start'smooth={true} duration={500} offset={-80}>
                        <button className='flat-btn'>GET A QUOTE</button>
                    </Link>
                </div>
                <div className='grid md:grid-cols-2 gap-4'>
                    {/* item - websites */}
                    <div className='wwd-item'>
                        <div className='border-2 border-primary rounded-full p-2 md:p-4 self-center justify-self-center'>
                            <CgWebsite size={25} color='#5ce1e6' />
                        </div>
                          
                          <div className='wwd-item-text'>
                            <div className='wwd-item-title'>Websites</div>
                        </div>
                    </div>

                    {/* item - mobile applications */}
                    <div className='wwd-item'>
                          <div className='border-2 border-primary rounded-full p-2 md:p-4 self-center justify-self-center'>
                                <FaMobileAlt size={25} color='#5ce1e6' />
                            </div>
                          <div className='wwd-item-text'>
                            <div className='wwd-item-title'>Mobile Applications</div>
                        </div>
                    </div>

                    {/* item - IT support */}
                    <div className='wwd-item'>
                          <div className='border-2 border-primary rounded-full p-2 md:p-4 self-center justify-self-center'>
                                <BsTools size={25} color='#5ce1e6' />
                            </div>
                          <div className='wwd-item-text'>
                            <div className='wwd-item-title'>IT Support</div>
                        </div>
                    </div>

                    {/* item - consulting */}
                    <div className='wwd-item'>
                          <div className='border-2 border-primary rounded-full p-2 md:p-4 self-center justify-self-center'>
                                <BsFillPeopleFill size={25} color='#5ce1e6' />
                            </div>
                          <div className='wwd-item-text'>
                            <div className='wwd-item-title'>Consulting</div>
                        </div>
                    </div>

                      {/* item - Data Analytics */}
                      <div className='wwd-item'>
                          <div className='border-2 border-primary rounded-full p-2 md:p-4 self-center justify-self-center'>
                              <SiSimpleanalytics size={25} color='#5ce1e6' />
                          </div>
                          <div className='wwd-item-text'>
                              <div className='wwd-item-title'>Data Analytics</div>
                          </div>
                      </div>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default WhatWeDo