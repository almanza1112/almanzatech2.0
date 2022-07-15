import React from 'react'

const WhatWeDo = () => {
  return (
    <div name='whatWeDo' className='section-style'>
        <div className='max-w-[1000px] w-full h-full mx-auto p-4 justify-center'>
            <div className='grid grid-cols-3 h-full'>
                <div className='flex items-center'>
                    <div className='section-title'>WHAT WE DO</div>

                </div>
                <div className='col-span-2 flex flex-col justify-center items-start'>
                    <div className='py-4'>
                        <div className='text-xl'>WEBSITES</div>
                        <div>Creating apps in both iOS and Android, we will deliver your app with the highest quality and design.</div>
                    </div>
                    <div className='py-4'>
                        <div className='text-xl'>MOBILE APPLICATIONS</div>
                        <div>We can help you increase traction and returning visitors by trusting us with top class user experience.</div>
                    </div>
                    <div className='py-4'>
                        <div className='text-xl'>IT</div>
                        <div>From fixing your computer, newtwork issues, or office/home set up, we have you covered.</div>
                    </div>
                    <div className='py-4'>
                        <div className='text-xl'>CONSULTING</div>
                        <div>If you don't know where to start or are stuck on in issue, we will point you in the right direction.</div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default WhatWeDo