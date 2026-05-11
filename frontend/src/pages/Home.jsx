import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, ArrowRight, Star, Clock, Users, Timer } from 'lucide-react';
import { supabase } from '../lib/supabase';
import burgerImg from '../assets/menu/burger.png';
import pizzaImg from '../assets/menu/pizza.png';
import maggiImg from '../assets/menu/maggi.png';
import sandwichImg from '../assets/menu/sandwich.png';
import coldCoffeeImg from '../assets/menu/cold_coffee.png';
import lemonadeImg from '../assets/menu/lemonade.png';

const categories = [
  { label: 'Pizza',     img: pizzaImg },
  { label: 'Burgers',   img: burgerImg },
  { label: 'Maggi',     img: maggiImg },
  { label: 'Sandwich',  img: sandwichImg },
  { label: 'Coffee',    img: coldCoffeeImg },
  { label: 'Drinks',    img: lemonadeImg },
];

const Home = () => {
  return (
    <div style={{ background: '#F7F2EB', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        height: 'clamp(350px, 42vw, 540px)',
        overflow: 'hidden',
        background: '#F7F2EB'
      }}>

        {/* FRESH — top-left */}
        <motion.h1
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            top: 0, left: '2vw',
            fontSize: 'clamp(72px, 16vw, 210px)',
            fontWeight: 900, lineHeight: 0.88,
            color: '#E84025', margin: 0, letterSpacing: '-3px',
            zIndex: 2, pointerEvents: 'none'
          }}
        >
          FRESH
        </motion.h1>

        {/* & — centered horizontally, above TASTY */}
        <motion.h1
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            position: 'absolute',
            bottom: 'clamp(52px, 12vw, 160px)',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 'clamp(58px, 13vw, 175px)',
            fontWeight: 900, lineHeight: 0.88,
            color: '#E84025', margin: 0, letterSpacing: '-3px',
            zIndex: 10, pointerEvents: 'none',
          }}
        >
          &amp;
        </motion.h1>

        {/* TASTY — bottom-right */}
        <motion.h1
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{
            position: 'absolute',
            bottom: 0, right: '2vw',
            fontSize: 'clamp(58px, 13vw, 175px)',
            fontWeight: 900, lineHeight: 0.88,
            color: '#E84025', margin: 0, letterSpacing: '-3px',
            zIndex: 10, pointerEvents: 'none',
          }}
        >
          TASTY
        </motion.h1>

        {/* Food image — top-right */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
          style={{
            position: 'absolute',
            top: '-5%', right: '4vw',
            width: 'clamp(200px, 28vw, 380px)',
            height: 'clamp(200px, 28vw, 380px)',
            borderRadius: '50%',
            overflow: 'hidden',
            zIndex: 5,
            boxShadow: '0 20px 50px rgba(0,0,0,0.16)'
          }}
        >
          <img
            src={pizzaImg}
            alt="Featured Food"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </motion.div>

        {/* Small tagline — left side, vertically centered */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            position: 'absolute',
            bottom: '18%', left: '2vw',
            maxWidth: 180, fontSize: 12, lineHeight: 1.7,
            color: '#888', zIndex: 3
          }}
        >
          Fresh, hot &amp; made with love — every single day on campus.
        </motion.p>
      </section>

      {/* ── CRAVING BAR ──────────────────────────────────── */}
      <section style={{ padding: '36px 5vw', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <Truck size={26} color="#E84025" />
        </div>
        <p style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
          What are you craving today?
        </p>
        <Link
          to="/menu"
          style={{
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#E84025', color: '#fff',
            padding: '12px 24px', borderRadius: 50,
            fontWeight: 700, fontSize: 15, textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(232,64,37,0.3)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Order Now <ArrowRight size={18} />
        </Link>
      </section>

      {/* ── CATEGORY GRID ────────────────────────────────── */}
      <section style={{ padding: '0 5vw 80px' }}>

        {/* Section header */}
        <div style={{ display: 'flex', gap: '5vw', alignItems: 'flex-start', marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#999', textTransform: 'uppercase', margin: '0 0 6px' }}>
              WE'VE GOT IT ALL!
            </p>
            <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
              Our Menu
            </h2>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#666', maxWidth: 420, marginTop: 4 }}>
            From piping hot snacks to refreshing cold drinks — our canteen has everything you need to fuel your day on campus.
          </p>
        </div>

        {/* Grid of categories */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 16
        }}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
              whileHover={{ y: -6 }}
            >
              <Link to="/menu" style={{ textDecoration: 'none' }}>
                <div style={{
                  borderRadius: 16, overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
                  cursor: 'pointer', background: '#fff'
                }}>
                  <img
                    src={cat.img}
                    alt={cat.label}
                    style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <p style={{
                  marginTop: 10, fontSize: 15, fontWeight: 600,
                  color: '#1a1a1a', paddingLeft: 2
                }}>
                  {cat.label}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WHY JIET CANTEEN ─────────────────────────────── */}
      <section style={{ background: '#fff', padding: '60px 5vw', margin: '0 0 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          {[
            { icon: '🍽️', title: 'Fresh Daily', desc: 'Everything is cooked fresh each morning.' },
            { icon: '⚡', title: 'Quick Service', desc: 'Order online, skip the queue entirely.' },
            { icon: '💸', title: 'Pocket Friendly', desc: 'Student-friendly pricing on all items.' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              style={{ textAlign: 'center', padding: '16px 8px' }}
            >
              <div style={{ fontSize: 42, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#777', lineHeight: 1.7 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LIVE QUEUE SECTION ──────────────────────────── */}
      <section style={{ padding: '0 5vw 100px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
          borderRadius: 32,
          padding: '40px',
          color: '#fff',
          display: 'flex',
          gap: 40,
          boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          position: 'relative'
        }} className="flex-col md:flex-row">
          
          {/* Background Decorative element */}
          <div style={{
            position: 'absolute', top: '-10%', right: '-5%', width: 200, height: 200,
            background: 'rgba(232, 64, 37, 0.1)', borderRadius: '50%', filter: 'blur(60px)'
          }}></div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 8, background: 'rgba(232, 64, 37, 0.2)', borderRadius: 12 }}>
                <Timer color="#E84025" size={24} />
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Live Order Queue</h2>
            </div>
            <p style={{ color: '#aaa', fontSize: 15, lineHeight: 1.6, maxWidth: 400, marginBottom: 32 }}>
              Check current campus demand and see how long it might take for your fresh meal to arrive.
            </p>

            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#666', letterSpacing: 1.5, marginBottom: 12, textTransform: 'uppercase' }}>
                  Wait Time
                </p>
                <QueueWaitTime />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#666', letterSpacing: 1.5, marginBottom: 12, textTransform: 'uppercase' }}>
                  Orders Ahead
                </p>
                <QueueOrderCount />
              </div>
            </div>
          </div>

          <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
             <p style={{ fontSize: 11, fontWeight: 700, color: '#666', letterSpacing: 1.5, marginBottom: 20, textTransform: 'uppercase' }}>
                Active Orders in Kitchen
              </p>
              <LiveQueueList />
          </div>
        </div>
      </section>

    </div>
  );
};

const QueueWaitTime = () => {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const fetchTime = async () => {
      try {
        const { data } = await supabase.from('orders').select('status').neq('status', 'Completed');
        const count = data?.length || JSON.parse(localStorage.getItem('canteen_orders') || '[]').filter(o => o.status !== 'Completed').length;
        setTime(count * 5); // 5 mins per order
      } catch { setTime(0); }
    };
    fetchTime();
    const inv = setInterval(fetchTime, 30000);
    return () => clearInterval(inv);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 36, fontWeight: 900, color: '#E84025' }}>~{time}</span>
      <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>mins</span>
    </div>
  );
};

const QueueOrderCount = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data } = await supabase.from('orders').select('status').neq('status', 'Completed');
        const c = data?.length || JSON.parse(localStorage.getItem('canteen_orders') || '[]').filter(o => o.status !== 'Completed').length;
        setCount(c);
      } catch { setCount(0); }
    };
    fetchCount();
    const inv = setInterval(fetchCount, 30000);
    return () => clearInterval(inv);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>{count}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#666' }}>active</span>
    </div>
  );
};

const LiveQueueList = () => {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const { data } = await supabase
          .from('orders')
          .select('order_id, status')
          .neq('status', 'Completed')
          .order('created_at', { ascending: true })
          .limit(5);
        
        if (data && data.length > 0) {
          setQueue(data);
        } else {
          const local = JSON.parse(localStorage.getItem('canteen_orders') || '[]')
            .filter(o => o.status !== 'Completed')
            .slice(0, 5);
          setQueue(local);
        }
      } catch { setQueue([]); }
    };
    fetchQueue();
    const inv = setInterval(fetchQueue, 30000);
    return () => clearInterval(inv);
  }, []);

  if (queue.length === 0) return <p style={{ color: '#444', fontSize: 14 }}>Kitchen is currently empty.</p>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {queue.map((item, i) => (
        <motion.div
          key={item.order_id || item.orderId}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          style={{
            background: item.status === 'Ready' ? '#E84025' : 'rgba(255,255,255,0.05)',
            padding: '8px 14px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 800,
            fontFamily: 'monospace',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff'
          }}
        >
          {item.order_id || item.orderId}
          <span style={{ display: 'block', fontSize: 9, fontWeight: 600, opacity: 0.6, marginTop: 2, textTransform: 'uppercase' }}>
            {item.status}
          </span>
        </motion.div>
      ))}
      {queue.length >= 5 && <div style={{ fontSize: 12, color: '#444', padding: '8px' }}>+ more</div>}
    </div>
  );
};

export default Home;
