import React, {useState} from 'react'
import {Link} from 'react-scroll'
import {FaTimes} from 'react-icons/fa'
import {HiMenuAlt4} from 'react-icons/hi'
import Logo from '../assets/almanzatech.png'

const Navbar = () => {

    // Setting mobile view
    const [nav, setNav] = useState(false)
    const handleClick = () => setNav(!nav)

    // Change navbar when scrolling
    const [color, setColor] = useState(false)
    const changeColor = () => {
        if (window.scrollY >= 80){
            setColor(true)
        } else {
            setColor(false)
        }
    }

    window.addEventListener('scroll', changeColor)

    
  return (
    <nav className={color ? 'bg-black border-b duration-750 border-primary fixed w-full h-20 flex justify-between items-center px-4 z-10' : 'fixed w-full h-20 flex justify-between items-center px-4 bg-transparent z-10'}>
       <div className=''>
            <img src={Logo} alt="AlmanzaTech Logo" style={{width:'250px'}}/>
        </div>

        {/* Menu */}
        <ul className='hidden md:flex'>
                <li className='hover:text-primary'>
                    <Link to="whatWeDo" smooth={true} duration={500}>
                        <p className='py-8'>WHAT WE DO</p>
                    </Link>
                </li>
                <li className='hover:text-primary'>
                    <Link to="whoWeAre" smooth={true} duration={500}>
                        <p className='py-8'>WHO WE ARE</p>
                    </Link>
                </li>
                <li className='hover:text-primary'>
                    <Link to="contactUs" smooth={true} duration={500}>
                        <p className='py-8'>CONTACT US</p>
                    </Link>
                </li>
        </ul>

        {/* Hamburger */}
        <div onClick={handleClick} className='md:hidden z-10'>
            {!nav ? <HiMenuAlt4/> : <FaTimes/>}
        </div>

        {/* Mobile Menu */}
        <ul className={nav ? 'absolute top-0 right-0 pt-4 w-full h-screen bg-black duration-500 border-l-8 border-primary' : 'absolute right-[-100%] pt-4 h-screen w-full '}>
                <li className='text-xl'>
                    <Link onClick={handleClick} to="whatWeDo" smooth={true} duration={500} offset={-80}>
                        <p className='py-4 w-full'>WHAT WE DO</p>
                    </Link>
                </li>
                <li className='text-xl'>
                    <Link onClick={handleClick} to="whoWeAre" smooth={true} duration={500} offset={-80}>
                        <p className='py-4 w-full'>WHO WE ARE</p>
                    </Link>
                </li>
                <li className='text-xl'>
                    <Link onClick={handleClick} to="contactUs" smooth={true} duration={500} offset={-80}>
                        <p className='py-4 w-full'>CONTACT US</p>
                    </Link>
                </li>
        </ul>
    </nav>
  )
}

export default Navbar