import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <div className="nl-inner">
            <span className="section-label">Stay in the Loop</span>
            <h1>New Flavors, First</h1>
            <p>Join our community of cookie lovers. Get early access to new recipes, seasonal specials, and Troy's global sourcing stories.</p>
            <div className="nl-form">
                <input type="email" placeholder="Your email address" />
                <button>Subscribe</button>
            </div>
        </div>
    </div>
  )
}

export default NewsLetter
