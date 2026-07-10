import React, { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProduct } from "../hooks/use.product.";
import { setProducts } from "../state/product.slice";
import ThemeToggle from "../../../app/ThemeToggle.jsx";

/* ─── Keyframe animations (minimal, scoped) ─── */
const AnimStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Inter:wght@100..900&display=swap');

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
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .cp-fade-up { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
    .cp-fade-up-delay { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both 0.12s; }

    .cp-shimmer-text {
      background: linear-gradient(90deg, #c9a227 0%, #f5e6c8 40%, #ecc246 60%, #c9a227 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    .cp-border-glow {
      animation: borderGlow 3s ease-in-out infinite;
    }

    /* Glass input — dark */
    .cp-glass-input {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.15);
      color: #fff;
      transition: all 0.25s ease;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      width: 100%;
      padding: 12px 16px;
      border-radius: 8px;
      outline: none;
    }
    .cp-glass-input::placeholder { color: rgba(255,255,255,0.28); }
    .cp-glass-input:focus {
      outline: none;
      border-color: #c9a227;
      background: rgba(201,162,39,0.1);
      box-shadow: 0 0 0 3px rgba(201,162,39,0.18), 0 0 20px rgba(201,162,39,0.12);
    }
    .cp-glass-input option { background: #0a0a0f; color: #fff; }

    /* Upload zone */
    .cp-upload-zone {
      border: 1.5px dashed rgba(255,255,255,0.15);
      background: rgba(255,255,255,0.07);
      transition: border-color 0.25s ease, background 0.25s ease;
      cursor: pointer;
    }
    .cp-upload-zone:hover, .cp-upload-zone.drag-over {
      border-color: rgba(201,162,39,0.55);
      background: rgba(201,162,39,0.05);
    }

    /* Thumb slot */
    .cp-thumb-slot {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      flex-shrink: 0;
    }
    .cp-thumb-slot img { width: 100%; height: 100%; object-fit: cover; }
    .cp-thumb-remove {
      position: absolute; top: 2px; right: 2px;
      background: rgba(10,10,15,0.75);
      border: none; cursor: pointer;
      color: #fff; border-radius: 50%;
      width: 16px; height: 16px; font-size: 10px;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s;
    }
    .cp-thumb-remove:hover { background: rgba(220,38,38,0.85); }

    .label-text {
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(201,162,39,0.8);
    }

    .glass-card {
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255,255,255,0.12);
    }

    /* Hide number input spinners */
    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type=number] {
      -moz-appearance: textfield;
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

const CloudUploadIcon = ({ light }) => (
  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"
    className={light ? "text-[#8B6914]/50" : "text-white/30"}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 16v-8m0 0-3 3m3-3 3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
  </svg>
);

const ImagePlaceholderIcon = ({ light }) => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"
    className={light ? "text-[#C4B58A]" : "text-white/18"}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

/* ─── Reusable form field ─── */
const Field = ({ id, label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id}
      className="label-text block">
      {label}
    </label>
    {children}
  </div>
);

/* ─── Main Component ─── */
const CreateProduct = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const { handleCreateProduct } = useProduct();

  const [navOpen, setNavOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priceAmount: "", priceCurrency: "INR" });
  const [images, setImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const MAX_IMAGES = 5;

  const handle = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const addImages = useCallback((files) => {
    const remaining = MAX_IMAGES - images.length;
    const toAdd = Array.from(files).slice(0, remaining);
    setImages((prev) => [...prev, ...toAdd.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
  }, [images.length]);

  const removeImage = (idx) => {
    setImages((prev) => { URL.revokeObjectURL(prev[idx].preview); return prev.filter((_, i) => i !== idx); });
  };

  const onFileChange = (e) => addImages(e.target.files);
  const onDrop = (e) => { e.preventDefault(); setIsDragOver(false); addImages(e.dataTransfer.files); };
  const onDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const onDragLeave = () => setIsDragOver(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(false);
    if (!form.title.trim()) { setError("Product title is required."); return; }
    if (!form.priceAmount || Number(form.priceAmount) <= 0) { setError("Enter a valid price."); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("priceAmount", form.priceAmount);
      fd.append("priceCurrency", form.priceCurrency);
      images.forEach(({ file }) => fd.append("images", file));
      const newProduct = await handleCreateProduct(fd);
      if (newProduct) dispatch(setProducts([...products, newProduct]));
      setSuccess(true);
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
    <div className="
      relative min-h-screen w-full overflow-y-auto flex items-center justify-center
      bg-[#0a0a0f]
      font-[Inter,sans-serif]
      transition-colors duration-300
    ">
      <AnimStyles />

      {/* ── Full-bleed background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/aavran-bg.png"
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.35) saturate(0.85)" }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(10,10,20,0.9) 0%, rgba(10,10,20,0.5) 50%, rgba(10,10,20,0.85) 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(201,162,39,0.06) 0%, transparent 70%)" }} />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
          <span className="
            text-[22vw] font-black tracking-[0.22em] uppercase leading-none
          " style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            color: "rgba(201,162,39,0.03)"
          }}>
            AAVRAN
          </span>
        </div>
      </div>

      {/* ── Corner decorative lines ── */}
      <div className="absolute top-6 left-6 w-14 h-14 pointer-events-none hidden lg:block">
        <div className="absolute top-0 left-0 w-full h-px"
          style={{ background: "linear-gradient(90deg, rgba(201,162,39,0.5), transparent)" }} />
        <div className="absolute top-0 left-0 h-full w-px"
          style={{ background: "linear-gradient(180deg, rgba(201,162,39,0.5), transparent)" }} />
      </div>
      <div className="absolute bottom-6 right-6 w-14 h-14 pointer-events-none hidden lg:block">
        <div className="absolute bottom-0 right-0 w-full h-px"
          style={{ background: "linear-gradient(270deg, rgba(201,162,39,0.5), transparent)" }} />
        <div className="absolute bottom-0 right-0 h-full w-px"
          style={{ background: "linear-gradient(0deg, rgba(201,162,39,0.5), transparent)" }} />
      </div>

      {/* ── Top brand strip ── */}
      <header className="
        absolute top-0 left-0 right-0 z-30 flex items-center justify-between
        px-6 md:px-16 py-5
      ">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center rounded-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #c9a227, #ecc246)", color: "#0a0a0f" }}>
            <DiamondIcon size={14} />
          </div>
          <span className="
            font-black tracking-[0.22em] uppercase text-sm
            text-white
          " style={{ fontFamily: "Inter, sans-serif" }}>
            AAVRAN
          </span>
        </div>

        {/* Season tag — hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ border: "1px solid rgba(201,162,39,0.22)", background: "rgba(201,162,39,0.07)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
          <span className="text-amber-400/80 text-[9px] font-bold tracking-[0.18em] uppercase whitespace-nowrap">
            SS 2025 Collection
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <a href="/"
            className="
              flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase
              transition-colors duration-200
              text-white/40 hover:text-amber-400
            ">
            <span className="hidden sm:inline">Cancel</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </a>
        </div>
      </header>

      {/* ── Main layout ── */}
      <main className="
        relative z-10 w-full max-w-6xl mx-auto
        flex flex-col lg:flex-row
        px-4 sm:px-8 lg:px-12
        pt-24 pb-16
        gap-10 lg:gap-20
        items-center justify-center
      ">

        {/* ── Left: Editorial panel (desktop only) ── */}
        <div className="hidden lg:flex flex-1 flex-col justify-center space-y-10 py-12 cp-fade-up cp-left-panel">

          {/* Decorative line */}
          <div className="h-px w-14"
            style={{ background: "linear-gradient(90deg, #c9a227, transparent)" }} />

          <div className="space-y-4">
            <p className="label-text">
              New Listing
            </p>
            <h1 className="
              text-5xl xl:text-6xl font-light leading-[1.1]
              text-white
            " style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}>
              Craft Your<br />
              <span className="cp-shimmer-text font-semibold italic pr-2">Collection</span>
            </h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Share your artisanal creations with a global audience of discerning connoisseurs.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-7">
            {[
              {
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918" /></svg>,
                title: "Global Reach", desc: "Connect with premium buyers worldwide.",
              },
              {
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
                title: "Seamless Management", desc: "Intuitive tools to track your inventory.",
              },
              {
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
                title: "Secure Transactions", desc: "End-to-end encryption for every sale.",
              },
            ].map(({ icon, title, desc }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-amber-400"
                  style={{ border: "1px solid rgba(201,162,39,0.28)" }}>
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
        <div className="w-full max-w-lg lg:max-w-[500px] lg:flex-shrink-0 cp-fade-up-delay">

          {/* Card */}
          <div className="
            glass-card cp-card relative overflow-hidden rounded-2xl
            shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.07)]
            transition-colors duration-300
          ">

            {/* Top gold accent */}
            <div className="absolute top-0 left-0 right-0 h-px cp-border-glow"
              style={{ background: "linear-gradient(90deg, transparent 0%, #c9a227 30%, #ecc246 50%, #c9a227 70%, transparent 100%)" }} />

            <div className="px-5 sm:px-8 py-7 sm:py-9">

              {/* Card header */}
              <div className="mb-6 sm:mb-7">
                {/* Mobile logo mark */}
                <div className="flex lg:hidden items-center gap-2 mb-5">
                  <div className="w-6 h-6 flex items-center justify-center rounded-sm flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #c9a227, #ecc246)", color: "#0a0a0f" }}>
                    <DiamondIcon size={12} />
                  </div>
                  <span className="text-white font-black tracking-[0.2em] uppercase text-sm">AAVRAN</span>
                </div>

                <p className="label-text mb-1.5">
                  Add Product
                </p>
                <h2 className="text-white text-xl sm:text-2xl font-semibold leading-snug"
                  style={{ letterSpacing: "0.03em" }}>
                  New Listing
                </h2>
                <p className="text-white/30 text-xs mt-1.5 leading-relaxed">
                  Fill in the details to publish your piece to the marketplace.
                </p>
              </div>

              {/* ── Form ── */}
              <form onSubmit={submit} noValidate className="flex flex-col gap-4 sm:gap-5">

                {/* Success banner */}
                {success && (
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded text-xs"
                    style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.28)" }}>
                    <svg width="13" height="13" fill="none" stroke="#4ade80" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-green-400 font-[Inter,sans-serif]">Product published successfully!</span>
                  </div>
                )}

                {/* Error banner */}
                {error && (
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded text-xs"
                    style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.28)" }}>
                    <svg width="13" height="13" fill="none" stroke="#f87171" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <span className="text-red-400 font-[Inter,sans-serif]">{error}</span>
                  </div>
                )}

                {/* Product Title */}
                <Field id="cp-title" label="Product Title">
                  <input
                    id="cp-title"
                    type="text"
                    value={form.title}
                    onChange={handle("title")}
                    placeholder="e.g. Noir Silk Blazer"
                    className="glass-input cp-glass-input"
                  />
                </Field>

                {/* Description */}
                <Field id="cp-description" label="Description">
                  <textarea
                    id="cp-description"
                    rows={4}
                    value={form.description}
                    onChange={handle("description")}
                    placeholder="Tell the story of this piece — materials, craftsmanship, inspiration…"
                    className="glass-input cp-glass-input resize-none"
                  />
                </Field>

                {/* Price + Currency row — stacks on xs, side by side on sm+ */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Price */}
                  <Field id="cp-price" label="Price">
                    <div className="relative">
                      <span className="
                        absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none
                        text-white/40 cp-price-prefix
                      ">₹</span>
                      <input
                        id="cp-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.priceAmount}
                        onChange={handle("priceAmount")}
                        placeholder="0.00"
                        className="glass-input cp-glass-input"
                        style={{ paddingLeft: "40px" }}
                      />
                    </div>
                  </Field>

                  {/* Currency */}
                  <div className="sm:w-[120px] flex-shrink-0">
                    <Field id="cp-currency" label="Currency">
                      <select
                        id="cp-currency"
                        value={form.priceCurrency}
                        onChange={handle("priceCurrency")}
                        className="glass-input cp-glass-input cursor-pointer appearance-none"
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </Field>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-2">
                  <label className="label-text block">
                    Product Images{" "}
                    <span className="ml-1 text-white/30 normal-case tracking-normal text-[10px]">
                      ({images.length}/{MAX_IMAGES})
                    </span>
                  </label>

                  {/* Drop zone */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Upload product images"
                    className={`upload-zone cp-upload-zone rounded p-5 sm:p-6 flex flex-col items-center justify-center gap-2 ${isDragOver ? "drag-over" : ""}`}
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

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onFileChange}
                  />

                  {/* Thumbnail slots — responsive flex-wrap on mobile */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Array.from({ length: MAX_IMAGES }).map((_, idx) => {
                      const img = images[idx];
                      return (
                        <div key={idx}
                          className="thumb-slot cp-thumb-slot w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center">
                          {img ? (
                            <>
                              <img src={img.preview} alt={`Preview ${idx + 1}`} />
                              <button
                                type="button"
                                className="thumb-remove cp-thumb-remove"
                                onClick={() => removeImage(idx)}
                                aria-label="Remove image"
                              >×</button>
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
                <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full py-3.5 rounded text-xs font-black
                    flex items-center justify-center gap-2
                    focus:outline-none focus:ring-2 focus:ring-amber-400/40
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    hover:-translate-y-0.5
                    active:translate-y-0
                  "
                  style={{
                    background: "linear-gradient(135deg, #c9a227 0%, #ecc246 50%, #c9a227 100%)",
                    backgroundSize: "200% auto",
                    color: "#0a0a0f",
                    letterSpacing: "0.16em",
                    fontFamily: "Inter, sans-serif",
                  }}>
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
      <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-center px-8 py-4 z-20">
        <p className="text-white/20 text-[9px] tracking-[0.22em] uppercase"
          style={{ fontFamily: "Inter, sans-serif" }}>
          © 2025 Aavran Fashion · All rights reserved
        </p>
      </footer>
    </div>
  );
};

export default CreateProduct;