import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const subcategories = [
    'Single Origin', 'Seasonal', 'Bestsellers', 'New Arrivals',
    'Gift Boxes', 'Wedding & Events', 'Bulk Orders', 'Limited Edition',
    'Vegan Friendly', 'Nut Free', 'Gluten Conscious', 'Other'
];

const AddProduct = () => {
    const [image, setImage]               = useState(false);
    const [productDetails, setProductDetails] = useState({
        name:        '',
        description: '',
        image:       '',
        category:    'classic',
        subcategory: '',
        brand:       '',
        new_price:   '',
        old_price:   '',
        ingredients: '',
        origin:      '',
        allergens:   '',
    });

    const imageHandler  = (e) => setImage(e.target.files[0]);
    const changeHandler = (e) => setProductDetails({ ...productDetails, [e.target.name]: e.target.value });

    const Add_Product = async () => {
        let responseData;
        let product = { ...productDetails };

        const formData = new FormData();
        formData.append('product', image);

        await fetch('http://localhost:4000/upload', {
            method:  'POST',
            headers: { Accept: 'application/json' },
            body:    formData,
        }).then(r => r.json()).then(data => { responseData = data; });

        if (responseData.success) {
            product.image = responseData.image_url;
            await fetch('http://localhost:4000/addproduct', {
                method:  'POST',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body:    JSON.stringify(product),
            }).then(r => r.json()).then(data => {
                if (data.success) alert('Cookie added successfully!');
                else              alert('Failed to add cookie. Please try again.');
            });
        }
    };

    return (
        <div className='add-product'>
            <h1>Add a New Item</h1>

            <div className="addproduct-itemfield">
                <p>Cookie / Item Name</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='e.g. The Aztec, Peanut Butter Smash...' />
            </div>

            <div className="addproduct-itemfield">
                <p>Description</p>
                <input value={productDetails.description} onChange={changeHandler} type="text" name='description' placeholder='Short description shown on the product page' />
            </div>

            <div className="addproduct-itemfield">
                <p>Ingredients</p>
                <input value={productDetails.ingredients} onChange={changeHandler} type="text" name='ingredients' placeholder='e.g. Colombian dark chocolate, house-made vanilla extract...' />
            </div>

            <div className="addproduct-itemfield">
                <p>Origin / Story</p>
                <input value={productDetails.origin} onChange={changeHandler} type="text" name='origin' placeholder='e.g. Single-origin Bogota cocoa' />
            </div>

            <div className="addproduct-itemfield">
                <p>Allergens</p>
                <input value={productDetails.allergens} onChange={changeHandler} type="text" name='allergens' placeholder='e.g. Contains: gluten, dairy, tree nuts' />
            </div>

            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Original Price ($)</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="number" name="old_price" placeholder='e.g. 6' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Sale Price ($)</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="number" name="new_price" placeholder='e.g. 5' />
                </div>
            </div>

            <div className="addproduct-row">
                <div className="addproduct-itemfield">
                    <p>Category</p>
                    <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                        <option value="classic">Classic</option>
                        <option value="artisanal">Artisanal</option>
                        <option value="exotic">Exotic</option>
                        <option value="custom">Custom Orders</option>
                    </select>
                </div>
                <div className="addproduct-itemfield">
                    <p>Subcategory</p>
                    <select value={productDetails.subcategory} onChange={changeHandler} name="subcategory" className='add-product-selector add-product-selector-wide'>
                        <option value="">— None —</option>
                        {subcategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                    </select>
                </div>
            </div>

            <div className="addproduct-itemfield">
                <p>Product Image</p>
                <label htmlFor="file-input">
                    <img
                        src={image ? URL.createObjectURL(image) : upload_area}
                        className='addproduct-thumbnail_img'
                        alt="Upload"
                    />
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
            </div>

            <button onClick={Add_Product} className='addproduct-btn'>Add Item</button>
        </div>
    );
};

export default AddProduct;
