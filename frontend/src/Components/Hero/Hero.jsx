import React from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-bg-pattern"></div>
        <div className="hero-left">
            <div className="hero-tagline">Handcrafted · Small Batch · Globally Inspired</div>
            <h1 className="hero-headline">
                Cookies That Tell<br/>
                <em>A Story</em>
            </h1>
            <p className="hero-sub">
                Artisanal cookies made with single-origin ingredients sourced from around the world.
                Not too sweet — just perfectly crafted.
            </p>
            <div className="hero-cta-row">
                <Link to="/products?category=artisanal">
                    <button className="hero-btn-primary">Shop Now</button>
                </Link>
                <Link to="/products?category=custom">
                    <button className="hero-btn-secondary">Custom Orders</button>
                </Link>
            </div>
            <div className="hero-badges">
                <div className="hero-badge">
                    <span className="badge-icon">🍫</span>
                    <span>Colombian Chocolate</span>
                </div>
                <div className="hero-badge">
                    <span className="badge-icon">🌿</span>
                    <span>House-Made Vanilla</span>
                </div>
                <div className="hero-badge">
                    <span className="badge-icon">✦</span>
                    <span>$5 per cookie</span>
                </div>
            </div>
        </div>
        <div className="hero-right">
            <div className="hero-cookie-showcase">
                <div className="cookie-circle cookie-1">🍪</div>
                <div className="cookie-circle cookie-2">🍫</div>
                <div className="cookie-circle cookie-3">✨</div>
                <div className="hero-center-badge">
                    <div className="badge-ring">
                        <span className="badge-main">50+</span>
                        <span className="badge-sub">Flavors</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero
