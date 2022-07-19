import React, { useState } from 'react'

const ContactUs = () => {

  const [didSend, setMessage] = useState(false);
  const form = document.getElementById('AlmanzaTechForm');

  form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(form.action, {
      method: 'POST',
      body: new FormData(document.getElementById('AlmanzaTechForm'))
    }).then(
      response => response.json()
    ).then((html) => {
      setMessage(true)
    });
  }); 
  return (
    <div name='contactUs' className='section-style'>
      <div className='max-w-screen-2xl w-full h-full mx-auto p-8 flex justify-center'>
        <div className='w-full grid md:grid-cols-2 gap-8 items-center'>
          <div className='flex flex-col'>
            <div className='text-left md:mb-16 mb-8'>
              <p className='section-title'>Contact Us</p>
            </div>

            <div className='grid md:grid-cols-2 md:gap-16 gap-8'>
              {/* Item */}
              <div>
                <p className='cu-item-title'>Email</p>
                <p>info@almanzatech.com</p>
              </div>
              {/* Item */}
              <div>
                <p className='cu-item-title'>Phone</p>
                <p>(201) 467-1007</p>
              </div>
              {/* Item */}
              <div>
                <p className='cu-item-title'>Hours</p>
                <p>Monday to Friday: 9AM - 6PM</p>
                <p>Saturday: 10AM - 1PM</p>
              </div>
            </div>
          </div>

          <form id='AlmanzaTechForm' method='POST' action='https://sheetdb.io/api/v1/i2bbvaqeluzn2' className='flex flex-col w-full'>
            <div className={didSend ? 'text-xl md:text-2xl mb-8 font-bold' : 'hidden'}>Message sent!</div>
            <div className='grid md:grid-cols-2 md:gap-4'>
              <input className='mb-4 p-2 bg-gray-100 text-black' type="text" placeholder='Name' name='name'/>
              <input className='mb-4 p-2 bg-gray-100 text-black' type="email" placeholder='Email' name='email'/>
            </div>
            <input className='mb-4 p-2 bg-gray-100 text-black' type="text" placeholder='Subject' name='subject'/>
           
            <textarea className='bg-gray-100 text-black p-2' name="message" rows="5" placeholder='Message'></textarea>
            <div className=''>
              <button className='flat-btn my-8'>SUBMIT</button>
            </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default ContactUs