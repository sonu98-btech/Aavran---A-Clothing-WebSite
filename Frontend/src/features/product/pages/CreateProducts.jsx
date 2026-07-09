import React, { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProduct } from "../hooks/use.product.";
import { setProducts } from "../state/product.slice";
import ThemeToggle from "../../../app/ThemeToggle.jsx";

/* ─── Inline Styles (matches Login/Register aesthetic) ─── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Inter:wght@100..900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
      font-family: 'Material Symbols Outlined';
    }

    @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeUp  { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes borderGlow {
      0%, 100% { opacity: 0.5; }
      50%       { opacity: 1; }
    }

    .page-enter   { animation: fadeIn  1s ease both; }
    .card-enter   { animation: fadeUp  0.7s cubic-bezier(0.16,1,0.3,1) both 0.1s; }

    .shimmer-text {
      background: linear-gradient(90deg, #c9a227 0%, #f5e6c8 40%, #ecc246 60%, #c9a227 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    .watermark-text {
      font-size: 13vw;
      line-height: 0.85;
      color: rgba(255,255,255,0.022);
      user-select: none;
      pointer-events: none;
      font-weight: 900;
      letter-spacing: 0.18em;
    }

    /* Glass card */
    .glass-card {
      background: rgba(26,31,58,0.38);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 0.5px solid rgba(119,118,126,0.28);
    }

    /* Glass inputs */
    .glass-input {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(119,118,126,0.22);
      color: #fff;
      transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
    }
    .glass-input::placeholder { color: rgba(255,255,255,0.22); }
    .glass-input:focus {
      outline: none;
      border-color: #c9a227;
      background: rgba(201,162,39,0.07);
      box-shadow: 0 0 0 3px rgba(201,162,39,0.14), 0 0 18px rgba(201,162,39,0.1);
    }
    .glass-input option { background: #0f1422; color: #fff; }

    /* Gold button */
    .btn-gold {
      background: linear-gradient(135deg, #c9a227 0%, #ecc246 50%, #c9a227 100%);
      background-size: 200% auto;
      color: #0a0a0f;
      transition: background-position 0.3s ease, box-shadow 0.3s ease, transform 0.15s ease;
    }
    .btn-gold:hover {
      background-position: right center;
      box-shadow: 0 8px 30px rgba(201,162,39,0.4), 0 2px 8px rgba(0,0,0,0.3);
      transform: translateY(-1px);
    }
    .btn-gold:active { transform: translateY(0); }
    .btn-gold:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    /* Label caps */
    .label-caps {
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(201,162,39,0.82);
    }

    /* Decorative line */
    .deco-line-h { background: linear-gradient(90deg, transparent, rgba(201,162,39,0.5), transparent); }
    .deco-line-v { background: linear-gradient(180deg, rgba(201,162,39,0.5), transparent); }

    /* Top gold accent on card */
    .card-top-accent {
      background: linear-gradient(90deg, transparent 0%, #c9a227 30%, #ecc246 50%, #c9a227 70%, transparent 100%);
      animation: borderGlow 3s ease-in-out infinite;
    }

    /* Upload zone */
    .upload-zone {
      border: 1.5px dashed rgba(119,118,126,0.35);
      background: rgba(255,255,255,0.03);
      transition: border-color 0.25s ease, background 0.25s ease;
      cursor: pointer;
    }
    .upload-zone:hover, .upload-zone.drag-over {
      border-color: rgba(201,162,39,0.55);
      background: rgba(201,162,39,0.05);
    }

    .thumb-slot {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(119,118,126,0.22);
      overflow: hidden;
      position: relative;
    }
    .thumb-slot img { width: 100%; height: 100%; object-fit: cover; }
    .thumb-remove {
      position: absolute; top: 2px; right: 2px;
      background: rgba(10,10,15,0.75);
      border: none; cursor: pointer;
      color: #fff; border-radius: 50%;
      width: 16px; height: 16px;
      font-size: 10px;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s;
    }
    .thumb-remove:hover { background: rgba(220,38,38,0.8); }
  `}</style>
);

/* ─── SVG / Icon helpers ─── */
const DiamondIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 8l9 15 9-15L12 1zm0 2.5L19.2 8.3 12 20.8 4.8 8.3 12 3.5z" />
    <path d="M3 8h18" stroke="currentColor" strokeWidth="0.5" fill="none" />
  </svg>
);

const CloudUploadIcon = () => (
  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"
    style={{ color: "rgba(255,255,255,0.3)" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 16v-8m0 0-3 3m3-3 3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
  </svg>
);

const ImagePlaceholderIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"
    style={{ color: "rgba(255,255,255,0.18)" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

/* ─── Glass Input component ─── */
const GlassInput = ({ id, label, type = "text", value, onChange, placeholder, className = "" }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="label-caps block">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`glass-input w-full px-4 py-3 rounded-none ${className}`}
    />
  </div>
);

/* ─── Main Component ─── */
const CreateProduct = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const { handleCreateProduct } = useProduct();

  /* ── Local UI state ── */
  const [form, setForm] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages] = useState([]); // array of { file, preview }
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_IMAGES = 5;

  const handle = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  /* ── Image handling ── */
  const addImages = useCallback(
    (files) => {
      const remaining = MAX_IMAGES - images.length;
      const toAdd = Array.from(files).slice(0, remaining);
      const newEntries = toAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newEntries]);
    },
    [images.length]
  );

  const removeImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const onFileChange = (e) => addImages(e.target.files);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    addImages(e.dataTransfer.files);
  };
  const onDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const onDragLeave = () => setIsDragOver(false);

  /* ── Submit ── */
  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Client-side validation
    if (!form.title.trim()) { setError("Product title is required."); return; }
    if (!form.priceAmount || Number(form.priceAmount) <= 0) { setError("Enter a valid price."); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("priceAmount", form.priceAmount);
      formData.append("priceCurrency", form.priceCurrency);
      images.forEach(({ file }) => formData.append("images", file));

      const newProduct = await handleCreateProduct(formData);

      if (newProduct) {
        dispatch(setProducts([...products, newProduct]));
      }

      setSuccess(true);
      // Reset form
      setForm({ title: "", description: "", priceAmount: "", priceCurrency: "INR" });
      images.forEach(({ preview }) => URL.revokeObjectURL(preview));
      setImages([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{ fontFamily: "Inter, sans-serif", background: "#0a0a0f" }}
    >
      <GlobalStyles />

      {/* ── Background image overlay ── */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/aavran-bg.png"
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.28) saturate(0.8)" }}
        />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(10,10,20,0.93) 0%, rgba(10,10,20,0.55) 50%, rgba(10,10,20,0.9) 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 55% at 25% 50%, rgba(201,162,39,0.05) 0%, transparent 70%)" }} />
      </div>

      {/* ── Watermark ── */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <span
          className="watermark-text"
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "22vw",
            fontWeight: "900",
            letterSpacing: "0.22em",
            color: "rgba(201,162,39,0.03)",
            textTransform: "uppercase"
          }}
        >
          AAVRAN
        </span>
      </div>

      {/* ── Corner decorative lines ── */}
      <div className="absolute top-6 left-6 w-14 h-14 pointer-events-none hidden lg:block">
        <div className="absolute top-0 left-0 w-full h-px deco-line-h" />
        <div className="absolute top-0 left-0 h-full w-px deco-line-v" />
      </div>
      <div className="absolute bottom-6 right-6 w-14 h-14 pointer-events-none hidden lg:block">
        <div className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, transparent, rgba(201,162,39,0.5), transparent)" }} />
        <div className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, rgba(201,162,39,0.5), transparent)" }} />
      </div>

      {/* ── Top brand bar ── */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-16 py-5 page-enter">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center rounded-sm"
            style={{ background: "linear-gradient(135deg, #c9a227, #ecc246)", color: "#0a0a0f" }}>
            <DiamondIcon size={14} />
          </div>
          <span className="text-white font-black tracking-[0.22em] uppercase text-sm"
            style={{ fontFamily: "Inter, sans-serif" }}>
            AAVRAN
          </span>
        </div>

        {/* Season tag */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ border: "1px solid rgba(201,162,39,0.22)", background: "rgba(201,162,39,0.07)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-amber-400/80 text-[9px] font-bold tracking-[0.18em] uppercase">
            SS 2025 Collection
          </span>
        </div>

        {/* Toggle + Cancel */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ThemeToggle />
          <a href="/"
            className="flex items-center gap-1.5 text-white/40 hover:text-amber-400 text-xs font-semibold tracking-widest uppercase transition-colors">
            Cancel
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </a>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row min-h-screen pt-24 pb-12 px-6 md:px-16 gap-12 lg:gap-20 items-center page-enter">

        {/* ── Left: Editorial storytelling ── */}
        <div className="hidden lg:flex flex-1 flex-col justify-center space-y-10 py-12">
          {/* Decorative line */}
          <div className="h-px w-14" style={{ background: "linear-gradient(90deg, #c9a227, transparent)" }} />

          <div className="space-y-4">
            <p className="label-caps">New Listing</p>
            <h1 className="text-5xl xl:text-6xl font-light leading-[1.1] text-white"
              style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}>
              Craft Your<br />
              <span className="shimmer-text font-semibold italic">Collection</span>
            </h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mt-2"
              style={{ fontFamily: "Inter, sans-serif" }}>
              Share your artisanal creations with a global audience of discerning connoisseurs.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-7">
            {[
              {
                icon: (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918" />
                  </svg>
                ),
                title: "Global Reach",
                desc: "Connect with premium buyers worldwide.",
              },
              {
                icon: (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                ),
                title: "Seamless Management",
                desc: "Intuitive tools to track your inventory.",
              },
              {
                icon: (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                ),
                title: "Secure Transactions",
                desc: "End-to-end encryption for every sale.",
              },
            ].map(({ icon, title, desc }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ border: "1px solid rgba(201,162,39,0.28)", color: "#c9a227" }}>
                  {icon}
                </div>
                <div>
                  <p className="text-white/80 text-[11px] font-bold tracking-[0.18em] uppercase mb-1">{title}</p>
                  <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right: Form card ── */}
        <div className="w-full max-w-[480px] flex-shrink-0 card-enter">
          {/* Glow */}
          <div className="absolute -inset-8 rounded-3xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(201,162,39,0.07) 0%, transparent 70%)", filter: "blur(24px)" }} />

          <div className="glass-card relative overflow-hidden"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)" }}>

            {/* Top gold accent */}
            <div className="absolute top-0 left-0 right-0 h-px card-top-accent" />

            <div className="px-8 py-9">
              {/* Card header */}
              <div className="mb-7">
                {/* Mobile logo */}
                <div className="flex lg:hidden items-center gap-2 mb-5">
                  <div className="w-6 h-6 flex items-center justify-center rounded-sm"
                    style={{ background: "linear-gradient(135deg, #c9a227, #ecc246)", color: "#0a0a0f" }}>
                    <DiamondIcon size={12} />
                  </div>
                  <span className="text-white font-black tracking-[0.2em] uppercase text-sm">AAVRAN</span>
                </div>

                <p className="label-caps mb-1.5">Add Product</p>
                <h2 className="text-white text-2xl font-semibold leading-snug"
                  style={{ letterSpacing: "0.03em" }}>
                  New Listing
                </h2>
                <p className="text-white/30 text-xs mt-1.5 leading-relaxed">
                  Fill in the details to publish your piece to the marketplace.
                </p>
              </div>

              {/* ── Form ── */}
              <form onSubmit={submit} noValidate className="space-y-5">

                {/* Success banner */}
                {success && (
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-sm text-xs"
                    style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.28)" }}>
                    <svg width="13" height="13" fill="none" stroke="#4ade80" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span style={{ color: "#4ade80", fontFamily: "Inter, sans-serif" }}>Product published successfully!</span>
                  </div>
                )}

                {/* Error banner */}
                {error && (
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-sm text-xs"
                    style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.28)" }}>
                    <svg width="13" height="13" fill="none" stroke="#f87171" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <span style={{ color: "#f87171", fontFamily: "Inter, sans-serif" }}>{error}</span>
                  </div>
                )}

                {/* Product Title */}
                <GlassInput
                  id="cp-title"
                  label="Product Title"
                  value={form.title}
                  onChange={handle("title")}
                  placeholder="e.g. Noir Silk Blazer"
                />

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="cp-description" className="label-caps block">Description</label>
                  <textarea
                    id="cp-description"
                    rows={4}
                    value={form.description}
                    onChange={handle("description")}
                    placeholder="Tell the story of this piece — materials, craftsmanship, inspiration…"
                    className="glass-input w-full px-4 py-3 rounded-none resize-none"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
                  />
                </div>

                {/* Price + Currency row */}
                <div className="flex gap-3">
                  {/* Price Amount */}
                  <div className="flex-1 space-y-2">
                    <label htmlFor="cp-price" className="label-caps block">Price</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm select-none">₹</span>
                      <input
                        id="cp-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.priceAmount}
                        onChange={handle("priceAmount")}
                        placeholder="0.00"
                        className="glass-input w-full pl-8 pr-4 py-3 rounded-none"
                        style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
                      />
                    </div>
                  </div>

                  {/* Currency */}
                  <div className="w-[110px] space-y-2">
                    <label htmlFor="cp-currency" className="label-caps block">Currency</label>
                    <select
                      id="cp-currency"
                      value={form.priceCurrency}
                      onChange={handle("priceCurrency")}
                      className="glass-input w-full px-3 py-3 rounded-none appearance-none cursor-pointer"
                      style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                {/* ── Image Upload ── */}
                <div className="space-y-2">
                  <label className="label-caps block">
                    Product Images
                    <span className="ml-2 text-white/30 normal-case tracking-normal text-[10px]">
                      ({images.length}/{MAX_IMAGES})
                    </span>
                  </label>

                  {/* Drop zone */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Upload product images"
                    className={`upload-zone rounded-none p-6 flex flex-col items-center justify-center gap-2 ${isDragOver ? "drag-over" : ""}`}
                    onClick={() => images.length < MAX_IMAGES && fileInputRef.current?.click()}
                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                  >
                    <CloudUploadIcon />
                    <p className="text-white/50 text-xs text-center leading-relaxed">
                      Drop up to {MAX_IMAGES} images here<br />
                      <span className="text-white/25">or click to browse</span>
                    </p>
                    {images.length >= MAX_IMAGES && (
                      <p className="text-amber-400/60 text-[10px] font-semibold tracking-wide uppercase">
                        Maximum images reached
                      </p>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onFileChange}
                  />

                  {/* Thumbnail row — 5 slots */}
                  <div className="flex gap-2 mt-1">
                    {Array.from({ length: MAX_IMAGES }).map((_, idx) => {
                      const img = images[idx];
                      return (
                        <div key={idx} className="thumb-slot w-12 h-12 flex items-center justify-center rounded-sm">
                          {img ? (
                            <>
                              <img src={img.preview} alt={`Preview ${idx + 1}`} />
                              <button
                                type="button"
                                className="thumb-remove"
                                onClick={() => removeImage(idx)}
                                aria-label="Remove image"
                              >
                                ×
                              </button>
                            </>
                          ) : (
                            <ImagePlaceholderIcon />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px my-1" style={{ background: "rgba(255,255,255,0.07)" }} />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full py-3.5 rounded-sm text-xs font-black flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  style={{ fontFamily: "Inter, sans-serif", letterSpacing: "0.16em" }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4Z" />
                      </svg>
                      PUBLISHING…
                    </>
                  ) : (
                    <>
                      PUBLISH LISTING
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom gold accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.28), transparent)" }} />
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center px-8 py-4 z-20">
        <p className="text-white/20 text-[9px] tracking-[0.22em] uppercase"
          style={{ fontFamily: "Inter, sans-serif" }}>
          © 2025 Aavran Fashion · All rights reserved
        </p>
      </div>
    </div>
  );
};

export default CreateProduct;