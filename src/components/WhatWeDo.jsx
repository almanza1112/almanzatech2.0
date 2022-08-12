import React from 'react'
import {Link} from 'react-scroll'
import {CgWebsite} from 'react-icons/cg'
import {FaMobileAlt} from 'react-icons/fa'
import {BsFillPeopleFill, BsTools} from 'react-icons/bs'

const WhatWeDo = () => {

  return (
    <div name='whatWeDo' className='section-style'>
        <div className='max-w-screen-2xl w-full h-full mx-auto justify-center flex'>
            <div className='w-full grid md:grid-cols-2 gap-8 items-center'>
                <div className='flex flex-col'>
                    <div className='text-left'>
                        <p className='section-title'>What We Do</p>
                    </div>
                    <div className='my-8 md:my-16'>
                        <p>
                            Every business nowadays needs to have an internet presence as well as a good technological infrastructure to
                            market, scale, and adapt as your business grows. This is where we at AlmanzaTech excel in. We create and design 
                            custom websites and mobile apps with the most modern technologies. We also offer amazing IT support and consulting
                            so that your business stays up and running. Join our network of amazing engineers today!
                        </p>
                    </div>
                    
                    <Link to="contactUs" smooth={true} duration={500} offset={-80}>
                        <button className='flat-btn'>GET A QUOTE</button>
                    </Link>
                </div>
                <div className='grid md:grid-cols-2 gap-4'>
                    {/* item - websites */}
                    <div className='wwd-item'>
                        <div className='flex justify-center items-center'>
                            <div className='border-2 border-primary rounded-full p-2 md:p-4 '>
                                <CgWebsite size={25} color='#5ce1e6' />
                            </div>
                        </div>
                        <div className='col-span-3'>
                            <div className='wwd-item-title'>Websites</div>
                            <p>We help you increase traction and returning visitors by our top class user experience and design.</p>
                        </div>
                    </div>

                    {/* item - mobile applications */}
                    <div className='wwd-item'>
                        <div className='flex justify-center items-center'>
                            <div className='border-2 border-primary rounded-full p-2 md:p-4 '>
                                <FaMobileAlt size={25} color='#5ce1e6' />
                            </div>
                        </div>
                        <div className='col-span-3'>
                            <div className='wwd-item-title'>Mobile Applications</div>
                            <div>Creating apps in both iOS and Android, we will deliver your app with the highest quality and design.</div>
                        </div>
                    </div>

                    {/* item - IT support */}
                    <div className='wwd-item'>
                        <div className='flex justify-center items-center'>
                            <div className='border-2 border-primary rounded-full p-2 md:p-4  '>
                                <BsTools size={25} color='#5ce1e6' />
                            </div>
                        </div>
                        <div className='col-span-3'>
                            <div className='wwd-item-title'>IT Support</div>
                            <p>From fixing your computer, newtwork issues, or office and home set up, we have you covered.</p>
                        </div>
                    </div>

                    {/* item - consulting */}
                    <div className='wwd-item'>
                        <div className='flex justify-center items-center'>
                            <div className='border-2 border-primary rounded-full p-2 md:p-4 '>
                                <BsFillPeopleFill size={25} color='#5ce1e6' />
                            </div>
                        </div>
                        <div className='col-span-3'>
                            <div className='wwd-item-title'>Consulting</div>
                            <p>If you don't know where to start or are stuck on an issue, we will point you in the right direction to get things rolling.</p>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default WhatWeDo