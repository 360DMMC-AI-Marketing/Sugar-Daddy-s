import React from 'react'
import './Offers.css'
import { Link } from 'react-router-dom'

const Offers = () => {
  return (
    <div className='offers'>
        <div className="offers-inner">
            <div className="offers-left">
                <span className="section-label">Special Occasions</span>
                <h1>Custom Orders<br/>for Your Big Day</h1>
                <p>Weddings, corporate events, birthdays — Troy crafts bespoke cookie arrangements, bonbons, and brownies tailored to your vision.</p>
                <Link to="/products?category=custom">
                    <button>Enquire Now</button>
                </Link>
            </div>
            <div className="offers-right">
                <div className="offers-illustration">
                    <div className="offer-emoji-stack">
                        <span className="oe oe-1">🍪</span>
                        <span className="oe oe-2">🎂</span>
                        <span className="oe oe-3">🍫</span>
                        <span className="oe oe-4">💍</span>
                    </div>
                    <div className="offer-text-badge">
                        <span>Made with love</span>
                        <span>& single-origin chocolate</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Offers
