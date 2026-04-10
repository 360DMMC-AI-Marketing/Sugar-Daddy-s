import React, { useContext, useState } from 'react';
import './CSS/PlaceOrder.css';
import { ShopContext } from '../Context/ShopContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

const PlaceOrder = () => {
    const { getTotalCartAmount, cartItems, all_product, clearCart } = useContext(ShopContext);
    const navigate = useNavigate();

    const [deliveryMethod, setDeliveryMethod] = useState('delivery');
    const [paymentMethod,  setPaymentMethod]  = useState('cash');
    const [orderState,     setOrderState]     = useState('form');
    const [orderResult,    setOrderResult]    = useState(null);
    const [customerInfo,   setCustomerInfo]   = useState({
        fullName: '', email: '', phone: '', address: '', city: ''
    });

    const subtotal    = getTotalCartAmount();
    const shippingFee = deliveryMethod === 'delivery' ? (subtotal === 0 ? 0 : 7) : 0;
    const total       = subtotal === 0 ? 0 : subtotal + shippingFee;

    const handleInputChange = (e) =>
        setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });

    const getCartProducts = () => {
        const items = [];
        for (const key in cartItems) {
            if (cartItems[key] > 0) {
                const product = all_product.find(p => p.id === Number(key));
                if (product) items.push({ ...product, quantity: cartItems[key] });
            }
        }
        return items;
    };

    const placeOrder = async (event) => {
        event.preventDefault();
        if (subtotal === 0) return;

        const products = Object.keys(cartItems)
            .filter(key => cartItems[key] > 0)
            .map(key => ({ productId: key, quantity: cartItems[key] }));

        const order = { products, subtotal, shippingFee, total, customerInfo, deliveryMethod, paymentMethod };
        const token = localStorage.getItem('auth-token');
        if (!token) { navigate('/login'); return; }

        setOrderState('processing');
        try {
            if (paymentMethod === 'online') {
                const payRes = await fetch(`${API_BASE}/create-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'auth-token': token },
                    body: JSON.stringify({ amount: total })
                });
                const payData = await payRes.json();
                if (payData.paymentUrl) { window.location.href = payData.paymentUrl; return; }
            }
            const response = await fetch(`${API_BASE}/createorder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'auth-token': token },
                body: JSON.stringify(order)
            });
            if (response.status === 401) { navigate('/login'); return; }
            const data = await response.json();
            if (data.success) { setOrderResult(data); setOrderState('success'); clearCart(); }
            else { setOrderState('error'); }
        } catch (error) {
            console.error(error);
            setOrderState('error');
        }
    };

    // ── Success screen ────────────────────────────────────────
    if (orderState === 'success') {
        return (
            <div className="order-confirmation">
                <div className="order-confirmation-card">
                    <div className="order-success-icon">
                        <svg viewBox="0 0 52 52">
                            <circle cx="26" cy="26" r="25" fill="none" stroke="#4BB543" strokeWidth="2"/>
                            <path fill="none" stroke="#4BB543" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 27l7 7 16-16"/>
                        </svg>
                    </div>
                    <h1>Order Confirmed!</h1>
                    <p className="order-success-sub">Thank you for your order at Sugar Daddy's 🍪</p>
                    <div className="order-conf-details">
                        <div className="conf-row"><span>Order #</span><strong>{orderResult?.orderId || 'N/A'}</strong></div>
                        <div className="conf-row"><span>Delivery</span><strong>{deliveryMethod === 'delivery' ? 'Home Delivery' : 'In-Store Pickup'}</strong></div>
                        <div className="conf-row"><span>Payment</span><strong>{paymentMethod === 'cash' ? 'Cash' : 'Online'}</strong></div>
                        <div className="conf-row conf-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
                    </div>
                    <div className="conf-actions">
                        <button className="btn-primary"    onClick={() => navigate('/')}>Back to Home</button>
                        <button className="btn-secondary"  onClick={() => navigate('/profile?tab=orders')}>Track My Order</button>
                    </div>
                </div>
            </div>
        );
    }

    if (orderState === 'processing') {
        return (
            <div className="order-confirmation">
                <div className="order-confirmation-card">
                    <div className="order-spinner"></div>
                    <h2>Processing your order…</h2>
                </div>
            </div>
        );
    }

    if (orderState === 'error') {
        return (
            <div className="order-confirmation">
                <div className="order-confirmation-card">
                    <div className="order-error-icon">
                        <svg viewBox="0 0 52 52">
                            <circle cx="26" cy="26" r="25" fill="none" stroke="#e74c3c" strokeWidth="2"/>
                            <path fill="none" stroke="#e74c3c" strokeWidth="3" strokeLinecap="round" d="M18 18l16 16M34 18l-16 16"/>
                        </svg>
                    </div>
                    <h1>Something went wrong</h1>
                    <p>Please try again or contact us at hello@sugardaddysbakeshoppe.com</p>
                    <div className="conf-actions">
                        <button className="btn-primary" onClick={() => setOrderState('form')}>Try Again</button>
                    </div>
                </div>
            </div>
        );
    }

    const cartProducts = getCartProducts();

    // ── Main order form ───────────────────────────────────────
    return (
        <div className="place-order-page">
            <div className="place-order-header">
                <h1>Checkout</h1>
            </div>

            <form className="place-order" onSubmit={placeOrder}>
                <div className="place-order-left">

                    {/* Step 1 — Contact info */}
                    <div className="order-section">
                        <h2 className="section-title"><span className="section-num">1</span>Your Information</h2>
                        <div className="form-grid">
                            <input type="text"  name="fullName" value={customerInfo.fullName} onChange={handleInputChange} placeholder="Full Name"     required />
                            <input type="email" name="email"    value={customerInfo.email}    onChange={handleInputChange} placeholder="Email Address"  required />
                            <input type="tel"   name="phone"    value={customerInfo.phone}    onChange={handleInputChange} placeholder="Phone Number"   required />
                        </div>
                    </div>

                    {/* Step 2 — Delivery */}
                    <div className="order-section">
                        <h2 className="section-title"><span className="section-num">2</span>Delivery Method</h2>
                        <div className="option-cards">
                            <label className={`option-card ${deliveryMethod === 'delivery' ? 'selected' : ''}`}>
                                <input type="radio" name="dm" value="delivery"
                                    checked={deliveryMethod === 'delivery'}
                                    onChange={e => setDeliveryMethod(e.target.value)} />
                                <div className="oc-content">
                                    <span className="oc-icon">🚚</span>
                                    <div><strong>Home Delivery</strong><span>+$7.00</span></div>
                                </div>
                            </label>
                            <label className={`option-card ${deliveryMethod === 'pickup' ? 'selected' : ''}`}>
                                <input type="radio" name="dm" value="pickup"
                                    checked={deliveryMethod === 'pickup'}
                                    onChange={e => setDeliveryMethod(e.target.value)} />
                                <div className="oc-content">
                                    <span className="oc-icon">🏪</span>
                                    <div><strong>In-Store Pickup</strong><span>Free · Los Angeles</span></div>
                                </div>
                            </label>
                        </div>
                        {deliveryMethod === 'delivery' && (
                            <div className="form-grid" style={{ marginTop: 14 }}>
                                <input type="text" name="address" value={customerInfo.address} onChange={handleInputChange} placeholder="Street Address" required />
                                <input type="text" name="city"    value={customerInfo.city}    onChange={handleInputChange} placeholder="City"           required />
                            </div>
                        )}
                    </div>

                    {/* Step 3 — Payment */}
                    <div className="order-section">
                        <h2 className="section-title"><span className="section-num">3</span>Payment</h2>
                        <div className="option-cards">
                            <label className={`option-card ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                                <input type="radio" name="pm" value="cash"
                                    checked={paymentMethod === 'cash'}
                                    onChange={e => setPaymentMethod(e.target.value)} />
                                <div className="oc-content">
                                    <span className="oc-icon">💵</span>
                                    <div><strong>{deliveryMethod === 'delivery' ? 'Pay on Delivery' : 'Pay In Store'}</strong><span>Cash</span></div>
                                </div>
                            </label>
                            <label className={`option-card ${paymentMethod === 'online' ? 'selected' : ''}`}>
                                <input type="radio" name="pm" value="online"
                                    checked={paymentMethod === 'online'}
                                    onChange={e => setPaymentMethod(e.target.value)} />
                                <div className="oc-content">
                                    <span className="oc-icon">💳</span>
                                    <div><strong>Pay Online</strong><span>Coming soon</span></div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="place-order-right">
                    <div className="order-summary-card">
                        <h2>Order Summary</h2>
                        <div className="order-summary-items">
                            {cartProducts.map(item => (
                                <div key={item.id} className="summary-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="summary-item-info">
                                        <p>{item.name}</p>
                                        <p className="si-qty">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="si-price">${(item.new_price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="summary-totals">
                            <div className="st-row"><p>Subtotal</p><p>${subtotal.toFixed(2)}</p></div>
                            <div className="st-row"><p>Shipping</p><p>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</p></div>
                            <hr />
                            <div className="st-row st-final"><h3>Total</h3><h3>${total.toFixed(2)}</h3></div>
                        </div>
                        <button type="submit" className="confirm-order-btn" disabled={subtotal === 0}>
                            {subtotal === 0 ? 'Your cart is empty' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PlaceOrder;
