import React, { useContext, useState } from 'react'
import './ProductDisplay.css'
import { ShopContext } from '../../Context/ShopContext'

// Minimum cookies per order — can be updated easily
const MIN_QTY = 6;

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    const [qty, setQty] = useState(MIN_QTY);

    const hasDiscount = product.old_price && product.old_price > product.new_price;
    const discountPct = hasDiscount ? Math.round((1 - product.new_price / product.old_price) * 100) : 0;

    const handleAddToCart = () => {
        for (let i = 0; i < qty; i++) {
            addToCart(product.id);
        }
    };

    const categoryLabels = {
        classic:   'Classic',
        artisanal: 'Artisanal',
        exotic:    'Exotic',
        custom:    'Custom Orders',
    };

    return (
        <div className='productdisplay'>
            {/* Image */}
            <div className="productdisplay-left">
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={product.image} alt={product.name} />
                </div>
            </div>

            {/* Info */}
            <div className="productdisplay-right">
                {/* Category pill */}
                <span className="pd-category-pill">
                    {categoryLabels[product.category] || product.category}
                    {product.subcategory ? ` · ${product.subcategory}` : ''}
                </span>

                <h1>{product.name}</h1>

                {/* Price */}
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-new">${product.new_price} <span className="pd-per">/ cookie</span></div>
                    {hasDiscount && (
                        <>
                            <div className="productdisplay-right-price-old">${product.old_price}</div>
                            <div className="productdisplay-right-discount">-{discountPct}%</div>
                        </>
                    )}
                </div>

                {/* Description */}
                <p className="productdisplay-right-description">{product.description}</p>

                {/* Origin / allergens if set */}
                {product.origin && (
                    <p className="pd-meta-row"><span>Origin:</span> {product.origin}</p>
                )}
                {product.allergens && (
                    <p className="pd-meta-row pd-allergens"><span>⚠ Allergens:</span> {product.allergens}</p>
                )}

                {/* Quantity selector */}
                <div className="pd-qty-section">
                    <p className="pd-qty-label">
                        How many? <span className="pd-min-note">(minimum {MIN_QTY})</span>
                    </p>
                    <div className="pd-qty-controls">
                        <button
                            className="pd-qty-btn"
                            onClick={() => setQty(q => Math.max(MIN_QTY, q - 1))}
                            disabled={qty <= MIN_QTY}
                        >−</button>
                        <span className="pd-qty-value">{qty}</span>
                        <button
                            className="pd-qty-btn"
                            onClick={() => setQty(q => q + 1)}
                        >+</button>
                    </div>
                    <p className="pd-qty-total">
                        Subtotal: <strong>${(product.new_price * qty).toFixed(2)}</strong>
                    </p>
                </div>

                <button className="pd-add-btn" onClick={handleAddToCart}>
                    Add {qty} to Cart
                </button>

                <p className="pd-note">
                    🍪 Each cookie is $5. All cookies are baked to order and not too sweet — just right.
                </p>
            </div>
        </div>
    );
};

export default ProductDisplay;
