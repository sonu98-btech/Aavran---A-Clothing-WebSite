import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router";
import { useProduct } from "../hooks/use.product";
import { useCart } from "../../cart/hooks/useCart";
import ThemeToggle from "../../../app/ThemeToggle.jsx";
import AccountDropDown from "../../shared/components/AccountDropDown.jsx";
import { useTheme } from "../../../app/ThemeContext";

/* ─── Global Styles ─── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:wght@300;400;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes spinFade {
      0%,100% { opacity:0.5 } 50% { opacity:1 }
    }

    .pd-fade-up { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both; }

    .pd-glass {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .pd-gold-btn {
      background: linear-gradient(135deg, #c9a227 0%, #ecc246 50%, #c9a227 100%);
      background-size: 200% auto;
      color: #0a0a0f;
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-size: 11px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .pd-gold-btn:hover {
      background-position: right center;
      box-shadow: 0 8px 28px rgba(201,162,39,0.4), 0 2px 8px rgba(0,0,0,0.3);
      transform: translateY(-1px);
    }
    .pd-gold-btn:active { transform: translateY(0); }

    .pd-ghost-btn {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .pd-ghost-btn:hover {
      border-color: rgba(201,162,39,0.6);
      background: rgba(201,162,39,0.08);
      color: #c9a227;
    }

    .pd-tab {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.04em;
      padding: 10px 0;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      background: transparent;
      border-left: none; border-right: none; border-top: none;
      color: rgba(255,255,255,0.45);
      white-space: nowrap;
    }
    .pd-tab:hover { color: rgba(255,255,255,0.8); }
    .pd-tab.active {
      color: #c9a227;
      border-bottom-color: #c9a227;
    }

    .pd-size-btn {
      font-family: 'Inter', sans-serif;
      font-size: 11.5px;
      font-weight: 600;
      letter-spacing: 0.08em;
      padding: 8px 16px;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 4px;
      background: rgba(255,255,255,0.02);
      color: rgba(255,255,255,0.65);
      cursor: pointer;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .pd-size-btn:hover {
      border-color: rgba(201,162,39,0.5);
      color: rgba(255,255,255,0.9);
      background: rgba(255,255,255,0.05);
    }
    .pd-size-btn.selected {
      border-color: #c9a227;
      background: rgba(201,162,39,0.12);
      color: #c9a227;
      box-shadow: 0 0 12px rgba(201,162,39,0.15);
    }

    /* ─── Light mode overrides ─── */
    [data-theme="light"] .pd-page-bg {
      background: #F7F4EE !important;
    }
    [data-theme="light"] .pd-glass {
      background: rgba(255,255,255,0.88) !important;
      border-color: rgba(139,105,20,0.14) !important;
      box-shadow: 0 4px 40px rgba(90,60,10,0.10) !important;
    }
    [data-theme="light"] .pd-card-bg {
      background: #fff !important;
      border-color: rgba(139,105,20,0.12) !important;
    }
    [data-theme="light"] .pd-text-main { color: #1C1408 !important; }
    [data-theme="light"] .pd-text-muted { color: #7A6040 !important; }
    [data-theme="light"] .pd-text-subtle { color: #A89070 !important; }
    [data-theme="light"] .pd-border { border-color: rgba(139,105,20,0.15) !important; }
    [data-theme="light"] .pd-divider { background: rgba(139,105,20,0.12) !important; }
    [data-theme="light"] .pd-thumb-strip {
      background: rgba(247,244,238,0.8) !important;
      border-color: rgba(139,105,20,0.12) !important;
    }
    [data-theme="light"] .pd-img-box {
      background: #ECE8E0 !important;
    }
    [data-theme="light"] .pd-tab {
      color: rgba(28,20,8,0.45) !important;
    }
    [data-theme="light"] .pd-tab:hover { color: #1C1408 !important; }
    [data-theme="light"] .pd-tab.active {
      color: #8B6914 !important;
      border-bottom-color: #8B6914 !important;
    }
    [data-theme="light"] .pd-size-btn {
      border-color: rgba(139,105,20,0.2) !important;
      color: rgba(28,20,8,0.6) !important;
    }
    [data-theme="light"] .pd-size-btn:hover {
      border-color: #8B6914 !important;
      color: #1C1408 !important;
    }
    [data-theme="light"] .pd-size-btn.selected {
      border-color: #8B6914 !important;
      background: rgba(139,105,20,0.08) !important;
      color: #8B6914 !important;
    }
    [data-theme="light"] .pd-ghost-btn {
      border-color: rgba(139,105,20,0.3) !important;
      color: #5A4520 !important;
    }
    [data-theme="light"] .pd-ghost-btn:hover {
      border-color: #8B6914 !important;
      background: rgba(139,105,20,0.06) !important;
      color: #8B6914 !important;
    }
    [data-theme="light"] .pd-gold-btn {
      background: #8B6914 !important;
      color: #fff !important;
    }
    [data-theme="light"] .pd-gold-btn:hover {
      background: #6B5010 !important;
      box-shadow: 0 8px 28px rgba(139,105,20,0.30) !important;
    }
    [data-theme="light"] .pd-qty-btn {
      border-color: rgba(139,105,20,0.25) !important;
      color: #5A4520 !important;
    }
    [data-theme="light"] .pd-qty-btn:hover {
      border-color: #8B6914 !important;
      color: #8B6914 !important;
    }
    [data-theme="light"] .pd-qty-box {
      background: #F7F4EE !important;
      border-color: rgba(139,105,20,0.15) !important;
    }
    [data-theme="light"] .pd-trust-item { border-color: rgba(139,105,20,0.12) !important; }
    [data-theme="light"] .pd-star { color: #B8901E !important; }
    [data-theme="light"] .pd-badge-new {
      background: rgba(139,105,20,0.12) !important;
      color: #8B6914 !important;
      border-color: rgba(139,105,20,0.25) !important;
    }
    [data-theme="light"] .pd-thumb-btn {
      border-color: rgba(139,105,20,0.2) !important;
    }
    [data-theme="light"] .pd-thumb-btn.active {
      border-color: #8B6914 !important;
    }
    [data-theme="light"] .pd-attr-box {
      background: rgba(247,244,238,0.9) !important;
      border-color: rgba(139,105,20,0.12) !important;
    }
    [data-theme="light"] .pd-tab-content {
      color: #5A4520 !important;
    }
    [data-theme="light"] .pd-breadcrumb { color: #7A6040 !important; }
    [data-theme="light"] .pd-breadcrumb a { color: #5A4520 !important; }
    [data-theme="light"] .pd-breadcrumb a:hover { color: #8B6914 !important; }
    [data-theme="light"] .pd-back-btn {
      color: #5A4520 !important;
      border-color: rgba(139,105,20,0.2) !important;
    }
    [data-theme="light"] .pd-back-btn:hover {
      color: #8B6914 !important;
      border-color: #8B6914 !important;
    }
  `}</style>
);

/* ─── Icons ─── */
const DiamondIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 8l9 15 9-15L12 1zm0 2.5L19.2 8.3 12 20.8 4.8 8.3 12 3.5z" />
    <path d="M3 8h18" stroke="currentColor" strokeWidth="0.5" fill="none" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

const ZoomIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
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

const SearchIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const TruckIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M8.25 5.25h3m-3 3h3" />
  </svg>
);

const FabricIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path strokeLinecap="round" d="M3 9h18M3 15h18M9 3v18M15 3v18" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const OccasionIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
  </svg>
);

const LengthIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
  </svg>
);

const HeartIcon = ({ filled = false }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

const HangerIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 7V4a2 2 0 1 1 4 0" />
    <path d="m2 17 8-5.333a3 3 0 0 1 4 0L22 17a1 1 0 0 1-.555 1.778H2.555A1 1 0 0 1 2 17Z" />
  </svg>
);

/* ─── Star Rating ─── */
const StarRating = ({ rating = 4.7, reviews = 128 }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-0.5 pd-star" style={{ color: "#c9a227" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} filled={s <= Math.round(rating)} />
      ))}
    </div>
    <span className="text-[13px] font-semibold" style={{ color: "#c9a227" }}>{rating}</span>
    <span className="pd-text-muted text-[12px]">({reviews} reviews)</span>
  </div>
);

/* ─── Image Gallery ─── */
const ImageGallery = ({ images }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
  }, [images]);

  const allUrls = (images || []).flatMap((img) =>
    (img.url || "").split(" ~ ").map((u) => u.trim()).filter(Boolean)
  );

  const prev = () => setActiveIdx((i) => (i - 1 + allUrls.length) % allUrls.length);
  const next = () => setActiveIdx((i) => (i + 1) % allUrls.length);

  const placeholder = (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.18)" }}>
        No Image
      </span>
    </div>
  );

  return (
    <div className="flex gap-3 w-full">
      {/* Thumbnail strip */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        {allUrls.length === 0
          ? Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="pd-thumb-btn w-[64px] h-[80px] border bg-white/5 dark:bg-white/3 flex items-center justify-center"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            />
          ))
          : allUrls.slice(0, 5).map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`pd-thumb-btn w-[64px] h-[80px] overflow-hidden border-2 transition-all duration-200 ${activeIdx === i ? "active" : ""}`}
              style={{
                borderColor: activeIdx === i ? "#c9a227" : "rgba(255,255,255,0.12)",
                opacity: activeIdx === i ? 1 : 0.65,
              }}
            >
              <img src={url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 overflow-hidden group pd-img-box" style={{ aspectRatio: "3/4", background: "#14141e", minHeight: 340 }}>
        {allUrls.length > 0 ? (
          <img
            src={allUrls[activeIdx]}
            alt="Product"
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          />
        ) : (
          placeholder
        )}

        {/* Prev / Next arrows (only if multiple images) */}
        {allUrls.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              style={{ background: "rgba(0,0,0,0.45)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              style={{ background: "rgba(0,0,0,0.45)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <ChevronRightIcon />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {allUrls.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {allUrls.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="transition-all duration-200"
                style={{
                  width: activeIdx === i ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: activeIdx === i ? "#c9a227" : "rgba(255,255,255,0.3)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Color Swatches ─── */
const colorPalette = [
  { name: "Beige Gold", hex: "#C8A96E" },
  { name: "Rose", hex: "#F4A0A0" },
  { name: "Forest", hex: "#3D7A4E" },
  { name: "Slate", hex: "#7A8FA6" },
  { name: "Burgundy", hex: "#8C1C3A" },
];

/* ─── Trust Badges ─── */
const TrustBadges = () => (
  <div className="grid grid-cols-3 gap-3 mt-5">
    {[
      { icon: <ShieldIcon />, title: "Quality Assured", sub: "Premium Quality" },
      { icon: <RefreshIcon />, title: "Easy Returns", sub: "7 Days Return" },
      { icon: <TruckIcon />, title: "Free Delivery", sub: "On orders above ₹1499" },
    ].map(({ icon, title, sub }) => (
      <div
        key={title}
        className="pd-trust-item flex flex-col items-center gap-1.5 py-3 px-2 text-center border"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <span style={{ color: "#c9a227" }}>{icon}</span>
        <p className="pd-text-main font-semibold" style={{ fontSize: 11, letterSpacing: "0.03em" }}>{title}</p>
        <p className="pd-text-subtle" style={{ fontSize: 10 }}>{sub}</p>
      </div>
    ))}
  </div>
);

/* ─── Product Attributes ─── */
const ProductAttributes = ({ product }) => {
  const fabric = product?.material || "Silk Blend";
  const work = product?.work || "Zari Weaving";
  const occasion = product?.occasion || "Festive / Wedding";
  const length = product?.length || "5.5 Meters";

  const attrs = [
    { icon: <FabricIcon />, label: "Fabric", value: fabric },
    { icon: <SparkleIcon />, label: "Work", value: work },
    { icon: <OccasionIcon />, label: "Occasion", value: occasion },
    { icon: <LengthIcon />, label: "Length", value: length },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
      {attrs.map(({ icon, label, value }) => (
        <div
          key={label}
          className="pd-attr-box flex flex-col items-center gap-2 py-4 px-3 text-center border"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <span style={{ color: "#c9a227" }}>{icon}</span>
          <p className="pd-text-muted" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</p>
          <p className="pd-text-main font-medium" style={{ fontSize: 12 }}>{value}</p>
        </div>
      ))}
    </div>
  );
};

/* ─── Tabs ─── */
const tabs = ["Description", "Product Details", "Care Instructions", "Reviews"];

const TabSection = ({ product }) => {
  const [activeTab, setActiveTab] = useState(0);

  const description = product?.description || "This elegant product is crafted with fine fabric and intricate detailing, reflecting heritage and tradition. The soft texture and timeless design make it a must-have for your ethnic wardrobe.";

  const tabContent = [
    <p key="desc" className="pd-tab-content text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)", maxWidth: 640 }}>{description}</p>,
    <div key="details" className="space-y-3">
      {[
        ["SKU", product?.sku || `AAVRAN-${(product?._id || "").slice(-6).toUpperCase()}`],
        ["Material", product?.material || "Silk Blend"],
        ["Country of Origin", "India"],
        ["Care", "Dry Clean Only"],
        ["Package Contents", "1 Product"],
      ].map(([k, v]) => (
        <div key={k} className="flex gap-4 text-[13px]" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 8 }}>
          <span className="pd-text-muted w-40 flex-shrink-0">{k}</span>
          <span className="pd-text-main font-medium">{v}</span>
        </div>
      ))}
    </div>,
    <div key="care" className="space-y-2">
      {["Hand wash or dry clean recommended.", "Do not bleach or tumble dry.", "Iron on low heat, inside out.", "Store in a cool, dry place.", "Colour may bleed slightly on first wash."].map((tip) => (
        <div key={tip} className="flex items-start gap-2 text-[13px]">
          <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#c9a227" }} />
          <span className="pd-text-muted">{tip}</span>
        </div>
      ))}
    </div>,
    <div key="reviews" className="space-y-4">
      {[
        { name: "Priya S.", rating: 5, comment: "Absolutely stunning piece! The quality is exceptional and the fabric feels luxurious.", date: "12 Jun 2025" },
        { name: "Anjali M.", rating: 4, comment: "Beautiful design. Loved the craftsmanship. Delivery was prompt.", date: "28 May 2025" },
        { name: "Meena R.", rating: 5, comment: "Perfect for festive occasions. Got so many compliments wearing this!", date: "15 May 2025" },
      ].map((r, i) => (
        <div key={i} className="pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: "rgba(201,162,39,0.18)", color: "#c9a227" }}>
                {r.name[0]}
              </div>
              <span className="pd-text-main font-semibold text-[13px]">{r.name}</span>
            </div>
            <span className="pd-text-subtle text-[11px]">{r.date}</span>
          </div>
          <div className="flex items-center gap-0.5 mb-1" style={{ color: "#c9a227" }}>
            {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={s <= r.rating} />)}
          </div>
          <p className="pd-text-muted text-[13px] leading-relaxed">{r.comment}</p>
        </div>
      ))}
    </div>,
  ];

  return (
    <div className="mt-10">
      {/* Tab nav */}
      <div className="flex gap-6 sm:gap-8 border-b overflow-x-auto" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`pd-tab flex-shrink-0 ${activeTab === i ? "active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
            {tab === "Reviews" && (
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(201,162,39,0.15)", color: "#c9a227" }}>
                128
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="pt-6">{tabContent[activeTab]}</div>
    </div>
  );
};

/* ─── Skeleton Loading ─── */
const SkeletonDetail = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 animate-pulse">
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="flex gap-3 lg:w-[55%]">
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-16 h-20" style={{ background: "rgba(255,255,255,0.06)" }} />
          ))}
        </div>
        <div className="flex-1" style={{ aspectRatio: "3/4", background: "rgba(255,255,255,0.06)" }} />
      </div>
      <div className="flex-1 space-y-4">
        <div className="h-4 w-20 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-8 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-5 w-1/3 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-4 w-full rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-4 w-5/6 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-10 w-full rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
const ProductDetail = () => {
  const { id } = useParams();
  const { handleGetProductDetail } = useProduct();
  const product = useSelector((state) => state.product.productDetail);
  const loading = useSelector((state) => state.product.loading);
  const user = useSelector((state) => state.auth.user);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const { items: cartItems, handleAddToCart: apiAddToCart, handleGetCart } = useCart();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  // Derive sizes and colors from actual product variants present in DB
  const { dbSizes, dbColors } = React.useMemo(() => {
    const sizeSet = new Set();
    const colorSet = new Set();

    // Add base product color if present
    if (product?.color) {
      const capitalized = product.color.charAt(0).toUpperCase() + product.color.slice(1).toLowerCase();
      colorSet.add(capitalized);
    }

    // Add base product size if present
    if (product?.size) {
      sizeSet.add(product.size.toUpperCase());
    }

    const variantsList = product?.variants || product?.varients || [];

    if (product && Array.isArray(variantsList)) {
      variantsList.forEach((v) => {
        if (v.color) {
          const capitalized = v.color.charAt(0).toUpperCase() + v.color.slice(1).toLowerCase();
          colorSet.add(capitalized);
        }
        if (v.size) {
          sizeSet.add(v.size.toUpperCase());
        }
        if (v.attributes) {
          let entries = [];
          if (v.attributes instanceof Map) {
            entries = Array.from(v.attributes.entries());
          } else if (typeof v.attributes.entries === "function") {
            entries = Array.from(v.attributes.entries());
          } else if (typeof v.attributes === "object") {
            entries = Object.entries(v.attributes);
          }

          entries.forEach(([key, val]) => {
            const kLower = key.toLowerCase();
            if (val) {
              const valStr = String(val).trim();
              if (kLower === "size") {
                sizeSet.add(valStr.toUpperCase());
              } else if (kLower === "color") {
                const capitalized = valStr.charAt(0).toUpperCase() + valStr.slice(1).toLowerCase();
                colorSet.add(capitalized);
              }
            }
          });
        }
      });
    }

    const colorHexMap = {
      "beige gold": "#C8A96E",
      rose: "#F4A0A0",
      forest: "#3D7A4E",
      slate: "#7A8FA6",
      burgundy: "#8C1C3A",
      pink: "#f9a8d4",
      green: "#16a34a",
      brown: "#92400e",
      maroon: "#881337",
      cream: "#fef9c3",
      blue: '#1d4ed8',
      red: '#dc2626',
      olive: '#65a30d',
      white: '#ffffff',
      black: '#000000',
      grey: '#808080',
      navy: '#000080',
      yellow: '#facc15',
      orange: '#f97316',
      purple: '#a855f7',
      wine: '#722f37',
      peach: '#ffcba4',
      mustard: '#e1ad01',
      lavender: '#e6e6fa',
      mauve: '#e0b0ff',
      lilac: '#c8a2c8',
      charcoal: '#36454f',
      teal: '#008080',
      rust: '#b7410e',
      beige: '#f5f5dc',
      khaki: '#c3b091',
      mint: '#3eb489',
      turquoise: '#40e0d0',
      coral: '#ff7f50',
      magenta: '#ff00ff',
      ivory: '#fffff0',
      gold: '#ffd700',
      silver: '#c0c0c0',
      bronze: '#cd7f32',
      copper: '#b87333',
      plum: '#dda0dd',
      emerald: '#50c878',
      ruby: '#e0115f',
      sapphire: '#0f52ba',
    };

    const parsedColors = Array.from(colorSet).map((name) => {
      const normalized = name.toLowerCase().trim();
      return {
        name,
        hex: colorHexMap[normalized] || normalized,
      };
    });

    const finalSizes = Array.from(sizeSet);

    return {
      dbSizes: finalSizes,
      dbColors: parsedColors,
    };
  }, [product]);

  // Helper functions to extract color and size from variant
  const getAttr = (v, key) => {
    if (!v.attributes) return undefined;
    const targetKey = key.toLowerCase();

    let attrsObj = {};
    if (v.attributes instanceof Map) {
      attrsObj = Object.fromEntries(v.attributes.entries());
    } else if (typeof v.attributes.entries === "function") {
      attrsObj = Object.fromEntries(v.attributes.entries());
    } else if (typeof v.attributes === "object") {
      attrsObj = v.attributes;
    }

    for (const [k, val] of Object.entries(attrsObj)) {
      if (k.toLowerCase() === targetKey) {
        return val;
      }
    }
    return undefined;
  };

  const getVariantColor = (v) => {
    return v.color || getAttr(v, "color") || getAttr(v, "Color");
  };

  const getVariantSize = (v) => {
    return v.size || getAttr(v, "size") || getAttr(v, "Size");
  };

  // Derive extra attributes from variants
  const extraAttributes = React.useMemo(() => {
    const attrMap = {};

    const variantsList = product?.variants || product?.varients || [];
    if (product && Array.isArray(variantsList)) {
      variantsList.forEach((v) => {
        if (v.attributes) {
          let entries = [];
          if (v.attributes instanceof Map) {
            entries = Array.from(v.attributes.entries());
          } else if (typeof v.attributes.entries === "function") {
            entries = Array.from(v.attributes.entries());
          } else if (typeof v.attributes === "object") {
            entries = Object.entries(v.attributes);
          }

          entries.forEach(([key, val]) => {
            const kLower = key.toLowerCase();
            if (kLower === "color" || kLower === "size") return;

            if (val) {
              const valStr = String(val).trim();
              if (!attrMap[key]) {
                attrMap[key] = new Set();
              }
              attrMap[key].add(valStr);
            }
          });
        }
      });
    }

    const result = {};
    for (const [key, valSet] of Object.entries(attrMap)) {
      result[key] = Array.from(valSet);
    }
    return result;
  }, [product]);

  const resetToInitialCombination = () => {
    if (product) {
      if (product.color) {
        const capitalized = product.color.charAt(0).toUpperCase() + product.color.slice(1).toLowerCase();
        setSelectedColor(capitalized);
      } else if (dbColors.length > 0) {
        setSelectedColor(dbColors[0].name);
      }

      if (product.size) {
        setSelectedSize(product.size.toUpperCase());
      } else if (dbSizes.length > 0) {
        setSelectedSize(dbSizes[0]);
      }

      setSelectedAttrs({});
    }
  };

  // Set default selection based on base product or first variant options
  useEffect(() => {
    resetToInitialCombination();
  }, [product, dbColors, dbSizes, extraAttributes]);

  const handleSelectColor = (colorName) => {
    setSelectedColor(colorName);

    const list = product?.variants || product?.varients || [];
    if (list.length === 0) return;

    // Find variant with matching color and current size
    const exactVariant = list.find((v) => {
      const vColor = getVariantColor(v);
      const vSize = getVariantSize(v);
      return vColor && vColor.toLowerCase() === colorName.toLowerCase() &&
        vSize && String(vSize).toLowerCase() === selectedSize.toLowerCase();
    });

    if (exactVariant) {
      const newAttrs = {};
      Object.keys(extraAttributes).forEach((key) => {
        const val = getAttr(exactVariant, key);
        if (val) newAttrs[key] = val;
      });
      setSelectedAttrs(newAttrs);
    } else {
      // Find any variant matching the new color
      const matchingVariant = list.find((v) => {
        const vColor = getVariantColor(v);
        return vColor && vColor.toLowerCase() === colorName.toLowerCase();
      });

      if (matchingVariant) {
        const sizeVal = getVariantSize(matchingVariant);
        if (sizeVal) setSelectedSize(String(sizeVal).toUpperCase());

        const newAttrs = {};
        Object.keys(extraAttributes).forEach((key) => {
          const val = getAttr(matchingVariant, key);
          if (val) newAttrs[key] = val;
        });
        setSelectedAttrs(newAttrs);
      } else {
        setSelectedAttrs({});
        if (product.size) {
          setSelectedSize(product.size.toUpperCase());
        } else if (dbSizes.length > 0) {
          setSelectedSize(dbSizes[0]);
        }
      }
    }
  };

  const handleSelectSize = (sizeName) => {
    setSelectedSize(sizeName);

    const list = product?.variants || product?.varients || [];
    if (list.length === 0) return;

    // Find variant with current color and matching size
    const exactVariant = list.find((v) => {
      const vColor = getVariantColor(v);
      const vSize = getVariantSize(v);
      return vColor && vColor.toLowerCase() === selectedColor.toLowerCase() &&
        vSize && String(vSize).toLowerCase() === sizeName.toLowerCase();
    });

    if (exactVariant) {
      const newAttrs = {};
      Object.keys(extraAttributes).forEach((key) => {
        const val = getAttr(exactVariant, key);
        if (val) newAttrs[key] = val;
      });
      setSelectedAttrs(newAttrs);
    } else {
      // Find any variant matching the new size
      const matchingVariant = list.find((v) => {
        const vSize = getVariantSize(v);
        return vSize && String(vSize).toLowerCase() === sizeName.toLowerCase();
      });

      if (matchingVariant) {
        const vColor = getVariantColor(matchingVariant);
        if (vColor) {
          const capitalized = vColor.charAt(0).toUpperCase() + vColor.slice(1).toLowerCase();
          setSelectedColor(capitalized);
        }

        const newAttrs = {};
        Object.keys(extraAttributes).forEach((key) => {
          const val = getAttr(matchingVariant, key);
          if (val) newAttrs[key] = val;
        });
        setSelectedAttrs(newAttrs);
      } else {
        setSelectedAttrs({});
        if (product.color) {
          const capitalized = product.color.charAt(0).toUpperCase() + product.color.slice(1).toLowerCase();
          setSelectedColor(capitalized);
        } else if (dbColors.length > 0) {
          setSelectedColor(dbColors[0].name);
        }
      }
    }
  };

  const handleSelectAttr = (attrKey, attrVal) => {
    const newAttrs = { ...selectedAttrs, [attrKey]: attrVal };
    setSelectedAttrs(newAttrs);

    const list = product?.variants || product?.varients || [];
    if (list.length === 0) return;

    // Check if combination (color + size + new attributes) exists
    const hasMatch = list.some((v) => {
      const vColor = getVariantColor(v);
      const vSize = getVariantSize(v);
      const matchColor = vColor && vColor.toLowerCase() === selectedColor.toLowerCase();
      const matchSize = vSize && String(vSize).toLowerCase() === selectedSize.toLowerCase();
      if (!matchColor || !matchSize) return false;

      for (const [k, selVal] of Object.entries(newAttrs)) {
        if (!selVal) continue;
        const vVal = getAttr(v, k);
        if (!vVal || String(vVal).toLowerCase() !== String(selVal).toLowerCase()) return false;
      }
      return true;
    });

    if (!hasMatch) {
      const matchingVariant = list.find((v) => {
        const vVal = getAttr(v, attrKey);
        return vVal && String(vVal).toLowerCase() === String(attrVal).toLowerCase();
      });

      if (matchingVariant) {
        const vColor = getVariantColor(matchingVariant);
        if (vColor) {
          const capitalized = vColor.charAt(0).toUpperCase() + vColor.slice(1).toLowerCase();
          setSelectedColor(capitalized);
        }
        const sizeVal = getVariantSize(matchingVariant);
        if (sizeVal) setSelectedSize(String(sizeVal).toUpperCase());

        const resolvedAttrs = { [attrKey]: attrVal };
        Object.keys(extraAttributes).forEach((key) => {
          if (key !== attrKey) {
            const val = getAttr(matchingVariant, key);
            if (val) resolvedAttrs[key] = val;
          }
        });
        setSelectedAttrs(resolvedAttrs);
      } else {
        resetToInitialCombination();
      }
    }
  };

  // Find variant matching currently selected combination
  const activeVariant = React.useMemo(() => {
    const list = product?.variants || product?.varients;
    if (!product || !Array.isArray(list)) return null;

    return list.find((v) => {
      const vColor = getVariantColor(v);
      const vSize = getVariantSize(v);

      const matchColor = !selectedColor || !vColor || vColor.toLowerCase() === selectedColor.toLowerCase();
      const matchSize = !selectedSize || !vSize || String(vSize).toLowerCase() === selectedSize.toLowerCase();
      if (!matchColor || !matchSize) return false;

      for (const [k, selVal] of Object.entries(selectedAttrs)) {
        if (!selVal) continue;
        const vVal = getAttr(v, k);
        if (!vVal || String(vVal).toLowerCase() !== String(selVal).toLowerCase()) return false;
      }

      return true;
    });
  }, [product, selectedColor, selectedSize, selectedAttrs]);

  const sizes = dbSizes.length ? dbSizes : ["Free Size"];

  // Calculate stock status
  const stock = activeVariant ? (activeVariant.stock ?? 0) : (product?.stock ?? 0);
  const isOutOfStock = stock <= 0;

  // Use variant specific price if defined, otherwise fall back to product base price
  const price = activeVariant?.price ?? (product?.price?.amount ?? 0);
  const currency = product?.price?.currency ?? "INR";
  const symbol = currency === "INR" ? "₹" : "$";

  // Use variant specific images if they exist, otherwise fall back to base product images
  const galleryImages = React.useMemo(() => {
    if (activeVariant && Array.isArray(activeVariant.images) && activeVariant.images.length > 0) {
      return activeVariant.images;
    }
    return product?.images || [];
  }, [product, activeVariant]);

  useEffect(() => {
    setMounted(true);
    handleGetProductDetail(id);
    handleGetCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    const res = await apiAddToCart(product._id, activeVariant?._id, quantity);
    if (res.success) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } else {
      alert(res.message || "Failed to add to cart");
    }
  };

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => Math.min(10, q + 1));

  return (
    <div className="hm-page pd-page-bg min-h-screen transition-colors duration-300" style={{ fontFamily: "Inter, sans-serif", background: "#0a0a0f", color: "#fff", position: 'relative', overflowX: 'hidden' }}>
      
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
      <GlobalStyles />

      {/* ══ STICKY NAVBAR ══════════════════════════════════════ */}
      <header
        className="shop-header sticky top-0 z-50 h-16 flex items-center justify-between px-5 sm:px-10 backdrop-blur-md border-b transition-colors"
        style={{ background: "rgba(10,10,15,0.85)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <Link to="/home" className="flex items-center gap-2.5 no-underline">
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg,#c9a227,#ecc246)", color: "#0a0a0f" }}>
            <DiamondIcon size={12} />
          </div>
          <span className=" hm-shimmer inline-block text-sm font-bold tracking-[0.22em] uppercase">AAVRAN</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          {user && (
            <Link
              to="/cart"
              className="pd-nav-icon-btn w-9 h-9 rounded-full flex items-center justify-center border transition-all relative no-underline"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)" }}
            >
              <CartIcon size={15} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full text-[9px] text-black font-bold flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <div className="relative">
              <div
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: "linear-gradient(135deg,#c9a227,#ecc246)", color: "#0a0a0f" }}
              >
                <PersonIcon />
              </div>
              {showAccountDropdown && (
                <AccountDropDown user={user} onClose={() => setShowAccountDropdown(false)} />
              )}
            </div>
          ) : (
            <Link to="/login" className="text-xs uppercase font-bold tracking-wider px-3.5 py-1.5 border border-[#8b6914]/30 text-[#8b6914] dark:border-[#c9a227]/30 dark:text-[#c9a227] hover:bg-[#8b6914]/10 dark:hover:bg-[#c9a227]/10 rounded transition-all no-underline">
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* ══ BREADCRUMB — mobile only ═══════════════════════════ */}
      <div className="md:hidden flex items-center gap-1.5 px-5 py-3 text-[11px] pd-breadcrumb border-b" style={{ borderColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>
        <Link to="/home" style={{ color: "rgba(255,255,255,0.45)" }}>Home</Link>
        <span>/</span>
        <Link to="/shop" style={{ color: "rgba(255,255,255,0.45)" }}>Shop</Link>
        <span>/</span>
        <span className="truncate" style={{ color: "rgba(255,255,255,0.75)" }}>{product?.title || "Product"}</span>
      </div>

      {/* ══ MAIN CONTENT ═══════════════════════════════════════ */}
      {loading && !product ? (
        <SkeletonDetail />
      ) : (
        <main className={`max-w-6xl mx-auto px-4 sm:px-8 py-8 lg:py-12 ${mounted ? "pd-fade-up" : "opacity-0"}`} style={{ animationDelay: "0.1s", position: 'relative', zIndex: 1 }}>

          {/* Back link */}
          <Link
            to="/shop"
            className="pd-back-btn inline-flex items-center gap-1.5 mb-6 text-[12px] font-medium transition-all border px-3 py-1.5"
            style={{ color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.1)", textDecoration: "none" }}
          >
            <ChevronLeftIcon /> Back to Shop
          </Link>

          {/* ── Product section: gallery + info ── */}
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-14">

            {/* ── LEFT: Image Gallery ── */}
            <div className="w-full lg:w-[52%] xl:w-[50%] flex-shrink-0">
              <ImageGallery images={galleryImages} />
            </div>

            {/* ── RIGHT: Product Info ── */}
            <div className="flex-1 min-w-0">


              {/* Title */}
              <h1
                className="pd-text-main font-light leading-tight mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px, 4vw, 32px)", color: "#fff" }}
              >
                {product?.title || "Royal Banarasi Saree"}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-bold" style={{ fontSize: "clamp(20px, 3vw, 26px)", color: "#c9a227" }}>
                  {symbol}{price ? price.toLocaleString("en-IN") : "3,599"}
                </span>
                <span className="pd-text-muted text-[12px]">(Inclusive of all taxes)</span>
              </div>

              {/* Rating */}
              <StarRating rating={4.7} reviews={128} />

              {/* Divider */}
              <div className="pd-divider my-4 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />

              {/* Description */}
              <p className="pd-text-muted text-[13px] leading-relaxed mb-5" style={{ maxWidth: 440 }}>
                {product?.description?.slice(0, 140) || "Graceful traditional piece crafted with rich weaving and a luxurious finish. Perfect for weddings, festivals and special occasions."}
                {product?.description?.length > 140 ? "…" : ""}
              </p>

              {/* ── Color Selector ── */}
              {dbColors.length > 0 && (
                <div className="mb-5">
                  <p className="pd-text-muted text-[11px] font-semibold uppercase tracking-[0.12em] mb-2.5">
                    Color: <span className="pd-text-main font-semibold">{selectedColor}</span>
                  </p>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {dbColors.map(({ name, hex }) => {
                      const isActive = selectedColor === name;
                      const activeColor = isLight ? "#8b6914" : "#c9a227";
                      return (
                        <button
                          key={name}
                          title={name}
                          onClick={() => handleSelectColor(name)}
                          className="color-swatch w-7 h-7 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center"
                          style={{
                            backgroundColor: hex,
                            border: isActive
                              ? `3px solid ${activeColor}`
                              : "3px solid transparent",
                            boxShadow: isActive
                              ? `0 0 0 2px ${activeColor}`
                              : "0 0 0 1.5px rgba(100,80,40,0.45)",
                            color: isActive
                              ? activeColor
                              : (isLight ? "rgba(28,20,8,0.6)" : "rgba(255,255,255,0.6)"),
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Size Selector ── */}
              {sizes.length > 0 && (
                <div className="mb-5">
                  <p className="pd-text-muted text-[11px] font-semibold uppercase tracking-[0.12em] mb-2.5">
                    Size: <span className="pd-text-main font-semibold">{selectedSize}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((sz) => (
                      <button
                        key={sz}
                        className={`pd-size-btn ${selectedSize === sz ? "selected" : ""}`}
                        onClick={() => handleSelectSize(sz)}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Dynamic Attribute Selectors ── */}
              {Object.entries(extraAttributes).map(([key, vals]) => {
                if (vals.length === 0) return null;
                const selectedVal = selectedAttrs[key];
                return (
                  <div key={key} className="mb-5">
                    <p className="pd-text-muted text-[11px] font-semibold uppercase tracking-[0.12em] mb-2.5">
                      {key}: <span className="pd-text-main font-semibold">{selectedVal}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {vals.map((val) => (
                        <button
                          key={val}
                          className={`pd-size-btn ${selectedVal === val ? "selected" : ""}`}
                          onClick={() => handleSelectAttr(key, val)}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* ── Quantity ── */}
              <div className="flex items-center gap-4 mb-6">
                <p className="pd-text-muted text-[11px] font-semibold uppercase tracking-[0.12em]">Qty:</p>
                <div className="flex items-center border" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                  <button
                    onClick={decreaseQty}
                    className="pd-qty-btn w-9 h-9 flex items-center justify-center text-base font-light transition-all"
                    style={{ color: "rgba(255,255,255,0.6)", border: "none", background: "transparent", cursor: "pointer" }}
                  >
                    −
                  </button>
                  <span
                    className="pd-qty-box w-10 h-9 flex items-center justify-center text-[14px] font-semibold pd-text-main border-l border-r"
                    style={{ borderColor: "rgba(255,255,255,0.12)" }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQty}
                    className="pd-qty-btn w-9 h-9 flex items-center justify-center text-base font-light transition-all"
                    style={{ color: "rgba(255,255,255,0.6)", border: "none", background: "transparent", cursor: "pointer" }}
                  >
                    +
                  </button>
                </div>
                {/* Wishlist */}
                <button
                  onClick={() => setWishlisted((w) => !w)}
                  className="w-9 h-9 rounded-full flex items-center justify-center border transition-all hover:scale-110"
                  style={{
                    borderColor: wishlisted ? "#c9a227" : "rgba(255,255,255,0.15)",
                    color: wishlisted ? "#c9a227" : "rgba(255,255,255,0.5)",
                    background: wishlisted ? "rgba(201,162,39,0.1)" : "transparent",
                  }}
                  title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <HeartIcon filled={wishlisted} />
                </button>
              </div>

              {/* Stock Status Indicator */}
              <div className="mb-4">
                {isOutOfStock ? (
                  <span
                    className="text-[11px] font-bold tracking-wider px-2.5 py-1.5 border"
                    style={{
                      backgroundColor: isLight ? "rgba(220, 38, 38, 0.08)" : "rgba(220, 38, 38, 0.15)",
                      color: isLight ? "#dc2626" : "#f87171",
                      borderColor: isLight ? "rgba(220, 38, 38, 0.2)" : "rgba(220, 38, 38, 0.3)"
                    }}
                  >
                    OUT OF STOCK
                  </span>
                ) : stock <= 5 ? (
                  <span
                    className="text-[11px] font-bold tracking-wider px-2.5 py-1.5 border"
                    style={{
                      backgroundColor: isLight ? "rgba(217, 119, 6, 0.08)" : "rgba(217, 119, 6, 0.15)",
                      color: isLight ? "#d97706" : "#fbbf24",
                      borderColor: isLight ? "rgba(217, 119, 6, 0.2)" : "rgba(217, 119, 6, 0.3)"
                    }}
                  >
                    ONLY {stock} LEFT IN STOCK!
                  </span>
                ) : (
                  <span
                    className="text-[11px] font-bold tracking-wider px-2.5 py-1.5 border"
                    style={{
                      backgroundColor: isLight ? "rgba(22, 163, 74, 0.08)" : "rgba(22, 163, 74, 0.15)",
                      color: isLight ? "#16a34a" : "#4ade80",
                      borderColor: isLight ? "rgba(22, 163, 74, 0.2)" : "rgba(22, 163, 74, 0.3)"
                    }}
                  >
                    IN STOCK ({stock} available)
                  </span>
                )}
              </div>

              {/* ── CTA Buttons ── */}
              <div className="flex gap-3 mb-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 flex items-center justify-center gap-2 transition-all ${isOutOfStock
                      ? "opacity-50 cursor-not-allowed bg-neutral-800 text-neutral-400 border border-neutral-700"
                      : "pd-gold-btn"
                    }`}
                  style={{ minHeight: 48 }}
                >
                  {isOutOfStock ? (
                    "OUT OF STOCK"
                  ) : addedToCart ? (
                    <>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      ADDED!
                    </>
                  ) : (
                    <>
                      <CartIcon size={14} />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 transition-all ${isOutOfStock
                      ? "opacity-50 cursor-not-allowed bg-neutral-900 text-neutral-500 border border-neutral-800"
                      : "pd-ghost-btn"
                    }`}
                  style={{ minHeight: 48 }}
                >
                  Buy Now
                </button>
              </div>

              {/* Trust badges */}
              <TrustBadges />
            </div>
          </div>

          {/* ── Tabs ── */}
          <TabSection product={product} />

          {/* ── Product Attributes ── */}
          <ProductAttributes product={product} />
        </main>
      )}

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <footer
        className="mt-16 border-t py-6 text-center"
        style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", position: 'relative', zIndex: 1 }}
      >
        © 2026 Aavran Fashion · All rights reserved
      </footer>
    </div>
  );
};

export default ProductDetail;