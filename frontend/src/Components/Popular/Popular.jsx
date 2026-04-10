import React, { useEffect, useState } from 'react'
import './Popular.css'
import Item from '../Item/Item'

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/popularinchat`)
      .then((response) => response.json())
      .then((data) => setPopularProducts(data));
  }, []);

  return (
    <div className='popular'>
        <div className="popular-header">
            <span className="section-label">Fan Favorites</span>
            <h1>Our Bestsellers</h1>
            <p>The cookies our customers can't stop ordering</p>
        </div>
        <div className="popular-item">
            {popularProducts.map((item, i) => (
                <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
            ))}
        </div>
    </div>
  );
};

export default Popular;
