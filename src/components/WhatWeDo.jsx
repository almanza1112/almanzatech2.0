import React from 'react'
import {CgWebsite} from 'react-icons/cg'
import {FaMobileAlt} from 'react-icons/fa'
import {BsFillPeopleFill, BsTools} from 'react-icons/bs'
import { useInView } from 'react-intersection-observer'

const WhatWeDo = () => {
    const options = {triggerOnce: true}
    const {ref: btnRef, inView: btnVis} = useInView(options);
    const {ref: pRef, inView: pVis} = useInView(options);
    const {ref: wRef, inView: wVis} = useInView(options);
    const {ref: mRef, inView: mVis} = useInView(options);
    const {ref: iRef, inView: iVis} = useInView(options);
    const {ref: cRef, inView: cVis} = useInView(options);

    
  return (
    <div name='whatWeDo' className='section-style'>
        <div className='max-w-screen-2xl w-full h-full mx-auto p-8 justify-center flex'>
            <div className='w-full grid md:grid-cols-2 gap-8 items-center'>
                <div className='flex flex-col'>
                    <div className='text-left'>
                        <p className='section-title'>What We Do</p>
                    </div>
                    <div ref={pRef} className={pVis ? 'animate-in slide-in-from-left my-8 md:my-16' : 'my-8 md:my-16 '}>
                        <p>
                            Every business nowadays needs to have an internet presence as well as a good technological infrastructure to
                            market, scale, and adapt as your business grows. This is where we at AlmanzaTech excel in. We create and design 
                            custom websites and mobile apps with the most modern technologies. We also offer amazing IT support and consulting
                            so that your business stays up and running. Join our network of amazing engineers today!
                        </p>
                    </div>
                    
                    <div >
                        <button ref={btnRef} className={btnVis ? 'animate-in slide-in-from-left flat-btn' : 'flat-btn'}>GET A QUOTE</button>
                    </div>
                </div>
                <div className='grid md:grid-cols-2 gap-4'>
                    {/* item - websites */}
                    <div ref={wRef} className={wVis ? 'wwd-item animate-in slide-in-from-right':'wwd-item '}>
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
                    <div ref={mRef} className={mVis ? 'wwd-item animate-in slide-in-from-right':'wwd-item '}>
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
                    <div ref={iRef} className={iVis ? 'wwd-item animate-in slide-in-from-right':'wwd-item '}>
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
                    <div ref={cRef} className={cVis ? 'wwd-item animate-in slide-in-from-righ':'wwd-item '}>
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