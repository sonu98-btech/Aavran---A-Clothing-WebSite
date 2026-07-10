import React, { useEffect, useState } from 'react';
import { useProduct } from '../hooks/use.product';
import { useSelector } from 'react-redux';
import ThemeToggle from '../../../app/ThemeToggle.jsx';

/* ════════════════════════════════════════════════════
   GLOBAL STYLES  — faithfully implementing Stitch MCP design
════════════════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,600&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    /* ── Keyframes ── */
    @keyframes hm-shimmer {
      to { background-position: 200% center; }
    }
    @keyframes hm-fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes hm-fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes hm-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.5; transform: scale(1.3); }
    }
    @keyframes hm-spin {
      to { transform: rotate(360deg); }
    }
    @keyframes hm-cardIn {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes hm-skeletonPulse {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }

    /* ── Utility ── */
    .hm-fade-up { animation: hm-fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
    .hm-fade-in { animation: hm-fadeIn 0.9s ease both; }
    .hm-card-in { animation: hm-cardIn 0.6s cubic-bezier(0.16,1,0.3,1) both; }

    /* ── Shimmer text (exact Stitch MCP implementation) ── */
    .hm-shimmer {
      position: relative; display: inline-block;
      background: linear-gradient(90deg, #ffffff 0%, #c9a227 50%, #ffffff 100%);
      background-size: 200% auto;
      color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
      animation: hm-shimmer 3s linear infinite;
    }

    /* ── Nav ── */
    .hm-nav {
      background: rgba(10,10,15,0.80);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255,255,255,0.07);
      position: sticky; top: 0; z-index: 50; width: 100%;
    }

    /* ── Nav icon buttons ── */
    .hm-icon-btn {
      width: 36px; height: 36px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%; cursor: pointer;
      border: 1px solid rgba(255,255,255,0.13);
      background: transparent; color: rgba(255,255,255,0.5);
      transition: all 0.22s ease;
    }
    .hm-icon-btn:hover {
      border-color: #c9a227; color: #c9a227;
      background: rgba(201,162,39,0.07);
    }

    /* ── Hero image ── */
    .hm-hero-img {
      position: relative; overflow: hidden;
    }
    .hm-hero-img::before {
      content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
      background:
        linear-gradient(to right, rgba(10,10,15,0.6) 0%, transparent 45%),
        linear-gradient(to top, rgba(10,10,15,0.45) 0%, transparent 55%);
    }
    .hm-hero-img img {
      width: 100%; height: 100%; object-fit: cover; display: block;
      transition: transform 8s ease;
    }
    .hm-hero-img:hover img { transform: scale(1.04); }

    /* ── Gold button ── */
    .hm-btn-gold {
      background: linear-gradient(135deg, #c9a227 0%, #ecc246 50%, #c9a227 100%);
      background-size: 200% auto; border: none;
      color: #0a0a0f; font-weight: 800; cursor: pointer;
      transition: background-position 0.3s, box-shadow 0.3s, transform 0.2s;
    }
    .hm-btn-gold:hover {
      background-position: right center;
      box-shadow: 0 8px 28px rgba(201,162,39,0.42);
      transform: translateY(-1px);
    }
    .hm-btn-gold:active { transform: translateY(0); }

    /* ── Ghost button (hero) ── */
    .hm-btn-ghost {
      background: transparent; cursor: pointer; font-weight: 600;
      border: 1px solid rgba(255,255,255,0.22);
      color: rgba(255,255,255,0.82);
      transition: all 0.22s ease;
    }
    .hm-btn-ghost:hover {
      border-color: rgba(201,162,39,0.7);
      background: rgba(201,162,39,0.08);
      color: #c9a227;
    }

    /* ════════════════════════════════════════════
       PRODUCT CARD  — exact Stitch MCP design
       glass-card: blur(12px), rgba(255,255,255,0.05)
       border-top: SOLID 1px #c9a227
       hover: translateY(-8px), gold glow box-shadow
    ════════════════════════════════════════════ */

    .hm-card {
      /* glassmorphism */
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      /* border: sides rgba, TOP solid gold */
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-top: 2px solid #c9a227;
      border-radius: 16px;
      overflow: hidden;
      display: flex; flex-direction: column;
      cursor: pointer;
      /* exact Stitch cubic-bezier */
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .hm-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 10px 30px -10px rgba(201, 162, 39, 0.15);
      border-color: rgba(201, 162, 39, 0.3);
      border-top: 2px solid #c9a227;
    }

    /* Image area: 3:4 portrait, no overlay text */
    .hm-card-img-box {
      width: 100%; aspect-ratio: 3/4;
      overflow: hidden; flex-shrink: 0;
      background: rgba(3, 7, 34, 0.8); /* #030722 = Stitch primary */
      position: relative;
    }
    .hm-card-img-box img {
      width: 100%; height: 100%; object-fit: cover; display: block;
      transition: transform 1200ms cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.4s ease;
    }
    .hm-card:hover .hm-card-img-box img {
      transform: scale(1.05);
    }

    /* Card body: p-6 = 24px (Stitch) */
    .hm-card-body {
      padding: 24px;
      display: flex; flex-direction: column; flex-grow: 1;
      justify-content: space-between;
    }
    .hm-card-body-inner { margin-bottom: 24px; }

    /* Title row: title LEFT, price RIGHT — EXACTLY Stitch */
    .hm-card-meta {
      display: flex; justify-content: space-between;
      align-items: flex-start; margin-bottom: 8px;
    }
    .hm-card-title {
      font-family: 'Inter', sans-serif;
      font-weight: 700; font-size: 18px;
      color: #ffffff; letter-spacing: 0.02em;
      flex: 1; min-width: 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      padding-right: 16px;
    }
    .hm-card-price {
      font-family: 'Inter', sans-serif;
      color: #c9a227; font-weight: 500;
      white-space: nowrap; flex-shrink: 0;
      font-size: 15px;
    }

    /* Description: outline-variant color per Stitch palette */
    .hm-card-desc {
      font-family: 'Inter', sans-serif;
      font-size: 14px; font-weight: 300; line-height: 1.6;
      color: #c7c5ce; /* outline-variant from Stitch */
      display: -webkit-box;
      -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Ghost cart button — Stitch ghost-btn with light-sweep */
    .hm-cart-btn {
      position: relative; overflow: hidden;
      width: 100%; cursor: pointer;
      padding: 12px 0;
      border: 1px solid rgba(255,255,255,0.2);
      background: transparent; border-radius: 2px;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 12px; font-weight: 500;
      letter-spacing: 0.10em; text-transform: uppercase;
      transition: all 0.3s ease;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    /* Stitch ghost-btn shimmer sweep ::before */
    .hm-cart-btn::before {
      content: ''; position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(201,162,39,0.2), transparent);
      transition: left 0.5s ease;
    }
    .hm-cart-btn:hover { border-color: rgba(201,162,39,0.5); }
    .hm-cart-btn:hover::before { left: 100%; }

    /* ── Stats strip ── */
    .hm-stat-cell {
      background: rgba(12,12,18,0.65);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; text-align: center;
      padding: 28px 16px;
    }

    /* ── Deco line ── */
    .hm-deco-line {
      background: linear-gradient(90deg, transparent, rgba(201,162,39,0.55), transparent);
    }

    /* ── Label ── */
    .hm-label {
      font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 700;
      letter-spacing: 0.22em; text-transform: uppercase; color: rgba(201,162,39,0.85);
    }

    /* ── Skeleton loader ── */
    .hm-skeleton {
      background: linear-gradient(90deg,
        rgba(255,255,255,0.04) 25%,
        rgba(255,255,255,0.08) 37%,
        rgba(255,255,255,0.04) 63%);
      background-size: 800px 100%;
      animation: hm-skeletonPulse 1.6s ease infinite;
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(201,162,39,0.28); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(201,162,39,0.5); }

    /* ════════════════════════════════════════════
       LIGHT THEME  [data-theme="light"]
    ════════════════════════════════════════════ */

    [data-theme="light"] .hm-page { background: #f7f4ee !important; }
    [data-theme="light"] .hm-watermark { color: rgba(139,105,20,0.03) !important; }
    [data-theme="light"] .hm-bracket-line {
      background: rgba(139,105,20,0.38) !important;
    }

    /* Nav — light */
    [data-theme="light"] .hm-nav {
      background: rgba(247,244,238,0.95) !important;
      border-bottom-color: rgba(139,105,20,0.13) !important;
    }
    [data-theme="light"] .hm-brand-name { color: #1c1408 !important; }
    [data-theme="light"] .hm-icon-btn {
      border-color: rgba(139,105,20,0.2) !important; color: #5a4520 !important;
    }
    [data-theme="light"] .hm-icon-btn:hover {
      border-color: #8b6914 !important; color: #8b6914 !important;
      background: rgba(139,105,20,0.07) !important;
    }
    [data-theme="light"] .hm-season-badge {
      border-color: rgba(139,105,20,0.28) !important;
      background: rgba(139,105,20,0.07) !important;
    }
    [data-theme="light"] .hm-season-dot  { background: #8b6914 !important; }
    [data-theme="light"] .hm-season-text { color: rgba(139,105,20,0.9) !important; }

    /* Hero — light */
    [data-theme="light"] .hm-hero-label { color: rgba(139,105,20,0.85) !important; }
    [data-theme="light"] .hm-hero-h1   { color: #1c1408 !important; }
    [data-theme="light"] .hm-hero-sub  { color: rgba(28,20,8,0.52) !important; }
    [data-theme="light"] .hm-hero-img::before {
      background:
        linear-gradient(to right, rgba(247,244,238,0.5) 0%, transparent 45%),
        linear-gradient(to top, rgba(247,244,238,0.4) 0%, transparent 55%) !important;
    }
    [data-theme="light"] .hm-hero-img:hover img {
      transform: none !important;
    }
    [data-theme="light"] .hm-btn-ghost {
      border-color: rgba(28,20,8,0.24) !important; color: #3a2e10 !important;
    }
    [data-theme="light"] .hm-btn-ghost:hover {
      border-color: #8b6914 !important; color: #8b6914 !important;
      background: rgba(139,105,20,0.07) !important;
    }

    /* Stats — light */
    [data-theme="light"] .hm-stats-wrap {
      background: rgba(139,105,20,0.07) !important;
      border-color: rgba(139,105,20,0.14) !important;
    }
    [data-theme="light"] .hm-stat-cell {
      background: rgba(255,255,255,0.78) !important;
    }
    [data-theme="light"] .hm-stat-lbl { color: rgba(28,20,8,0.45) !important; }

    /* Catalogue header — light */
    [data-theme="light"] .hm-section-h2 { color: #1c1408 !important; }
    [data-theme="light"] .hm-deco-line {
      background: linear-gradient(90deg, transparent, rgba(139,105,20,0.48), transparent) !important;
    }
    [data-theme="light"] .hm-count-badge {
      background: rgba(139,105,20,0.1) !important;
      border-color: rgba(139,105,20,0.3) !important;
      color: #8b6914 !important;
    }

    /* Product card — light */
    [data-theme="light"] .hm-card {
      background: rgba(255,255,255,0.88) !important;
      border-color: rgba(139,105,20,0.15) !important;
      border-top-color: #8b6914 !important;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07) !important;
    }
    [data-theme="light"] .hm-card:hover {
      border-color: rgba(139,105,20,0.38) !important;
      border-top-color: #8b6914 !important;
      box-shadow: 0 14px 40px rgba(0,0,0,0.12), 0 10px 30px -10px rgba(139,105,20,0.2) !important;
    }
    [data-theme="light"] .hm-card-img-box { background: #f0ece4 !important; }
    [data-theme="light"] .hm-card-img-box img {
      transition: transform 1200ms cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.4s ease !important;
    }
    [data-theme="light"] .hm-card-title   { color: #1c1408 !important; }
    [data-theme="light"] .hm-card-price   { color: #8b6914 !important; }
    [data-theme="light"] .hm-card-desc    { color: rgba(28,20,8,0.5) !important; }
    [data-theme="light"] .hm-cart-btn {
      border-color: rgba(139,105,20,0.25) !important;
      color: #4a3a18 !important;
    }
    [data-theme="light"] .hm-cart-btn:hover {
      border-color: #8b6914 !important; color: #8b6914 !important;
    }
    [data-theme="light"] .hm-cart-btn::before {
      background: linear-gradient(90deg, transparent, rgba(139,105,20,0.12), transparent) !important;
    }

    /* Skeleton — light */
    [data-theme="light"] .hm-skeleton {
      background: linear-gradient(90deg,
        rgba(139,105,20,0.05) 25%,
        rgba(139,105,20,0.1) 37%,
        rgba(139,105,20,0.05) 63%) !important;
      background-size: 800px 100% !important;
    }

    /* Empty — light */
    [data-theme="light"] .hm-empty {
      background: rgba(255,255,255,0.7) !important;
      border-color: rgba(139,105,20,0.22) !important;
    }
    [data-theme="light"] .hm-empty-icon  { color: rgba(139,105,20,0.2)  !important; }
    [data-theme="light"] .hm-empty-title { color: #1c1408 !important; }
    [data-theme="light"] .hm-empty-sub   { color: rgba(28,20,8,0.45) !important; }

    /* Footer — light */
    [data-theme="light"] .hm-footer {
      border-top-color: rgba(139,105,20,0.12) !important;
    }
    [data-theme="light"] .hm-footer-text { color: rgba(139,105,20,0.42) !important; }

    /* ── Responsive ── */
    @media (max-width: 719px)  { .hm-hero-grid { grid-template-columns: 1fr !important; } }
    @media (max-width: 599px)  { .hm-season-badge { display: none !important; } }
    @media (max-width: 639px)  { .hm-product-grid { grid-template-columns: repeat(1, 1fr) !important; } }
    @media (min-width: 640px) and (max-width: 1023px) {
      .hm-product-grid { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (min-width: 1024px) {
      .hm-product-grid { grid-template-columns: repeat(4, 1fr) !important; }
    }
  `}</style>
);

/* ════════════════════════════════════════════════════
   ICONS
════════════════════════════════════════════════════ */
const DiamondIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 8l9 15 9-15L12 1zm0 2.5L19.2 8.3 12 20.8 4.8 8.3 12 3.5z" />
    <path d="M3 8h18" stroke="currentColor" strokeWidth="0.5" fill="none" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const CartIcon = ({ size = 15 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
);

const PersonIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const BoxIcon = ({ size = 44 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

/* ════════════════════════════════════════════════════
   PRODUCT CARD  — exact Stitch MCP glass-card implementation
════════════════════════════════════════════════════ */
const ProductCard = ({ product, index }) => {
  const [imgErr, setImgErr] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imageUrl = product.images?.[0]?.url;
  const price = product.price?.amount ?? 0;

  return (
    <div
      className="hm-card hm-card-in"
      style={{ animationDelay: `${(index % 8) * 0.07}s` }}
    >
      {/* ── Image: 3/4 aspect, NO text/price overlay ── */}
      <div className="hm-card-img-box">
        {imageUrl && !imgErr && !imgLoaded && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 28, height: 28,
              border: '2px solid rgba(201,162,39,0.18)',
              borderTopColor: '#c9a227', borderRadius: '50%',
              animation: 'hm-spin 0.75s linear infinite',
            }} />
          </div>
        )}
        {imageUrl && !imgErr ? (
          <img
            src={imageUrl}
            alt={product.title}
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <BoxIcon size={40} />
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(201,162,39,0.35)',
            }}>No Image</span>
          </div>
        )}
      </div>

      {/* ── Card body: p-24, title+price same row, desc, ghost btn ── */}
      <div className="hm-card-body">
        <div className="hm-card-body-inner">
          {/* Title LEFT  |  Price RIGHT — exact Stitch layout */}
          <div className="hm-card-meta">
            <h3 className="hm-card-title">{product.title}</h3>
            <span className="hm-card-price">₹{price.toLocaleString('en-IN')}</span>
          </div>
          {/* Description */}
          <p className="hm-card-desc">
            {product.description || 'Premium quality piece from the Aavran Collection.'}
          </p>
        </div>

        {/* Add to Cart — Stitch ghost-btn with gold shimmer sweep */}
        <button className="hm-cart-btn">
          <CartIcon size={13} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

/* ── Skeleton Card ── */
const SkeletonCard = () => (
  <div className="hm-card">
    <div className="hm-card-top" style={{ animation: 'none', opacity: 0.3 }} />
    <div className="hm-card-img-box hm-skeleton" />
    <div className="hm-card-body" style={{ gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <div className="hm-skeleton" style={{ height: 14, borderRadius: 4, width: '60%' }} />
        <div className="hm-skeleton" style={{ height: 14, borderRadius: 4, width: '22%' }} />
      </div>
      <div className="hm-skeleton" style={{ height: 11, borderRadius: 3, width: '88%' }} />
      <div className="hm-skeleton" style={{ height: 11, borderRadius: 3, width: '65%' }} />
      <div className="hm-skeleton" style={{ height: 36, borderRadius: 6, width: '100%', marginTop: 4 }} />
    </div>
  </div>
);

/* ════════════════════════════════════════════════════
   MAIN HOME COMPONENT
════════════════════════════════════════════════════ */
const Home = () => {
  const { handleGetAllProducts } = useProduct();
  const allProducts = useSelector((s) => s.product.allProducts);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    (async () => {
      try { await handleGetAllProducts(); }
      finally { setLoading(false); }
    })();
  }, []);

  const products = Array.isArray(allProducts) ? allProducts : [];

  return (
    <div
      className="hm-page"
      style={{
        minHeight: '100vh', fontFamily: 'Inter, sans-serif',
        background: '#0a0a0f', overflowX: 'hidden',
      }}
    >
      <GlobalStyles />

      {/* ── Fixed bg gradients ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 55% at 15% 28%, rgba(201,162,39,0.055) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 45% at 85% 72%, rgba(201,162,39,0.04) 0%, transparent 65%)' }} />
      </div>

      {/* ── Watermark ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
        <span className="hm-watermark" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(72px, 18vw, 22vw)', fontWeight: 900,
          color: 'rgba(201,162,39,0.025)', letterSpacing: '0.22em',
          textTransform: 'uppercase', userSelect: 'none',
        }}>AAVRAN</span>
      </div>

      {/* ── Corner brackets ── */}
      {[
        { style: { top: 22, left: 22 }, lines: [{ w: '100%', h: 1, top: 0, left: 0, dir: '90deg' }, { w: 1, h: '100%', top: 0, left: 0, dir: '180deg' }] },
        { style: { bottom: 22, right: 22 }, lines: [{ w: '100%', h: 1, bottom: 0, right: 0, dir: '270deg' }, { w: 1, h: '100%', bottom: 0, right: 0, dir: '0deg' }] },
      ].map((corner, ci) => (
        <div key={ci} style={{ position: 'fixed', zIndex: 5, width: 48, height: 48, pointerEvents: 'none', ...corner.style }}>
          {corner.lines.map((l, li) => (
            <div key={li} className="hm-bracket-line" style={{
              position: 'absolute', width: l.w, height: l.h,
              ...(l.top !== undefined ? { top: l.top } : { bottom: l.bottom }),
              ...(l.left !== undefined ? { left: l.left } : { right: l.right }),
              background: `linear-gradient(${l.dir}, rgba(201,162,39,0.5), transparent)`,
            }} />
          ))}
        </div>
      ))}

      {/* ════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════ */}
      <nav className="hm-nav" style={{ height: 64 }}>
        <div style={{
          height: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(14px, 4vw, 52px)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 4,
              background: 'linear-gradient(135deg,#c9a227,#ecc246)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0a0a0f', flexShrink: 0,
            }}>
              <DiamondIcon size={13} />
            </div>
            <span className="hm-brand-name" style={{
              fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 14,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff',
            }}>AAVRAN</span>
          </div>

          {/* Season badge */}
          <div className="hm-season-badge" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 999,
            border: '1px solid rgba(201,162,39,0.25)',
            background: 'rgba(201,162,39,0.08)',
          }}>
            <span className="hm-season-dot" style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#c9a227', display: 'block',
              animation: 'hm-pulse 2.2s ease-in-out infinite',
            }} />
            <span className="hm-season-text hm-label">SS 2025 Collection</span>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ThemeToggle />
            <button className="hm-icon-btn" title="Search" aria-label="Search"><SearchIcon /></button>
            <button className="hm-icon-btn" title="Cart" aria-label="Cart"><CartIcon /></button>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#c9a227,#ecc246)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0a0a0f', cursor: 'pointer', marginLeft: 4,
            }}><PersonIcon /></div>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          HERO  (split: copy LEFT | image RIGHT)
      ════════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 65% 65% at 28% 50%, rgba(201,162,39,0.055) 0%, transparent 70%)' }} />

        <div
          className="hm-hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'clamp(260px,46%,580px) 1fr',
            minHeight: 'clamp(420px, 56vh, 660px)',
            maxWidth: 1400, margin: '0 auto',
            padding: '0 clamp(14px,4vw,52px)',
            gap: 'clamp(20px,3.5vw,56px)',
            alignItems: 'center',
          }}
        >
          {/* Copy */}
          <div
            className={mounted ? 'hm-fade-up' : ''}
            style={{ animationDelay: '0.1s', padding: 'clamp(36px,6vw,72px) 0', opacity: mounted ? undefined : 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div className="hm-deco-line" style={{ width: 26, height: 1 }} />
              <span className="hm-label hm-hero-label">New Arrivals · SS 2025</span>
            </div>

            <h1 className="hm-hero-h1" style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(34px,5vw,70px)', fontWeight: 300,
              lineHeight: 1.08, color: '#fff',
              marginBottom: 16, letterSpacing: '-0.01em',
            }}>
              Discover The<br />
              <span className="hm-shimmer" style={{ fontWeight: 600, fontStyle: 'italic' }}>
                New Collection
              </span>
            </h1>

            <p className="hm-hero-sub" style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(12px,1.2vw,14.5px)',
              color: 'rgba(255,255,255,0.42)', lineHeight: 1.75,
              marginBottom: 34, maxWidth: 390,
            }}>
              Embrace the Contemporary Atelier. A curated selection of structural rigor
              and ethereal transparency for the discerning luxury consumer.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <button className="hm-btn-gold" style={{
                padding: '12px 32px', borderRadius: 4,
                fontFamily: 'Inter, sans-serif', fontSize: 10.5,
                letterSpacing: '0.18em', textTransform: 'uppercase', minWidth: 144,
              }}>Shop Now</button>
              <button className="hm-btn-ghost" style={{
                padding: '12px 32px', borderRadius: 4,
                fontFamily: 'Inter, sans-serif', fontSize: 10.5,
                letterSpacing: '0.18em', textTransform: 'uppercase', minWidth: 144,
              }}>View Lookbook</button>
            </div>
          </div>

          {/* Hero image */}
          <div
            className={`hm-hero-img ${mounted ? 'hm-fade-in' : ''}`}
            style={{
              height: 'clamp(340px,56vh,660px)',
              animationDelay: '0.22s', opacity: mounted ? undefined : 0,
              boxShadow: '0 36px 90px rgba(0,0,0,0.55)',
              border: '1px solid rgba(201,162,39,0.14)',
              borderRadius: 2,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=85&auto=format&fit=crop"
              alt="Aavran SS 2025 Collection"
            />
            <div style={{
              position: 'absolute', bottom: 18, left: 18, zIndex: 2,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ height: 1, width: 18, background: 'rgba(201,162,39,0.6)' }} />
              <span className="hm-label" style={{ fontSize: 7.5, color: 'rgba(201,162,39,0.75)' }}>
                SS 2025 · Editorial Look
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          padding: '0 0 18px', opacity: mounted ? 0.7 : 0, transition: 'opacity 1s ease 1.2s',
        }}>
          <span className="hm-label" style={{ fontSize: '7.5px' }}>Scroll</span>
          <div style={{ width: 1, height: 24, background: 'linear-gradient(180deg, rgba(201,162,39,0.55), transparent)' }} />
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS STRIP
      ════════════════════════════════════════ */}
      <section style={{ padding: '0 clamp(14px,4vw,52px) 56px', position: 'relative', zIndex: 1 }}>
        <div
          className="hm-stats-wrap"
          style={{
            maxWidth: 840, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, overflow: 'hidden',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          {[
            { val: products.length > 0 ? products.length : '8+', lbl: 'Curated Products' },
            { val: '100%', lbl: 'Premium Quality' },
            { val: '24/7', lbl: 'Dedicated Support' },
          ].map(({ val, lbl }, i) => (
            <div
              key={lbl}
              className="hm-stat-cell"
              style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
            >
              <span className="hm-shimmer" style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(20px,3vw,30px)', fontWeight: 800,
              }}>{val}</span>
              <span className="hm-label hm-stat-lbl" style={{ marginTop: 5, fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>
                {lbl}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          PRODUCT CATALOGUE  (Stitch MCP design)
      ════════════════════════════════════════ */}
      <main style={{ padding: '0 clamp(14px,4vw,52px) 80px', position: 'relative', zIndex: 1 }}>

        {/* Section header */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 12, marginBottom: 22,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
              <div className="hm-deco-line" style={{ width: 22, height: 1 }} />
              <span className="hm-label">Our Catalogue</span>
            </div>
            <h2 className="hm-section-h2" style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(26px,4vw,42px)', fontWeight: 300,
              color: '#fff', lineHeight: 1.1, margin: 0,
            }}>
              All{' '}
              <span className="hm-shimmer" style={{ fontWeight: 600, fontStyle: 'italic' }}>
                Products
              </span>
            </h2>
          </div>

          {!loading && products.length > 0 && (
            <span className="hm-count-badge" style={{
              fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', padding: '5px 14px', borderRadius: 999,
              background: 'rgba(201,162,39,0.1)',
              border: '1px solid rgba(201,162,39,0.25)',
              color: '#c9a227', whiteSpace: 'nowrap',
            }}>
              {products.length} {products.length === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="hm-deco-line" style={{ height: 1, marginBottom: 28 }} />

        {/* ── Loading ── */}
        {loading && (
          <div className="hm-product-grid" style={{ display: 'grid', gap: 20 }}>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && products.length === 0 && (
          <div className="hm-empty" style={{
            textAlign: 'center', padding: '72px 20px', borderRadius: 20,
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(201,162,39,0.2)',
          }}>
            <div className="hm-empty-icon" style={{
              display: 'flex', justifyContent: 'center', marginBottom: 16,
              color: 'rgba(201,162,39,0.22)',
            }}><BoxIcon size={48} /></div>
            <p className="hm-empty-title" style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 26,
              fontWeight: 400, color: '#fff', marginBottom: 8,
            }}>No Products Yet</p>
            <p className="hm-empty-sub" style={{
              fontFamily: 'Inter, sans-serif', fontSize: 13,
              color: 'rgba(255,255,255,0.35)', lineHeight: 1.65,
            }}>The collection is being curated. Check back soon.</p>
          </div>
        )}

        {/* ── Product Grid (Stitch MCP: 4-column, uniform) ── */}
        {!loading && products.length > 0 && (
          <div className="hm-product-grid" style={{ display: 'grid', gap: 20 }}>
            {products.map((product, i) => (
              <ProductCard
                key={product._id || i}
                product={product}
                index={i}
                isNew={i < 3}
              />
            ))}
          </div>
        )}
      </main>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="hm-footer" style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '22px clamp(14px,4vw,52px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
        position: 'relative', zIndex: 1,
      }}>
        <div className="hm-deco-line" style={{ height: 1, flex: 1, maxWidth: 70 }} />
        <p className="hm-footer-text" style={{
          fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 600,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)', margin: 0, textAlign: 'center',
        }}>
          © 2025 Aavran Fashion · All rights reserved
        </p>
        <div className="hm-deco-line" style={{ height: 1, flex: 1, maxWidth: 70 }} />
      </footer>
    </div>
  );
};

export default Home;