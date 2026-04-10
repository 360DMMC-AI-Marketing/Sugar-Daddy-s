import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import chevron from '../Assets/chevron.png'

const Navbar = () => {
    const [menu, setMenu] = useState('home');
    const { getTotalCartItems } = useContext(ShopContext);
    const menuRef = useRef();
    const [profileOpen, setProfileOpen] = useState(false);

    const isLoggedIn = !!localStorage.getItem('auth-token');

    const toggleMobileMenu = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    };

    return (
        <div className='navbar'>
            <div className="nav-logo">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div className="nav-logo-mark">
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                            <polygon points="18,2 34,32 2,32" stroke="#D4A24C" strokeWidth="2" fill="rgba(212,162,76,0.15)"/>
                            <circle cx="18" cy="22" r="5" fill="#D4A24C"/>
                        </svg>
                        <span className="nav-brand-name">Sugar Daddy's</span>
                    </div>
                </Link>
            </div>

            <img className='nav-dropdown' onClick={toggleMobileMenu} src={chevron} alt="" />

            <ul ref={menuRef} className="nav-menu">
                <li onClick={() => setMenu('home')}>
                    <Link style={{ textDecoration: 'none' }} to="/">Home</Link>
                    {menu === 'home' ? <hr /> : null}
                </li>
                <li onClick={() => setMenu('shop')}>
                    <Link style={{ textDecoration: 'none' }} to="/products">Shop</Link>
                    {menu === 'shop' ? <hr /> : null}
                </li>
            </ul>

            <div className="nav-login-cart">
                {!isLoggedIn && <Link to="/login"><button>Sign In</button></Link>}
                <Link to="/cart">
                    <div className="nav-cart-wrap">
                        <img src={cart_icon} alt="Cart" />
                        {getTotalCartItems() > 0 && (
                            <div className="nav-cart-count">{getTotalCartItems()}</div>
                        )}
                    </div>
                </Link>
                {isLoggedIn && (
                    <div className="nav-profile-wrapper">
                        <div
                            className={`nav-profile-icon ${profileOpen ? 'active' : ''}`}
                            onClick={() => setProfileOpen(!profileOpen)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        {profileOpen && (
                            <>
                                <div className="nav-profile-overlay" onClick={() => setProfileOpen(false)}></div>
                                <div className="nav-profile-dropdown">
                                    <div className="nav-profile-dd-label">My Account</div>
                                    <Link to="/profile" onClick={() => setProfileOpen(false)}>
                                        <div className="nav-profile-dropdown-item">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                            My Profile
                                        </div>
                                    </Link>
                                    <Link to="/profile?tab=orders" onClick={() => setProfileOpen(false)}>
                                        <div className="nav-profile-dropdown-item">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                                            My Orders
                                        </div>
                                    </Link>
                                    <div className="nav-profile-dropdown-divider"></div>
                                    <div
                                        className="nav-profile-dropdown-item logout"
                                        onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/'); }}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                        Sign Out
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
