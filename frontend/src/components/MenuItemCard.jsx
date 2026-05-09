import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();

  // Generate a placeholder color based on item name to make UI vibrant
  const colors = ['bg-rose-100', 'bg-blue-100', 'bg-emerald-100', 'bg-amber-100', 'bg-purple-100'];
  const textColors = ['text-rose-600', 'text-blue-600', 'text-emerald-600', 'text-amber-600', 'text-purple-600'];
  const hash = item.name.length;
  const colorIndex = hash % colors.length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 flex gap-4 items-center"
    >
      <div className={`w-24 h-24 rounded-xl flex items-center justify-center overflow-hidden font-bold text-2xl ${colors[colorIndex]} ${textColors[colorIndex]}`}>
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          item.name.charAt(0)
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
            <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-md mt-1">
              {item.category}
            </span>
          </div>
          <p className="font-bold text-lg text-gray-900">₹{item.price}</p>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => addToCart(item)}
            className="flex items-center gap-1 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-medium px-4 py-1.5 rounded-full transition-colors text-sm"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
