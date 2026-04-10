import React from 'react'
import "./DescriptionBox.css"

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">
                About this Cookie
            </div>
            <div className="descriptionbox-nav-box fade">
                Reviews (0)
            </div>
        </div>
        <div className="descriptionbox-description">
            <p>Each Sugar Daddy's cookie is handcrafted in small batches using globally-sourced, single-origin ingredients. Troy personally sources his chocolate from Colombia, and uses his own house-made vanilla extract for a depth of flavor you simply can't get elsewhere.</p>
            <p>Our philosophy? <em>"Not too sweet."</em> We believe the best cookies let the ingredients speak for themselves. Bold flavors, real ingredients, made with care — that's the Sugar Daddy's way.</p>
        </div>
    </div>
  )
}

export default DescriptionBox
