import React from 'react'
import './Footer.css'
import instagram_icon from '../Assets/instagram_icon.png'
import facebook_icon from '../Assets/facebook.png'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='footer'>
        <div className="footer-main">
            <div className="footer-col footer-brand">
                <div className="footer-logo">
                    <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                        <polygon points="18,2 34,32 2,32" stroke="#D4A24C" strokeWidth="2" fill="rgba(212,162,76,0.15)"/>
                        <circle cx="18" cy="22" r="5" fill="#D4A24C"/>
                    </svg>
                    <p>Sugar Daddy's</p>
                </div>
                <p className="footer-desc">Artisanal cookies crafted with single-origin ingredients from around the world. Not too sweet — just right.</p>
                <div className="footer-tagline">Bake Shoppe · sugardaddysbakeshoppe.com</div>
                <div className="footer-social">
                    <a href="https://www.instagram.com/sugardaddysbakeshoppe" target='_blank' rel='noreferrer' className="footer-social-link">
                        <img src={instagram_icon} alt='Instagram' />
                    </a>
                    <a href="https://www.facebook.com/sugardaddysbakeshoppe" target='_blank' rel='noreferrer' className="footer-social-link">
                        <img src={facebook_icon} alt='Facebook' />
                    </a>
                </div>
            </div>

            <div className="footer-col">
                <h4>Our Cookies</h4>
                <Link to="/products?category=classic">Classic</Link>
                <Link to="/products?category=artisanal">Artisanal</Link>
                <Link to="/products?category=exotic">Exotic</Link>
                <Link to="/products?category=custom">Custom Orders</Link>
            </div>

            <div className="footer-col">
                <h4>Information</h4>
                <Link to="/terms">Terms of Service</Link>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/profile?tab=orders">Track My Order</Link>
            </div>

            <div className="footer-col">
                <h4>Contact</h4>
                <p>Sugar Daddy's Bake Shoppe</p>
                <a href="https://www.instagram.com/sugardaddysbakeshoppe" target='_blank' rel='noreferrer'>@sugardaddysbakeshoppe</a>
                <a href="https://sugardaddysbakeshoppe.com" target='_blank' rel='noreferrer'>sugardaddysbakeshoppe.com</a>
            </div>
        </div>

        <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Sugar Daddy's Bake Shoppe. All rights reserved.</p>
            <p className="footer-craft">Made with 🍫 single-origin chocolate</p>
        </div>
    </footer>
  );
};

export default Footer;
