import React from 'react'
import WhoWeAreImg from '../assets/whoweare.png'

const WhoWeAre = () => {
  return (
    <div name='whoWeAre' className='section-style'>
      <div className='max-w-screen-2xl w-full h-full mx-auto p-8 flex justify-center'>
        <div className='w-full grid md:grid-cols-2 gap-8 items-center'>
          <div>
            <img src={WhoWeAreImg}/>
          </div>

          <div className='flex flex-col'>
            <div className='text-left'>
              <p className='section-title'>Who We Are</p>
            </div>

            <div className='my-16'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default WhoWeAre