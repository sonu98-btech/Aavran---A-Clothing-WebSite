import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useCart } from "../hooks/useCart";
import ThemeToggle from "../../../app/ThemeToggle.jsx";
import { useTheme } from "../../../app/ThemeContext";

/* ─── Global Styles — Faithful to Login Page Style ─── */
const CartGlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    *, *::before, *::after { box-sizing: border-box; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes borderGlow {
      0%, 100% { opacity: 0.5; }
      50%       { opacity: 1; }
    }

    .cart-enter  { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
    .brand-enter { animation: fadeIn 1.2s ease both; }

    .shimmer-text {
      background: linear-gradient(90deg, #c9a227 0%, #f5e6c8 40%, #ecc246 60%, #c9a227 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    .glass-card {
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255,255,255,0.12);
    }

    .gold-btn {
      background: linear-gradient(135deg, #c9a227 0%, #ecc246 50%, #c9a227 100%);
      background-size: 200% auto;
      color: #0a0a0f;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      transition: all 0.3s ease;
    }
    .gold-btn:hover {
      background-position: right center;
      box-shadow: 0 8px 30px rgba(201,162,39,0.45), 0 2px 8px rgba(0,0,0,0.3);
      transform: translateY(-1px);
    }
    .gold-btn:active { transform: translateY(0); }

    .ghost-btn {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      transition: all 0.25s ease;
    }
    .ghost-btn:hover {
      border-color: rgba(201,162,39,0.6);
      background: rgba(201,162,39,0.08);
      color: #c9a227;
    }

    .label-text {
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(201,162,39,0.8);
    }

    .qty-btn {
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      font-size: 15px;
      transition: color 0.2s;
    }
    .qty-btn:hover {
      color: #c9a227;
    }

    /* ─── Light Mode overrides ─── */
    [data-theme="light"] .cart-bg {
      background: #F7F4EE !important;
      color: #1C1408 !important;
    }
    [data-theme="light"] .glass-card {
      background: rgba(255, 255, 255, 0.88) !important;
      border-color: rgba(139, 105, 20, 0.18) !important;
      box-shadow: 0 8px 30px rgba(90, 60, 10, 0.08) !important;
    }
    [data-theme="light"] .text-white { color: #1C1408 !important; }
    [data-theme="light"] .text-white\/40 { color: #5A4520 !important; }
    [data-theme="light"] .text-white\/30 { color: #8A6E4C !important; }
    [data-theme="light"] .text-white\/45 { color: #5A4520 !important; }
    [data-theme="light"] .label-text { color: #8B6914 !important; }
    [data-theme="light"] .shimmer-text {
      background: linear-gradient(90deg, #8B6914 0%, #B8901E 40%, #A88015 60%, #8B6914 100%) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
    }
    [data-theme="light"] .gold-btn {
      background: #8B6914 !important;
      color: #fff !important;
    }
    [data-theme="light"] .gold-btn:hover {
      background: #6B5010 !important;
      box-shadow: 0 8px 24px rgba(139, 105, 20, 0.25) !important;
    }
    [data-theme="light"] .ghost-btn {
      border-color: rgba(139, 105, 20, 0.25) !important;
      color: #5A4520 !important;
    }
    [data-theme="light"] .ghost-btn:hover {
      border-color: #8B6914 !important;
      color: #8B6914 !important;
      background: rgba(139, 105, 20, 0.05) !important;
    }
    [data-theme="light"] .qty-btn {
      color: rgba(28, 20, 8, 0.6) !important;
    }
    [data-theme="light"] .qty-btn:hover {
      color: #8B6914 !important;
    }
    [data-theme="light"] .border-light {
      border-color: rgba(139, 105, 20, 0.12) !important;
    }
    [data-theme="light"] .bg-panel-light {
      background: #ECE8E0 !important;
    }
  `}</style>
);

const TrashIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

const DiamondIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 8l9 15 9-15L12 1zm0 2.5L19.2 8.3 12 20.8 4.8 8.3 12 3.5z" />
    <path d="M3 8h18" stroke="currentColor" strokeWidth="0.5" fill="none" />
  </svg>
);

const Cart = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const {
    items,
    loading,
    error,
    handleGetCart,
    handleUpdateCartItem,
    handleRemoveCartItem
  } = useCart();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    handleGetCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getActualPrice = (item) => {
    if (item.variant && item.product?.variants) {
      const v = item.product.variants.find((variant) => variant._id === item.variant || variant.id === item.variant);
      if (v) {
        const priceVal = v.price !== undefined && v.price !== null ? v.price : item.product.price;
        if (typeof priceVal === "number") return priceVal;
        if (priceVal && typeof priceVal.amount === "number") return priceVal.amount;
      }
    }
    const priceVal = item.product?.price;
    if (typeof priceVal === "number") return priceVal;
    if (priceVal && typeof priceVal.amount === "number") return priceVal.amount;
    return item.price?.amount ?? 0;
  };

  const calculateStoredSubtotal = () => {
    return items.reduce((acc, item) => {
      const itemPrice = item.price?.amount ?? 0;
      return acc + itemPrice * item.quantity;
    }, 0);
  };

  const calculateActualSubtotal = () => {
    return items.reduce((acc, item) => {
      const actual = getActualPrice(item);
      return acc + actual * item.quantity;
    }, 0);
  };

  const storedSubtotal = calculateStoredSubtotal();
  const actualSubtotal = calculateActualSubtotal();

  const subtotal = actualSubtotal;
  const shipping = subtotal > 1499 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05); // 5% estimated GST
  const total = subtotal + shipping + tax;

  const previousShipping = storedSubtotal > 1499 ? 0 : 99;
  const previousTax = Math.round(storedSubtotal * 0.05);
  const previousTotal = storedSubtotal + previousShipping + previousTax;

  const hasPriceChanges = storedSubtotal !== actualSubtotal;

  const handleQtyChange = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    await handleUpdateCartItem(item._id, newQty);
  };

  const getVariantDetails = (item) => {
    if (!item.variant || !item.product?.variants) return null;

    const v = item.product.variants.find((variant) => variant._id === item.variant || variant.id === item.variant);
    if (!v) return null;

    const details = [];
    if (v.size) details.push(`Size: ${v.size.toUpperCase()}`);
    if (v.color) details.push(`Color: ${v.color.charAt(0).toUpperCase() + v.color.slice(1)}`);

    if (v.attributes) {
      let entries = [];
      if (v.attributes instanceof Map) {
        entries = Array.from(v.attributes.entries());
      } else if (typeof v.attributes.entries === "function") {
        entries = Array.from(v.attributes.entries());
      } else if (typeof v.attributes === "object") {
        entries = Object.entries(v.attributes);
      }
      entries.forEach(([k, val]) => {
        if (k.toLowerCase() !== "size" && k.toLowerCase() !== "color" && val) {
          details.push(`${k}: ${val}`);
        }
      });
    }

    return details.join(" | ");
  };

  const getProductImage = (item) => {
    if (item.variant && item.product?.variants) {
      const v = item.product.variants.find((variant) => variant._id === item.variant || variant.id === item.variant);
      if (v && v.images && v.images.length > 0) {
        const urls = v.images[0].url ? v.images[0].url.split(" ~ ") : [];
        if (urls.length > 0) return urls[0];
      }
    }

    if (item.product?.images && item.product.images.length > 0) {
      const urls = item.product.images[0].url ? item.product.images[0].url.split(" ~ ") : [];
      if (urls.length > 0) return urls[0];
    }

    return "https://images.unsplash.com/photo-1618220179428-22790b461013?w=500&q=80";
  };

  return (
    <div className="cart-bg relative min-h-screen w-full overflow-x-hidden flex flex-col justify-between"
      style={{ fontFamily: "Inter, sans-serif", background: "#0a0a0f", color: "#fff" }}>

      <CartGlobalStyles />

      {/* ── Full-bleed background ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src="/aavran-bg.png"
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.22) saturate(0.85)" }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(10,10,20,0.95) 0%, rgba(10,10,20,0.6) 50%, rgba(10,10,20,0.92) 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(201,162,39,0.06) 0%, transparent 70%)" }} />
      </div>

      {/* ── Decorative watermark ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span
          className="text-[20vw] font-black tracking-[0.18em] uppercase"
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            color: "rgba(201,162,39,0.02)",
            userSelect: "none",
            letterSpacing: "0.22em",
          }}
        >
          AAVRAN
        </span>
      </div>

      {/* ── Corner decorative lines ── */}
      <div className="absolute top-20 left-8 w-12 h-12 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-amber-400/50 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-amber-400/50 to-transparent" />
      </div>
      <div className="absolute bottom-20 right-8 w-12 h-12 pointer-events-none z-0">
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-amber-400/50 to-transparent" />
        <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-amber-400/50 to-transparent" />
      </div>

      {/* Header / Brand strip */}
      <header
        className="relative sticky top-0 z-50 h-16 flex items-center justify-between px-5 sm:px-8 backdrop-blur-md border-b transition-colors z-20"
        style={{ background: "rgba(10,10,15,0.75)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <Link to="/home" className="flex items-center gap-2.5 no-underline">
          <div className="w-7 h-7 flex items-center justify-center rounded-sm"
            style={{ background: "linear-gradient(135deg, #c9a227, #ecc246)", color: "#0a0a0f" }}>
            <DiamondIcon size={14} />
          </div>
          <span className="hm-shimmer inline-block font-black tracking-[0.22em] uppercase text-sm">
            AAVRAN
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          {/* Season tag */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/20 bg-amber-400/5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-amber-400/80 text-[8px] font-bold tracking-[0.18em] uppercase">SS 2025 Collection</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className={`relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 lg:py-12 ${mounted ? "cart-enter" : "opacity-0"}`}>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 mb-6 text-[10px] uppercase tracking-widest text-white/40">
          <Link to="/home" className="hover:text-amber-400 transition-colors" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-amber-400 transition-colors" style={{ color: "inherit", textDecoration: "none" }}>Shop</Link>
          <span>/</span>
          <span className="shimmer-text font-bold">Shopping Cart</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <p className="label-text mb-1">Your Curated Collection</p>
          <h1 className="text-white text-3xl font-light tracking-wide leading-none" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
            Shopping <span className="shimmer-text font-bold italic">Cart</span>
          </h1>
        </div>

        {loading && items.length === 0 ? (
          <div className="py-24 text-center text-white/40">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            Loading your selected garments...
          </div>
        ) : items.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
            style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
            <h2 className="text-white text-xl font-semibold mb-3">Your cart is currently empty</h2>
            <p className="text-white/40 text-xs leading-relaxed max-w-xs mx-auto mb-6">
              Explore our curation of Banarasi, Katan Silk, and luxury designer garments to start your collection.
            </p>
            <Link to="/shop" className="gold-btn inline-block px-8 py-3.5 rounded-lg text-xs font-bold no-underline">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left Column: Cart Items List */}
            <div className="w-full lg:w-[65%] space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="glass-card rounded-xl p-4 sm:p-5 flex gap-4 sm:gap-6 items-center border-light"
                  style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.3)" }}
                >
                  {/* Product Image */}
                  <div className="w-20 h-28 sm:w-24 sm:h-32 bg-[#14141e] bg-panel-light overflow-hidden flex-shrink-0 border border-light rounded-md">
                    <img
                      src={getProductImage(item)}
                      alt={item.product?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info and controls */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="text-white font-bold text-sm sm:text-base tracking-wide truncate">
                          <Link to={`/shop/${item.product?._id}`} className="hover:text-amber-400 transition-colors" style={{ color: "inherit", textDecoration: "none" }}>
                            {item.product?.title || "Luxury Fashion Item"}
                          </Link>
                        </h3>
                        <button
                          onClick={() => handleRemoveCartItem(item._id)}
                          className="qty-btn p-1 flex items-center justify-center hover:text-red-400 transition-colors"
                          title="Remove item"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        >
                          <TrashIcon />
                        </button>
                      </div>

                      {/* Variant Info */}
                      <p className="text-white/45 text-[10px] sm:text-[11px] tracking-wide mb-2 uppercase">
                        {getVariantDetails(item) || `Base Product - ${item.product?.color || "N/A"}`}
                      </p>

                      {getActualPrice(item) < (item.price?.amount ?? 0) && (
                        <div className="text-green-400 text-[10px] sm:text-[11px] font-semibold tracking-wide mb-2">
                          ✨ Price Dropped! Saved ₹{(((item.price?.amount ?? 0) - getActualPrice(item)) * item.quantity).toLocaleString("en-IN")}
                        </div>
                      )}
                      {getActualPrice(item) > (item.price?.amount ?? 0) && (
                        <div className="text-red-400 text-[10px] sm:text-[11px] font-semibold tracking-wide mb-2">
                          ⚠️ Price increased by ₹{((getActualPrice(item) - (item.price?.amount ?? 0)) * item.quantity).toLocaleString("en-IN")}!
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-light rounded-md overflow-hidden bg-white/5">
                        <button
                          onClick={() => handleQtyChange(item, -1)}
                          className="w-8 h-8 flex items-center justify-center qty-btn hover:bg-white/5"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item, 1)}
                          className="w-8 h-8 flex items-center justify-center qty-btn hover:bg-white/5"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="flex flex-col items-end">
                        {getActualPrice(item) !== (item.price?.amount ?? 0) ? (
                          <>
                            <span className="line-through text-white/30 text-[10px] sm:text-xs">
                              ₹{((item.price?.amount ?? 0) * item.quantity).toLocaleString("en-IN")}
                            </span>
                            <span className="font-bold text-sm sm:text-base" style={{ color: getActualPrice(item) < (item.price?.amount ?? 0) ? "#22c55e" : "#ef4444" }}>
                              ₹{(getActualPrice(item) * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-sm sm:text-base" style={{ color: "#c9a227" }}>
                            ₹{((item.price?.amount ?? 0) * item.quantity).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 flex justify-between">
                <Link to="/shop" className="ghost-btn px-5 py-3 rounded-lg text-xs no-underline flex items-center gap-1">
                  <span>←</span> Shop Collection
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="w-full lg:w-[35%] lg:sticky lg:top-24">
              {/* Glow effect behind summary */}
              <div className="absolute -inset-4 rounded-3xl pointer-events-none z-0"
                style={{ background: "radial-gradient(ellipse at center, rgba(201,162,39,0.06) 0%, transparent 75%)", filter: "blur(12px)" }} />

              <div className="glass-card rounded-2xl p-6 sm:p-7 relative overflow-hidden z-10 border-light"
                style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>

                {/* Top gold accent line */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent 0%, #c9a227 30%, #ecc246 50%, #c9a227 70%, transparent 100%)", animation: "borderGlow 3s ease-in-out infinite" }} />

                <h2 className="label-text mb-5 pb-3 border-b border-light">
                  Order Summary
                </h2>

                {hasPriceChanges && (
                  <div className="mb-4 p-3 rounded-lg text-[11px] leading-relaxed border"
                    style={{
                      background: actualSubtotal < storedSubtotal ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
                      borderColor: actualSubtotal < storedSubtotal ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                      color: actualSubtotal < storedSubtotal ? "#4ade80" : "#f87171"
                    }}>
                    {actualSubtotal < storedSubtotal ? (
                      <div>
                        <strong>✨ Cart Price Dropped!</strong> You are saving a total of <strong>₹{(storedSubtotal - actualSubtotal).toLocaleString("en-IN")}</strong> on this collection.
                      </div>
                    ) : (
                      <div>
                        <strong>⚠️ Price Increase Warning!</strong> Some items in your collection have increased in price. Total increased by <strong>₹{(actualSubtotal - storedSubtotal).toLocaleString("en-IN")}</strong>.
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4 text-xs sm:text-sm text-white/40 mb-6 font-medium">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <div className="flex flex-col items-end">
                      {hasPriceChanges ? (
                        <>
                          <span className="line-through text-white/30 text-xs">₹{storedSubtotal.toLocaleString("en-IN")}</span>
                          <span className="text-white font-bold">₹{actualSubtotal.toLocaleString("en-IN")}</span>
                        </>
                      ) : (
                        <span className="text-white font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <div className="flex flex-col items-end">
                      {hasPriceChanges && previousShipping !== shipping ? (
                        <>
                          <span className="line-through text-white/30 text-xs">{previousShipping === 0 ? "Complimentary" : `₹${previousShipping}`}</span>
                          <span className="text-white font-bold">{shipping === 0 ? "Complimentary" : `₹${shipping}`}</span>
                        </>
                      ) : (
                        <span className="text-white font-bold">{shipping === 0 ? "Complimentary" : `₹${shipping}`}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Estimated GST (5%)</span>
                    <div className="flex flex-col items-end">
                      {hasPriceChanges && previousTax !== tax ? (
                        <>
                          <span className="line-through text-white/30 text-xs">₹{previousTax.toLocaleString("en-IN")}</span>
                          <span className="text-white font-bold">₹{tax.toLocaleString("en-IN")}</span>
                        </>
                      ) : (
                        <span className="text-white font-bold">₹{tax.toLocaleString("en-IN")}</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center font-bold text-base text-white border-t border-light">
                    <span>Total</span>
                    <div className="flex flex-col items-end">
                      {hasPriceChanges && previousTotal !== total ? (
                        <>
                          <span className="line-through text-white/30 text-xs font-normal">₹{previousTotal.toLocaleString("en-IN")}</span>
                          <span style={{ color: "#c9a227" }}>₹{total.toLocaleString("en-IN")}</span>
                        </>
                      ) : (
                        <span style={{ color: "#c9a227" }}>₹{total.toLocaleString("en-IN")}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checkout CTA Button */}
                <button className="gold-btn w-full py-3.5 px-6 rounded-lg text-xs font-black flex items-center justify-center gap-2 cursor-pointer focus:outline-none">
                  Proceed to Checkout
                </button>

                <p className="text-[10px] text-center text-white/30 mt-4 leading-relaxed">
                  Tax and shipping estimates apply. Standard luxury packaging included with all orders.
                </p>

                {/* Bottom gold accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.3) 50%, transparent 100%)" }} />
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer bar */}
      <footer className="relative z-10 w-full py-6 text-center border-t border-light"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-white/20 text-[9px] tracking-[0.22em] uppercase">
          © 2026 Aavran Fashion · All rights reserved
        </p>
      </footer>
    </div>
  );
};

export default Cart;