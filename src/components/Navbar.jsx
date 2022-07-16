import React, {useState} from 'react'
import {Link} from 'react-scroll'
import {FaTimes} from 'react-icons/fa'
import {HiMenuAlt4} from 'react-icons/hi'
import Logo from '../assets/almanzatech.png'

const Navbar = () => {

    const [nav, setNav] = useState(false)
    const handleClick = () => setNav(!nav)
  return (
    <div className='fixed w-full h-20 flex justify-between items-center px-4 bg-transparent z-10'>
       <div className=''>
            <img src={Logo} alt="" style={{width:'250px'}}/>
        </div>

        {/* Menu */}
        <ul className='hidden md:flex'>
                <li className='hover:text-[#5ce1e6]'>
                    <Link to="whatWeDo" smooth={true} duration={500}>
                        WHAT WE DO
                    </Link>
                </li>
                <li className='hover:text-[#5ce1e6]'>
                    <Link to="whoWeAre" smooth={true} duration={500}>
                        WHO WE ARE
                    </Link>
                </li>
                <li className='hover:text-[#5ce1e6]'>
                    <Link to="contactUs" smooth={true} duration={500}>
                        CONTACT US
                    </Link>
                </li>
        </ul>

        {/* Hamburger */}
        <div onClick={handleClick} className='md:hidden z-10'>
            {!nav ? <HiMenuAlt4/> : <FaTimes/>}
        </div>

        {/* Mobile Menu */}
        <ul className={!nav ? 'hidden' : 'absolute top-0 left-0 w-full h-screen bg-[#123e64] flex flex-col justify-center items-center'}>
                <li className='py-6 text-4xl'>
                    <Link onClick={handleClick} to="whatWeDo" smooth={true} duration={500}>
                        WHAT WE DO
                    </Link>
                </li>
                <li className='py-6 text-4xl'>
                    <Link onClick={handleClick} to="whoWeAre" smooth={true} duration={500}>
                        WHO WE ARE
                    </Link>
                </li>
                <li className='py-6 text-4xl'>
                    <Link onClick={handleClick} to="contactUs" smooth={true} duration={500}>
                        CONTACT US
                    </Link>
                </li>
            </ul>


    </div>
  )
}

export default Navbar