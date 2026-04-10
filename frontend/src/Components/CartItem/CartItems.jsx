import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'
import { useNavigate } from 'react-router-dom'

const CartItems = () => {
    const navigate = useNavigate();
    const { getTotalCartAmount, all_product, cartItems, removeFromCart, addToCart } = useContext(ShopContext);

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Product</p>
                <p>Name</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />

            {Object.keys(cartItems).map((productId) => {
                const product = all_product.find(p => p.id === parseInt(productId, 10));
                const quantity = cartItems[productId];

                if (quantity > 0 && product) {
                    return (
                        <div key={productId}>
                            <div className='cartitems-format cartitems-format-main'>
                                <img src={product.image} alt={product.name} className='carticon-product-icon' />
                                <p>{product.name}</p>
                                <p>${product.new_price}</p>
                                <div className="cart-qty-controls">
                                    <button onClick={() => removeFromCart(productId)}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => addToCart(product.id)}>+</button>
                                </div>
                                <p>${(product.new_price * quantity).toFixed(2)}</p>
                                <img
                                    className='cartietms-remove-icon'
                                    src={remove_icon}
                                    onClick={() => {
                                        // Remove all of this item
                                        for (let i = 0; i < quantity; i++) removeFromCart(productId);
                                    }}
                                    alt='Remove'
                                />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}

            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Total</h1>
                    <div>
                        <div className='cartitems-total-item'>
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount().toFixed(2)}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping</p>
                            <p>{getTotalCartAmount() === 0 ? 'Free' : '$7.00'}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount() === 0 ? '0.00' : (getTotalCartAmount() + 7).toFixed(2)}</h3>
                        </div>
                    </div>
                    <button onClick={() => navigate('/order')}>Proceed to Checkout</button>
                </div>

                <div className="cartitems-promocode">
                    <p>Have a promo code? Enter it here.</p>
                    <div className="cartitems-promobox">
                        <input type="text" placeholder='Promo code' />
                        <button>Apply</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;
