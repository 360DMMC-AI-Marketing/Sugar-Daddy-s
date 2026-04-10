import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'

const Item = (props) => {
  const hasDiscount = props.old_price && props.old_price > props.new_price;
  const discountPct = hasDiscount ? Math.round((1 - props.new_price / props.old_price) * 100) : 0;

  return (
    <div className='item'>
      <div className="item-img-wrapper">
        <Link to={`/product/${props.id}`}>
          <img onClick={() => window.scrollTo(0, 0)} src={props.image} alt={props.name} />
        </Link>
        {hasDiscount && <span className="item-discount-badge">-{discountPct}%</span>}
      </div>
      <p className="item-name">{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">${props.new_price}</div>
        {hasDiscount && <div className="item-price-old">${props.old_price}</div>}
      </div>
    </div>
  )
}

export default Item
