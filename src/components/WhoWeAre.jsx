import React from 'react'
import WhoWeAreImg from '../assets/whoweare.png'

const WhoWeAre = () => {
  return (
    <div name='whoWeAre' className='section-style'>
      <div className='max-w-screen-2xl w-full h-full mx-auto flex justify-center'>
        <div className='w-full grid md:grid-cols-2 md:gap-8 items-center '>
          <div>
            <img loading='lazy' src={WhoWeAreImg}/>
          </div>

          <div className='flex flex-col order-first md:order-last'>
            <p className='section-title md:self-start'>Who We Are</p>

            <p className='my-8 md:my-16'>
              Based in Northern New Jersey, since 2019 AlmanzaTech has strived in exceeding the needs of individuals 
              and businesses looking for the best and customizable applications. We are a dedicated team that 
              believes in every final product we create should be a work of art. We treat you like family here
              and always try to ensure that you are 100% satisfied.           
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}

export default WhoWeAre