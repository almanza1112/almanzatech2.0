import React from 'react'

const AdvantagesOfWorkingWithUs = () => {
  return (
    <div className='section-style'>
      <div className='max-w-screen-2xl w-full mx-auto flex flex-col items-start md:items-center'>
        <p className='section-title'>Advantages of Working With Us</p>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-8 md:mt-16'>
          {/* Item - Original Code */}
          <div className='aowwu-item'>
            <p className='aowwu-title'>Original Code</p>
            <ul className='aowwu-text'>
              <li>All of our designs and code are 100% original and customizable</li>
              <li>Your web/mobile application will stand out and look unique</li>
            </ul>
          </div>
          {/* Item - Budget Friendly */}
          <div className='aowwu-item'>
            <p className='aowwu-title'>Budget Friendly</p>
            <ul className='aowwu-text'>
              <li>Budgets can we be tight, we understand and will work with you to find the best deal</li>
              <li>We stand behind and guarantee our work for 1 year once shipped for most projects</li>
            </ul>          
          </div>
          {/* Item - Seasoned Engineers */}
          <div className='aowwu-item'>
            <p className='aowwu-title'>Seasoned Engineers</p>
            <ul className='aowwu-text'>
              <li>We have experienced software engineers with different specializations</li>
              <li>All work is done in-house and we do not outsource</li>
            </ul>          
          </div>
          {/* Item - On-time Results */}
          <div className='aowwu-item'>
            <p className='aowwu-title'>On-time Results</p>
            <ul className='aowwu-text'>
              <li>Projects will always be delivered on-time or even before</li>
              <li>We work quick and efficient to get you up and running</li>
            </ul>          
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default AdvantagesOfWorkingWithUs