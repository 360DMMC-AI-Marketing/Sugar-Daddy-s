import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';


const Product = () => {
  const {all_product}=useContext(ShopContext);
  const {productId}= useParams();
  const product = all_product.find((e)=> e.id === Number(productId));

  if (!product) {
    return <div style={{textAlign:'center',padding:'100px 20px',color:'#999'}}>
      <h2>Produit non trouvé</h2>
      <p>Ce produit n'existe pas ou est en cours de chargement.</p>
    </div>;
  }

  return (
    <div>
      <Breadcrum product={product}/>
      <ProductDisplay product={product} />
      <RelatedProducts category={product.category} />
    </div>
  )
}

export default Product