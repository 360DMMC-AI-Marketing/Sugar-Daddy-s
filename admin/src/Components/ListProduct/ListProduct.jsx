import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'

const subcategories = [
    '', 'Single Origin', 'Seasonal', 'Bestsellers', 'New Arrivals',
    'Gift Boxes', 'Wedding & Events', 'Bulk Orders', 'Limited Edition',
    'Vegan Friendly', 'Nut Free', 'Gluten Conscious', 'Other'
];

const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [saving,      setSaving]      = useState(false);

    const fetchInfo = async () => {
        await fetch('http://localhost:4000/allproducts')
            .then(res => res.json())
            .then(data => setAllProducts(data));
    };

    useEffect(() => { fetchInfo(); }, []);

    const remove_product = async (id) => {
        if (!window.confirm('Remove this item?')) return;
        await fetch('http://localhost:4000/removeproduct', {
            method:  'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body:    JSON.stringify({ id })
        });
        await fetchInfo();
    };

    const openEdit  = (product) => setEditProduct({ ...product });
    const handleEditChange = (e) => setEditProduct({ ...editProduct, [e.target.name]: e.target.value });

    const saveEdit = async () => {
        setSaving(true);
        await fetch('http://localhost:4000/editproduct', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(editProduct)
        });
        setSaving(false);
        setEditProduct(null);
        await fetchInfo();
    };

    return (
        <div className='list-product'>
            <h1>All Products</h1>

            {/* Desktop table */}
            <div className="lp-table-wrapper">
                <table className="lp-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Subcategory</th>
                            <th>Origin</th>
                            <th>Price</th>
                            <th>Sale</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allproducts.map((product, index) => (
                            <tr key={index}>
                                <td><img src={product.image} alt="" className="lp-img" /></td>
                                <td className="lp-name">{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.subcategory || '—'}</td>
                                <td>{product.origin || product.brand || '—'}</td>
                                <td>${product.old_price}</td>
                                <td className={product.old_price > product.new_price ? 'lp-promo' : ''}>
                                    ${product.new_price}
                                    {product.old_price > product.new_price && (
                                        <span className="lp-discount-badge">
                                            -{Math.round((1 - product.new_price / product.old_price) * 100)}%
                                        </span>
                                    )}
                                </td>
                                <td className="lp-actions">
                                    <button className="lp-edit-btn" onClick={() => openEdit(product)}>Edit</button>
                                    <img onClick={() => remove_product(product.id)} src={cross_icon} alt="Remove" className="lp-remove-icon" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="lp-mobile-cards">
                {allproducts.map((product, index) => (
                    <div key={index} className="lp-mobile-card">
                        <img src={product.image} alt="" className="lp-mobile-img" />
                        <div className="lp-mobile-info">
                            <p className="lp-mobile-name">{product.name}</p>
                            <p className="lp-mobile-cat">{product.category}{product.subcategory ? ` / ${product.subcategory}` : ''}</p>
                            <div className="lp-mobile-prices">
                                <span className="lp-mobile-price">${product.new_price}</span>
                                {product.old_price > product.new_price && (
                                    <span className="lp-mobile-old">${product.old_price}</span>
                                )}
                            </div>
                        </div>
                        <div className="lp-mobile-actions">
                            <button className="lp-edit-btn" onClick={() => openEdit(product)}>Edit</button>
                            <img onClick={() => remove_product(product.id)} src={cross_icon} alt="Remove" className="lp-remove-icon" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit modal */}
            {editProduct && (
                <div className="lp-modal-overlay" onClick={() => setEditProduct(null)}>
                    <div className="lp-modal" onClick={e => e.stopPropagation()}>
                        <h2>Edit Item</h2>

                        <div className="lp-modal-field">
                            <label>Name</label>
                            <input name="name" value={editProduct.name} onChange={handleEditChange} />
                        </div>
                        <div className="lp-modal-field">
                            <label>Description</label>
                            <input name="description" value={editProduct.description || ''} onChange={handleEditChange} />
                        </div>
                        <div className="lp-modal-field">
                            <label>Ingredients</label>
                            <input name="ingredients" value={editProduct.ingredients || ''} onChange={handleEditChange} />
                        </div>
                        <div className="lp-modal-field">
                            <label>Origin / Story</label>
                            <input name="origin" value={editProduct.origin || ''} onChange={handleEditChange} />
                        </div>
                        <div className="lp-modal-field">
                            <label>Allergens</label>
                            <input name="allergens" value={editProduct.allergens || ''} onChange={handleEditChange} />
                        </div>

                        <div className="lp-modal-row">
                            <div className="lp-modal-field">
                                <label>Original Price ($)</label>
                                <input name="old_price" type="number" value={editProduct.old_price} onChange={handleEditChange} />
                            </div>
                            <div className="lp-modal-field">
                                <label>Sale Price ($)</label>
                                <input name="new_price" type="number" value={editProduct.new_price} onChange={handleEditChange} />
                            </div>
                        </div>

                        <div className="lp-modal-row">
                            <div className="lp-modal-field">
                                <label>Category</label>
                                <select name="category" value={editProduct.category} onChange={handleEditChange}>
                                    <option value="classic">Classic</option>
                                    <option value="artisanal">Artisanal</option>
                                    <option value="exotic">Exotic</option>
                                    <option value="custom">Custom Orders</option>
                                </select>
                            </div>
                            <div className="lp-modal-field">
                                <label>Subcategory</label>
                                <select name="subcategory" value={editProduct.subcategory || ''} onChange={handleEditChange}>
                                    {subcategories.map(sc => (
                                        <option key={sc} value={sc}>{sc || '— None —'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="lp-modal-actions">
                            <button className="lp-modal-cancel" onClick={() => setEditProduct(null)}>Cancel</button>
                            <button className="lp-modal-save" onClick={saveEdit} disabled={saving}>
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListProduct;
