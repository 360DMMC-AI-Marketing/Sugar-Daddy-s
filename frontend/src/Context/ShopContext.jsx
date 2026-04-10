import React, { createContext, useEffect, useState } from 'react';

export const ShopContext = createContext(null);

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i <= 300; i++) cart[i] = 0;
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        fetch(`${API_BASE}/allproducts`)
            .then(res => res.json())
            .then(data => setAll_Product(data))
            .catch(err => console.error('Failed to fetch products:', err));

        if (localStorage.getItem('auth-token')) {
            fetch(`${API_BASE}/getcart`, {
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: '',
            })
                .then(res => res.json())
                .then(data => { if (data && typeof data === 'object') setCartItems(data); })
                .catch(err => console.error('Failed to fetch cart:', err));
        }
    }, []);

    const addToCart = (itemId) => {
        setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        if (localStorage.getItem('auth-token')) {
            fetch(`${API_BASE}/addtocart`, {
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            });
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems(prev => ({ ...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0) }));
        if (localStorage.getItem('auth-token')) {
            fetch(`${API_BASE}/removefromcart`, {
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            });
        }
    };

    const clearCart = () => setCartItems(getDefaultCart());

    const getTotalCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [id, qty]) => {
            if (qty <= 0) return total;
            const product = all_product.find(p => p.id === Number(id));
            return product ? total + product.new_price * qty : total;
        }, 0);
    };

    const getTotalCartItems = () => {
        return Object.values(cartItems).reduce((sum, qty) => sum + (qty > 0 ? qty : 0), 0);
    };

    return (
        <ShopContext.Provider value={{ getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart, clearCart }}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
