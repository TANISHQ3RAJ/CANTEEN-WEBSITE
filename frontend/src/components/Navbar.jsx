import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, Home, UserCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cart } = useCart();
  const location = useLocation();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                JC
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">JIET Canteen</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link to="/" className={`flex items-center gap-1 ${location.pathname === '/' ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}>
              <Home size={20} /> <span className="hidden sm:inline font-medium">Home</span>
            </Link>
            <Link to="/menu" className={`flex items-center gap-1 ${location.pathname === '/menu' ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}>
              <MenuIcon size={20} /> <span className="hidden sm:inline font-medium">Menu</span>
            </Link>
            <Link to="/track" className={`flex items-center gap-1 ${location.pathname === '/track' ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}>
              <span className="hidden sm:inline font-medium">Track Order</span>
            </Link>
            <Link to="/admin" className={`flex items-center gap-1 ${location.pathname === '/admin' ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}>
              <UserCircle size={20} /> <span className="hidden sm:inline font-medium">Admin</span>
            </Link>
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ShoppingCart size={24} className={location.pathname === '/cart' ? 'text-primary' : 'text-gray-700'} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
