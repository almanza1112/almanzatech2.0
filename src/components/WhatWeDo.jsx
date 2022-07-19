import React from 'react'
import {CgWebsite} from 'react-icons/cg'
import {FaMobileAlt} from 'react-icons/fa'
import {BsFillPeopleFill, BsTools} from 'react-icons/bs'

const WhatWeDo = () => {
  return (
    <div name='whatWeDo' className='section-style'>
        <div className='max-w-screen-2xl w-full h-full mx-auto p-8 justify-center flex'>
            <div className='w-full grid md:grid-cols-2 gap-8 items-center'>
                <div className='flex flex-col'>
                    <div className='text-left'>
                        <p className='section-title'>What We Do</p>
                    </div>
                    <div className='my-8 md:my-16'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                    <div className=''>
                        <button className='flat-btn'>GET A QUOTE</button>
                    </div>
                </div>
                <div className='grid md:grid-cols-2 gap-4'>
                    {/* item - websites */}
                    <div className='wwd-item '>
                        <div className='flex justify-center items-center'>
                            <div className='border-2 border-primary rounded-full p-2 md:p-4 '>
                                <CgWebsite size={25} color='#5ce1e6' />
                            </div>
                        </div>
                        <div className='col-span-3'>
                            <div className='wwd-item-title'>Websites</div>
                            <div>Creating apps in both iOS and Android, we will deliver your app with the highest quality and design.</div>
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
                            <div>Creating apps in both iOS and Android, we will deliver your app with the highest quality and design.</div>
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
                            <div>Creating apps in both iOS and Android, we will deliver your app with the highest quality and design.</div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default WhatWeDo