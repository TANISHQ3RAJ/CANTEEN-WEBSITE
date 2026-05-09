import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL') {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase credentials are not set. Supabase will not work. Please update .env');
  // Mock client if credentials are not available
  const mockBuilder = {
    select: () => {
      // Only fetch from localStorage if we don't already have data (like from an insert)
      if (mockBuilder._table === 'orders' && !mockBuilder._lastData) {
        const localData = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
        // Map back to snake_case for the mock to simulate Supabase
        mockBuilder._lastData = localData.map(o => ({
          id: o._id || o.id,
          order_id: o.orderId,
          status: o.status,
          total_amount: o.totalAmount,
          items: o.items,
          created_at: o.createdAt,
          upi_ref: o.upiRef
        }));
      }
      return mockBuilder;
    },
    order: () => mockBuilder,
    eq: () => mockBuilder,
    insert: (data) => {
      mockBuilder._lastData = data;
      // Persist to localStorage if it's an order
      if (mockBuilder._table === 'orders') {
        const localData = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
        const newOrders = Array.isArray(data) ? data : [data];
        localStorage.setItem('canteen_orders', JSON.stringify([...localData, ...newOrders]));
      }
      return mockBuilder;
    },
    update: (updateData) => {
      // For simplicity, just return the update for mock
      mockBuilder._lastData = updateData;
      return mockBuilder;
    },
    single: () => {
      mockBuilder._isSingle = true;
      return mockBuilder;
    },
    then: (resolve) => {
      let responseData = mockBuilder._lastData || [];
      
      // If .single() was called, return the first item as an object
      if (mockBuilder._isSingle && Array.isArray(responseData)) {
        responseData = responseData[0] || { id: 'mock-id', order_id: 'ORD-MOCK' };
      }
      
      // Reset for next call
      mockBuilder._isSingle = false;
      
      resolve({ 
        data: responseData, 
        error: null 
      });
    },
    catch: (reject) => reject(new Error('Supabase not configured'))
  };

  supabase = {
    from: (table) => {
      mockBuilder._table = table;
      mockBuilder._isSingle = false; // Reset
      return mockBuilder;
    },
    channel: () => ({
      on: () => ({ subscribe: () => ({}) })
    }),
    removeChannel: () => {}
  };
}

export { supabase };
