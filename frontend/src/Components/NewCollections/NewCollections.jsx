import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import Item from '../Item/Item'

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

const NewCollections = () => {
  const [new_collection, setNew_Collection] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/newcollections`)
      .then((response) => response.json())
      .then((data) => setNew_Collection(data));
  }, []);

  return (
    <div className='new-collections'>
        <div className="nc-header">
            <span className="section-label">Fresh from the Oven</span>
            <h1>New Arrivals</h1>
            <p>Troy's latest creations — exploring new flavor frontiers</p>
        </div>
        <div className="collections">
            {new_collection.map((item, i) => (
                <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
            ))}
        </div>
    </div>
  );
};

export default NewCollections;
