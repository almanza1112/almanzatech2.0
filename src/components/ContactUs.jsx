import React, { useState } from 'react'
import {ImSpinner2} from 'react-icons/im'
import {FaCheck} from 'react-icons/fa'

const ContactUs = () => {

  const [didSend, setMessage] = useState(false);
  const [isSending, setSending] = useState(false);
  const form = document.getElementById('AlmanzaTechForm')

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true)
    fetch(form.action, {
      method: 'POST',
      body: new FormData(document.getElementById('AlmanzaTechForm'))
    }).then(
      response => response.json()
    ).then((html) => {
      setSending(false)
      setMessage(true)
    });

  }
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

          <form id='AlmanzaTechForm' onSubmit={handleSubmit} method='POST' action='https://sheetdb.io/api/v1/i2bbvaqeluzn2' className='flex flex-col w-full'>
            <div className={didSend ? 'mb-8 border border-gray-800 py-4 grid grid-cols-5' : 'hidden'}>
              <div className='flex justify-center items-center'>
                <div className='border-2 border-primary rounded-full p-2 md:p-4 '>
                  <FaCheck size={25} color='#5ce1e6'/>
                </div>
              </div>
              <div className='col-span-4 flex items-center'>
                <p className='text-xl md:text-2xl '>              
                  Message sent! We will get back to you soon.
                </p>
              </div>
            </div>
            <div className='grid md:grid-cols-2 md:gap-4'>
              <input className='mb-4 p-2 bg-gray-100 text-black' type="text" placeholder='Name' name='name'/>
              <input className='mb-4 p-2 bg-gray-100 text-black' type="email" placeholder='Email' name='email'/>
            </div>
            <input className='mb-4 p-2 bg-gray-100 text-black' type="text" placeholder='Subject' name='subject'/>
           
            <textarea className='bg-gray-100 text-black p-2' name="message" rows="5" placeholder='Message'></textarea>
            <div className=''>
              <button className='flat-btn my-8 '>SUBMIT<ImSpinner2 className={isSending ? 'animate-spin h-5 w-5 ml-3' : 'hidden'}  viewBox="0 0 16 16"/></button>
            </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default ContactUs