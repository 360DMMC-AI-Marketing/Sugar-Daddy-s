import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AllProducts from './Pages/AllProducts';
import Accueil from './Pages/Accueil';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import PlaceOrder from './Pages/PlaceOrder';
import Profile from './Pages/Profile';
import Terms from './Pages/Terms';
import Privacy from './Pages/Privacy';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"         element={<Accueil />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart"     element={<Cart />} />
          <Route path="/order"    element={<PlaceOrder />} />
          <Route path="/profile"  element={<Profile />} />
          <Route path="/terms"    element={<Terms />} />
          <Route path="/privacy"  element={<Privacy />} />
          <Route path="/login"    element={<LoginSignup />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
