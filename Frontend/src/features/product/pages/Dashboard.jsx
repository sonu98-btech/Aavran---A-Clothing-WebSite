import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/use.product';
import { useNavigate } from 'react-router';
import { useTheme } from '../../../app/ThemeContext';
import AccountDropDown from '../../shared/components/AccountDropDown.jsx';

/* ─── Global Styles (matching Login/Register) ──────────────────────────────── */
const GlobalStyles = ({ dark }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes borderGlow {
      0%, 100% { opacity: 0.5; }
      50%       { opacity: 1; }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .shimmer-text {
      background: linear-gradient(90deg, #c9a227 0%, #f5e6c8 40%, #ecc246 60%, #c9a227 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    /* Dark glass card */
    .glass-card-dark {
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .glass-card-dark:hover {
      border-color: rgba(201,162,39,0.35);
    }

    /* Light card */
    .glass-card-light {
      background: rgba(255,255,255,0.82);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(201,162,39,0.18);
      box-shadow: 0 4px 24px rgba(0,0,0,0.07);
    }
    .glass-card-light:hover {
      border-color: rgba(201,162,39,0.5);
      box-shadow: 0 8px 32px rgba(201,162,39,0.12);
    }

    /* Sidebar nav items */
    .nav-item-dark {
      color: rgba(255,255,255,0.45);
      transition: all 0.2s ease;
    }
    .nav-item-dark:hover {
      color: rgba(255,255,255,0.9);
      background: rgba(201,162,39,0.08);
    }
    .nav-item-dark.active {
      color: #c9a227;
      background: rgba(201,162,39,0.12);
    }

    .nav-item-light {
      color: rgba(10,10,15,0.45);
      transition: all 0.2s ease;
    }
    .nav-item-light:hover {
      color: #0a0a0f;
      background: rgba(201,162,39,0.08);
    }
    .nav-item-light.active {
      color: #9a7010;
      background: rgba(201,162,39,0.14);
    }

    /* Product card image zoom */
    .prod-img {
      transition: transform 1200ms cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.4s ease !important;
    }
    .glass-card-dark:hover .prod-img,
    .glass-card-light:hover .prod-img {
      transform: scale(1.05) !important;
    }

    /* Gold primary button */
    .gold-btn {
      background: linear-gradient(135deg, #c9a227 0%, #ecc246 50%, #c9a227 100%);
      background-size: 200% auto;
      transition: all 0.3s ease;
      color: #0a0a0f;
    }
    .gold-btn:hover {
      background-position: right center;
      box-shadow: 0 8px 30px rgba(201,162,39,0.4), 0 2px 8px rgba(0,0,0,0.25);
      transform: translateY(-1px);
    }
    .gold-btn:active { transform: translateY(0); }

    /* Ghost button */
    .ghost-btn-dark {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.7);
      transition: all 0.25s ease;
    }
    .ghost-btn-dark:hover {
      border-color: rgba(201,162,39,0.55);
      background: rgba(201,162,39,0.08);
      color: #c9a227;
    }
    .ghost-btn-light {
      background: transparent;
      border: 1px solid rgba(201,162,39,0.3);
      color: rgba(10,10,15,0.6);
      transition: all 0.25s ease;
    }
    .ghost-btn-light:hover {
      border-color: #c9a227;
      background: rgba(201,162,39,0.07);
      color: #9a7010;
    }

    /* Label text */
    .label-text {
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(201,162,39,0.8);
    }

    .decorative-line {
      background: linear-gradient(90deg, transparent, rgba(201,162,39,0.6), transparent);
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(201,162,39,0.3); border-radius: 4px; }
  `}</style>
);

/* ─── Inline SVG / Icons ─── */
const ICONS = {
  dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  inventory: 'M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 19H5v-4h4v4zm0-6H5V7h4v6zm10 6h-8v-4h8v4zm0-6h-8V7h8v6z',
  orders: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z',
  analytics: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
  settings: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
  add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  bell: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
  sun: 'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.38.39-1.02 0-1.41zm-12.37 12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.38.39-1.02 0-1.41z',
  moon: 'M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.39 5.39 0 0 1-4.4 2.26 5.4 5.4 0 0 1-5.4-5.4 5.41 5.41 0 0 1 2.26-4.4c-.44-.06-.9-.1-1.36-.1z',
  calendar: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v2h-5zm0 3h5v2h-5z',
  edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  trash: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  package: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  person: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  trending: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z',
  payments: 'M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'
};

const DiamondIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 8l9 15 9-15L12 1zm0 2.5L19.2 8.3 12 20.8 4.8 8.3 12 3.5z" />
    <path d="M3 8h18" stroke="currentColor" strokeWidth="0.5" fill="none" />
  </svg>
);

const Icon = ({ d, size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d={d} fill={color} />
  </svg>
);

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const calcRevenue = (prods) => {
  return prods.reduce((sum, p) => sum + (Number(p.price?.amount) || 0), 0).toLocaleString('en-IN');
};

/* ─── Stat Card ─────────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, iconKey, delay, dark }) => {
  return (
    <div
      className={`cp-fade-up ${dark ? 'glass-card-dark' : 'glass-card-light'}`}
      style={{
        borderRadius: '16px', padding: '22px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        animationDelay: `${delay}s`, transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span className="label-text">{label}</span>
        <span style={{
          fontFamily: 'Inter, sans-serif', fontSize: '28px', fontWeight: '800',
          color: dark ? '#fff' : '#0a0a0f', letterSpacing: '-0.02em',
        }}>{value}</span>
      </div>
      <div style={{
        width: '42px', height: '42px', borderRadius: '10px',
        background: dark ? 'rgba(201,162,39,0.08)' : 'rgba(201,162,39,0.06)',
        border: '1px solid rgba(201,162,39,0.22)',
        display: 'flex', alignItems: 'center', justifyCenter: 'center',
        color: '#c9a227', justifyContent: 'center',
      }}>
        <Icon d={ICONS[iconKey]} size={20} color="currentColor" />
      </div>
    </div>
  );
};

/* ─── Product Card ──────────────────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [imgIndex, setImgIndex] = useState(0);
  const allImageUrls = (product.images || []).flatMap(img =>
    (img.url || '').split(' ~ ').map(u => u.trim()).filter(Boolean)
  );
  const images = allImageUrls;
  const price = product.price?.amount ?? 0;

  return (
    <article
      className="group flex flex-col cursor-pointer relative"
      onClick={() => navigate(`/seller/product/${product._id}`)}
      onMouseEnter={() => images.length > 1 && setImgIndex(1)}
      onMouseLeave={() => setImgIndex(0)}
    >
      {/* ── Image box ── */}
      <div className="relative overflow-hidden bg-[#ece8e0] dark:bg-[#14141e] aspect-[3/4]">
        {images.length > 0 ? (
          <>
            {/* primary */}
            <img
              src={images[0]}
              alt={product.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgIndex === 0 ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* secondary (hover) */}
            {images[1] && (
              <img
                src={images[1]}
                alt={product.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgIndex === 1 ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-[#1c1408]/20 dark:text-white/20 text-xs tracking-widest uppercase">
            No Image
          </div>
        )}

        {/* Card Management UI: Edit & Delete buttons */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {/* Edit button */}
          <button
            aria-label="Edit product"
            onClick={(e) => { e.stopPropagation(); }}
            className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm shadow transition-all hover:scale-110 bg-white/80 dark:bg-black/50 text-[#1c1408] dark:text-white hover:text-[#8b6914] dark:hover:text-[#c9a227]"
          >
            <Icon d={ICONS.edit} size={14} color="currentColor" />
          </button>

          {/* Delete button */}
          <button
            aria-label="Delete product"
            onClick={(e) => { e.stopPropagation(); }}
            className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm shadow transition-all hover:scale-110 bg-white/80 dark:bg-black/50 text-[#1c1408] dark:text-white hover:text-red-600 dark:hover:text-red-400"
          >
            <Icon d={ICONS.trash} size={14} color="currentColor" />
          </button>
        </div>
      </div>

      {/* ── Info below image ── */}
      <div className="mt-3 space-y-2">
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8b6914]/80 dark:text-[#c9a227]/70">
            {product.title.split(' ')[0]}
          </p>
          <h3 className="text-sm text-[#1c1408] dark:text-white/90 font-normal leading-snug line-clamp-2 h-10 group-hover:text-[#8b6914] dark:group-hover:text-[#c9a227] transition-colors duration-300">
            {product.title}
          </h3>
          <p className="text-sm font-semibold text-[#8b6914] dark:text-[#c9a227] pt-0.5">
            ₹{price.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Add Variant Button */}
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/seller/product/${product._id}?addVariant=true`); }}
          className="w-full py-1.5 border border-[#8b6914]/30 hover:border-[#8b6914] dark:border-[#c9a227]/30 dark:hover:border-[#c9a227] text-[10px] font-bold uppercase tracking-widest text-[#8b6914] dark:text-[#c9a227] hover:bg-[#8b6914]/5 dark:hover:bg-[#c9a227]/5 transition-all rounded"
        >
          + Add Variant
        </button>
      </div>
    </article>
  );
};

/* ─── Dashboard ──────────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  useEffect(() => { handleGetSellerProducts(); }, []);

  const productList = Array.isArray(sellerProducts) ? sellerProducts : [];
  const revenue = calcRevenue(productList);
  const thisMonth = productList.filter((p) => {
    const d = new Date(p.createdAt), now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  /* ── Theme tokens ─────────────────────────────────────────── */
  const bg = dark ? '#0a0a0f' : '#f8f5ee';
  const sidebarBg = dark ? '#0e0e16' : '#f5f0e4';
  const sidebarBdr = dark ? 'rgba(255,255,255,0.07)' : 'rgba(201,162,39,0.18)';
  const headerBg = dark ? '#0e0e16' : '#f5f0e4';
  const headerBdr = dark ? 'rgba(255,255,255,0.08)' : 'rgba(201,162,39,0.22)';
  const textPrimary = dark ? '#fff' : '#0a0a0f';
  const textMuted = dark ? 'rgba(255,255,255,0.35)' : 'rgba(10,10,15,0.45)';
  const iconBase = dark ? 'rgba(255,255,255,0.22)' : 'rgba(10,10,15,0.22)';
  const emptyBg = dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)';
  const emptyBdr = dark ? 'rgba(255,255,255,0.08)' : 'rgba(201,162,39,0.2)';

  const navClass = dark ? 'nav-item-dark' : 'nav-item-light';

  return (
    <>
      <GlobalStyles dark={dark} />

      <div style={{ minHeight: '100vh', background: bg, display: 'flex', fontFamily: 'Inter, sans-serif', transition: 'background 0.4s ease', position: 'relative' }}>

        {/* ── Background texture (matches login) ────────────────── */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {dark && (
            <>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(201,162,39,0.04) 0%, transparent 70%)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 80% 70%, rgba(201,162,39,0.03) 0%, transparent 70%)' }} />
            </>
          )}
          {!dark && (
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 30% 30%, rgba(201,162,39,0.06) 0%, transparent 70%)' }} />
          )}
        </div>

        {/* ── Corner decorative lines (same as login) ──────────── */}
        <div style={{ position: 'fixed', top: 28, left: 28, width: 56, height: 56, pointerEvents: 'none', zIndex: 5 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, rgba(201,162,39,0.55), transparent)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '1px', background: 'linear-gradient(180deg, rgba(201,162,39,0.55), transparent)' }} />
        </div>
        <div style={{ position: 'fixed', bottom: 28, right: 28, width: 56, height: 56, pointerEvents: 'none', zIndex: 5 }}>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: '1px', background: 'linear-gradient(270deg, rgba(201,162,39,0.55), transparent)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, height: '100%', width: '1px', background: 'linear-gradient(0deg, rgba(201,162,39,0.55), transparent)' }} />
        </div>

        {/* ── Sidebar (Collapsible Mobile Drawer / Sticky Desktop Panel) ── */}
        {/* Overlay backdrop for mobile when open */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          />
        )}

        <aside
          className={`
            fixed inset-y-0 left-0 lg:sticky lg:top-0 z-40 lg:z-20
            w-[252px] h-screen flex flex-col flex-shrink-0
            backdrop-blur-2xl lg:backdrop-blur-none
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          style={{
            background: sidebarBg,
            borderRight: `1px solid ${sidebarBdr}`,
          }}
        >
          {/* Brand */}
          <div style={{ padding: '24px 20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', paddingTop: '4px' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '6px', flexShrink: 0,
                background: 'linear-gradient(135deg, #c9a227, #ecc246)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0a0a0f',
              }}>
                <DiamondIcon size={14} />
              </div>
              <div className="flex-1">
                <span className="hm-shimmer" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '14px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  AAVRAN
                </span>
                <p style={{ margin: 0, fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: textPrimary, lineHeight: '1.4' }}>
                  Seller Portal
                </p>
              </div>
              {/* Close sidebar button on mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 text-amber-500 hover:bg-white/5 rounded"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="decorative-line" style={{ height: '1px', marginBottom: '20px' }} />

            {/* Nav */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { key: 'dashboard', label: 'Dashboard', active: true },
                { key: 'inventory', label: 'Inventory', active: false },
                { key: 'orders', label: 'Orders', active: false },
                { key: 'analytics', label: 'Analytics', active: false },
                { key: 'settings', label: 'Settings', active: false },
              ].map(({ key, label, active }) => (
                <button key={key}
                  className={`${navClass}${active ? ' active' : ''}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '8px', border: 'none',
                    fontFamily: 'Inter, sans-serif', fontSize: '13.5px',
                    fontWeight: active ? 600 : 400, cursor: 'pointer', width: '100%',
                    textAlign: 'left', background: 'transparent',
                  }}
                >
                  <Icon d={ICONS[key]} size={16} color="currentColor" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 'auto', padding: '20px', borderTop: `1px solid ${sidebarBdr}` }}>
            <button
              className="gold-btn"
              onClick={() => { setSidebarOpen(false); navigate('/seller/create-product'); }}
              style={{
                width: '100%', padding: '11px 0', borderRadius: '10px', border: 'none',
                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 800,
                letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              }}
            >
              <Icon d={ICONS.add} size={14} color="#0a0a0f" />
              Add Product
            </button>
          </div>
        </aside>

        {/* ── Main Panel ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowX: 'hidden' }}>

          {/* Header */}
          <header
            className="sticky top-0 z-30 flex items-center justify-between transition-colors duration-300 px-4 sm:px-9"
            style={{
              background: headerBg,
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              borderBottom: `1px solid ${headerBdr}`,
              height: '62px',
            }}
          >
            {/* Title / Hamburger Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-amber-500 hover:bg-white/5 rounded flex-shrink-0"
                aria-label="Open Sidebar Menu"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="decorative-line hidden sm:block" style={{ width: '20px', height: '1px' }} />
              <span
                className="text-xs sm:text-sm"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,162,39,0.75)' }}
              >
                Seller Dashboard
              </span>
            </div>

            {/* Right controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* SS Tag */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full"
                style={{ border: "1px solid rgba(201,162,39,0.22)", background: "rgba(201,162,39,0.07)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-amber-400/80 text-[9px] font-bold tracking-[0.16em] uppercase whitespace-nowrap">SS 2025</span>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                title={dark ? 'Light Mode' : 'Dark Mode'}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${iconBase}`,
                  background: 'transparent', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: dark ? 'rgba(255,255,255,0.65)' : '#5a4520',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c9a227'; e.currentTarget.style.color = '#c9a227'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = iconBase; e.currentTarget.style.color = dark ? 'rgba(255,255,255,0.65)' : '#5a4520'; }}
              >
                <Icon d={dark ? ICONS.sun : ICONS.moon} size={15} color="currentColor" />
              </button>

              {/* Bell */}
              <button
                style={{
                  width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${iconBase}`,
                  background: 'transparent', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: dark ? 'rgba(255,255,255,0.65)' : '#5a4520',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c9a227'; e.currentTarget.style.color = '#c9a227'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = iconBase; e.currentTarget.style.color = dark ? 'rgba(255,255,255,0.65)' : '#5a4520'; }}
              >
                <Icon d={ICONS.bell} size={15} color="currentColor" />
              </button>

              {/* Avatar */}
              <div className="relative">
                <div
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #c9a227, #ecc246)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginLeft: '4px', cursor: 'pointer',
                  }}
                >
                  <Icon d={ICONS.person} size={16} color="#0a0a0f" />
                </div>
                {showAccountDropdown && (
                  <AccountDropDown user={user} onClose={() => setShowAccountDropdown(false)} />
                )}
              </div>
            </div>
          </header>

          {/* ── Content ── */}
          <main className="flex-1 p-4 sm:p-9 overflow-y-auto">

            {/* Page heading */}
            <div style={{ marginBottom: '32px' }}>
              <p className="label-text" style={{ marginBottom: '8px' }}>Overview</p>
              <h1
                className="text-3xl sm:text-4xl"
                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 300, color: textPrimary, margin: 0, lineHeight: 1.1 }}
              >
                My <span className="hm-shimmer" style={{ fontWeight: 700, fontStyle: 'italic' }}>Products</span>
              </h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-9">
              {[
                { label: 'Total Products', value: productList.length, iconKey: 'inventory', delay: 0 },
                { label: 'Total Revenue', value: `₹${revenue}`, iconKey: 'payments', delay: 0.05 },
                { label: 'Added This Month', value: `${thisMonth} New`, iconKey: 'trending', delay: 0.1 },
              ].map((s) => (
                <div key={s.label} className="w-full">
                  <StatCard {...s} dark={dark} />
                </div>
              ))}
            </div>

            {/* Section header */}
            <div
              className="sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 mb-6 mx-[-16px] px-4 sm:mx-[-36px] sm:px-9 border-b border-[#8b6914]/12 dark:border-white/8 transition-all duration-300"
              style={{ backgroundColor: bg }}
            >
              <div className="flex items-center gap-3">
                <div className="decorative-line" style={{ width: '20px', height: '1px' }} />
                <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,162,39,0.75)', margin: 0 }}>
                  Catalogue
                </h2>
                <span style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.08em', padding: '2px 10px', borderRadius: '999px',
                  background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.25)',
                  color: '#c9a227',
                }}>
                  {productList.length} items
                </span>
              </div>
              <button
                className="gold-btn w-full sm:w-auto"
                onClick={() => navigate('/seller/create-product')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                  padding: '9px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontSize: '10.5px', fontWeight: 800,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                }}
              >
                <Icon d={ICONS.add} size={13} color="#0a0a0f" />
                New Product
              </button>
            </div>

            {/* Product Grid / Empty */}
            {productList.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '80px 20px', borderRadius: '16px',
                background: emptyBg, border: `1px dashed ${emptyBdr}`,
                backdropFilter: 'blur(12px)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <Icon d={ICONS.package} size={52} color="rgba(201,162,39,0.28)" />
                </div>
                <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '26px', fontWeight: 400, color: textPrimary, margin: '0 0 8px' }}>
                  No Products Yet
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12.5px', color: textMuted, margin: '0 0 28px', lineHeight: 1.6 }}>
                  Start building your catalogue. Add your first product to get started.
                </p>
                <button
                  className="gold-btn"
                  onClick={() => navigate('/seller/create-product')}
                  style={{
                    padding: '11px 28px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', fontSize: '10.5px', fontWeight: 800,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                  }}
                >
                  <Icon d={ICONS.add} size={13} color="#0a0a0f" />
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-9">
                {productList.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Bottom copyright */}
            <div style={{ marginTop: '60px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: textMuted }}>
                © 2025 Aavran Fashion · All rights reserved
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;