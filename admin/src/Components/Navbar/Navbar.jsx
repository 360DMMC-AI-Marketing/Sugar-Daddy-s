import React from 'react'
import "./Navbar.css"

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="nav-logo-text">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                <polygon points="18,2 34,32 2,32" stroke="#D4A24C" strokeWidth="2" fill="rgba(212,162,76,0.15)"/>
                <circle cx="18" cy="22" r="5" fill="#D4A24C"/>
            </svg>
            <span>Sugar Daddy's Admin</span>
        </div>
        <div className='nav-profile'>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4A24C" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        </div>
    </div>
  )
}

export default Navbar
