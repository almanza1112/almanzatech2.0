import React from 'react'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import { MdTimer10Select } from 'react-icons/md'

const ThePowerOfCustomization = () => {
  return (
    <div className='section-style'>
      <div className='max-w-screen-2xl w-full mx-auto flex flex-col justify-center items-center'>
        <p className='section-title'>The Power of Customization</p>
        <div className='grid md:grid-cols-3 md:gap-32 my-8 md:my-16 divide-y divide-gray-700 md:divide-none'>
          <div className='flex flex-col pb-8 md:pb-0'>
              <FiTrendingUp size={40} color='#5ce1e6' className='self-center'/>
            <p className='my-4 md:my-8'>A well-designed site can have up to a 200% higher conversion rate and more than 400% on sites with a 
              superior user experience.</p>
            <a href='https://www.forrester.com/blogs/09-10-15-leaving_user_experience_to_chance_hurts_companies/' className='italic self-center text-sm'>(SOURCE: <u>Forrester</u>)</a>
          </div>

          <div className='flex flex-col py-8 md:py-0'>
            <FiTrendingDown size={40} color='#5ce1e6' className='self-center' />
            <p className='my-4 md:my-8'>About 40% of users will leave if a website or app if it takes longer 3 seconds to load. It is very 
              important that your mobile app/website be optimized yearly so that you can get the best performance.</p>
            <a href='https://www.youtube.com/watch?v=YJGCZCaIZkQ&ab_channel=GoogleChromeDevelopers' className='italic self-center text-sm'>(SOURCE: <u>Google</u>)</a>
          </div>

          <div className='flex flex-col pt-8 md:pt-0'>
            <MdTimer10Select size={40} color='#5ce1e6'  className='self-center'/>
            <p className='my-4 md:my-8'>How long does a website have to make an impression? The answer is 10 seconds. We make sure every second 
              counts and that your user will be left with a good impression.</p>
            <a href='https://blog.sagipl.com/web-design-statistics/' className='italic self-center text-sm'>(SOURCE: <u>Sagipl</u>)</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThePowerOfCustomization