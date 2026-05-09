import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItemCard from '../components/MenuItemCard';
import { motion } from 'framer-motion';
import burgerImg from '../assets/menu/burger.png';
import pizzaImg from '../assets/menu/pizza.png';
import maggiImg from '../assets/menu/maggi.png';
import sandwichImg from '../assets/menu/sandwich.png';
import coldCoffeeImg from '../assets/menu/cold_coffee.png';
import lemonadeImg from '../assets/menu/lemonade.png';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data, error } = await supabase.from('menu_items').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          setItems(data);
        } else {
          throw new Error("Empty menu");
        }
      } catch (error) {
        console.error("Using mock menu data:", error);
        // Fallback mock data if backend isn't running or table is empty
        setItems([
          { _id: '1', name: 'Veg Burger', price: 50, category: 'Snacks', image: burgerImg },
          { _id: '2', name: 'Cheese Pizza', price: 120, category: 'Snacks', image: pizzaImg },
          { _id: '3', name: 'Maggi', price: 40, category: 'Snacks', image: maggiImg },
          { _id: '4', name: 'Sandwich', price: 60, category: 'Snacks', image: sandwichImg },
          { _id: '5', name: 'Paneer Tikka', price: 90, category: 'Snacks' },
          { _id: '6', name: 'French Fries', price: 70, category: 'Snacks' },
          { _id: '7', name: 'Spring Rolls', price: 80, category: 'Snacks' },
          { _id: '8', name: 'Coca-Cola', price: 30, category: 'Drinks' },
          { _id: '9', name: 'Pepsi', price: 30, category: 'Drinks' },
          { _id: '10', name: 'Cold Coffee', price: 70, category: 'Drinks', image: coldCoffeeImg },
          { _id: '11', name: 'Lemonade', price: 25, category: 'Drinks', image: lemonadeImg },
          { _id: '12', name: 'Iced Tea', price: 40, category: 'Drinks' },
          { _id: '13', name: 'Mango Lassi', price: 60, category: 'Drinks' },
          { _id: '14', name: 'Hot Coffee', price: 50, category: 'Drinks' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = filter === 'All' ? items : items.filter(item => item.category === filter);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto px-4 py-8 pb-24"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Our Menu</h1>
      
      {/* Filters */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {['All', 'Snacks', 'Drinks'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              filter === cat 
                ? 'bg-gray-900 text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map(item => (
          <MenuItemCard key={item._id || item.name} item={item} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Menu;
