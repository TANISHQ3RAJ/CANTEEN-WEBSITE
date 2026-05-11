import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import TrackOrder from './pages/TrackOrder';
import Inventory from './pages/Inventory';
import Kitchen from './pages/Kitchen';
import Billing from './pages/Billing';
import Vendors from './pages/Vendors';
import Reports from './pages/Reports';
import Feedback from './pages/Feedback';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/track" element={<TrackOrder />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/kitchen" element={<Kitchen />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/feedback" element={<Feedback />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
