import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/use.auth.js";
import ThemeToggle from "../../../app/ThemeToggle.jsx";

/* ─── Google Fonts + Animations ─── */
const GlobalStyles = () => (
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
    @keyframes pulse-ring {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50%       { opacity: 0.8; transform: scale(1.04); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-8px); }
    }
    @keyframes borderGlow {
      0%, 100% { opacity: 0.5; }
      50%       { opacity: 1; }
    }
    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    .card-enter { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
    .brand-enter { animation: fadeIn 1.2s ease both; }
    .float-anim  { animation: float 6s ease-in-out infinite; }

    .shimmer-text {
      background: linear-gradient(90deg, #c9a227 0%, #f5e6c8 40%, #ecc246 60%, #c9a227 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .glass-input {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.15);
      color: #fff;
      transition: all 0.25s ease;
    }
    .glass-input::placeholder { color: rgba(255,255,255,0.28); }
    .glass-input:focus {
      outline: none;
      border-color: #c9a227;
      background: rgba(201,162,39,0.1);
      box-shadow: 0 0 0 3px rgba(201,162,39,0.18), 0 0 20px rgba(201,162,39,0.12);
    }

    .gold-btn {
      background: linear-gradient(135deg, #c9a227 0%, #ecc246 50%, #c9a227 100%);
      background-size: 200% auto;
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
      transition: all 0.25s ease;
    }
    .ghost-btn:hover {
      border-color: rgba(201,162,39,0.6);
      background: rgba(201,162,39,0.08);
    }

    .seller-toggle {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      transition: all 0.25s ease;
      cursor: pointer;
    }
    .seller-toggle:hover {
      border-color: rgba(201,162,39,0.5);
      background: rgba(201,162,39,0.07);
    }

    .label-text {
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(201,162,39,0.8);
    }

    .decorative-line {
      background: linear-gradient(90deg, transparent, rgba(201,162,39,0.6), transparent);
    }

    /* Scrollbar styling for the form panel */
    .form-scroll::-webkit-scrollbar { width: 4px; }
    .form-scroll::-webkit-scrollbar-track { background: transparent; }
    .form-scroll::-webkit-scrollbar-thumb { background: rgba(201,162,39,0.3); border-radius: 4px; }
  `}</style>
);

/* ─── SVG Icons ─── */
const DiamondIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 8l9 15 9-15L12 1zm0 2.5L19.2 8.3 12 20.8 4.8 8.3 12 3.5z" />
    <path d="M3 8h18" stroke="currentColor" strokeWidth="0.5" fill="none" />
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);



const StoreIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72" />
  </svg>
);

/* ─── Decorative Ring ─── */
const DecorativeRing = ({ size, opacity, delay }) => (
  <div
    className="absolute rounded-full pointer-events-none border"
    style={{
      width: size,
      height: size,
      borderColor: `rgba(201,162,39,${opacity})`,
      animation: `pulse-ring 4s ease-in-out ${delay}s infinite`,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }}
  />
);

/* ─── Glass Input ─── */
const GlassInput = ({ id, label, type = "text", icon, value, onChange, placeholder, rightEl }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="label-text block">{label}</label>
    <div className="relative flex items-center">
      <span className="absolute left-3.5 text-white/30 z-10 pointer-events-none"
        style={{ transition: "color 0.2s" }}>
        {icon}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className="glass-input w-full pl-10 pr-10 py-2.5 text-sm rounded-lg font-inter"
        style={{ fontFamily: "Inter, sans-serif", fontSize: "13px" }}
      />
      {rightEl && <span className="absolute right-3.5 z-10">{rightEl}</span>}
    </div>
  </div>
);
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";
import { useNavigate } from "react-router";
import { setLoading, setError } from "../state/auth.slice.js";
import { useDispatch } from "react-redux";
/* ─── Main ─── */
const Register = () => {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", isSeller: false });
  const [showPw, setShowPw] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ── Redux state ──
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const { registerHandler } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => { setMounted(true); }, []);

  const handle = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    try {
      await registerHandler({
        fullname: form.fullName,
        email: form.email,
        contact: form.phone,
        password: form.password,
        isSeller: form.isSeller,
      });
      navigate("/");
    } catch (err) {
      console.log("error", err)
    }
  };


  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ fontFamily: "Inter, sans-serif", background: "#0a0a0f" }}>

      <GlobalStyles />

      {/* ── Full-bleed background ── */}
      <div className="absolute inset-0">
        <img
          src="/aavran-bg.png"
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.35) saturate(0.85)" }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(10,10,20,0.85) 0%, rgba(10,10,20,0.5) 50%, rgba(10,10,20,0.9) 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(201,162,39,0.06) 0%, transparent 70%)" }} />
      </div>

      {/* ── Decorative watermark ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="text-[22vw] font-black tracking-[0.18em] uppercase"
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            color: "rgba(201,162,39,0.03)",
            userSelect: "none",
            letterSpacing: "0.22em",
          }}
        >
          AAVRAN
        </span>
      </div>

      {/* ── Corner decorative lines ── */}
      <div className="absolute top-8 left-8 w-16 h-16 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-amber-400/60 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-amber-400/60 to-transparent" />
      </div>
      <div className="absolute bottom-8 right-8 w-16 h-16 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-amber-400/60 to-transparent" />
        <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-amber-400/60 to-transparent" />
      </div>

      {/* ── Top brand strip ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5 z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center rounded-sm"
            style={{ background: "linear-gradient(135deg, #c9a227, #ecc246)", color: "#0a0a0f" }}>
            <DiamondIcon size={14} />
          </div>
          <span className="text-white font-black tracking-[0.22em] uppercase text-base"
            style={{ fontFamily: "Inter, sans-serif" }}>
            AAVRAN
          </span>
        </div>
        {/* Season tag */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ border: "1px solid rgba(201,162,39,0.25)", background: "rgba(201,162,39,0.08)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-amber-400/80 text-[9px] font-bold tracking-[0.18em] uppercase"
            style={{ fontFamily: "Inter, sans-serif" }}>SS 2025 Collection</span>
        </div>
        {/* Sign In link + Theme toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ThemeToggle />
          <a href="/login" className="text-white/50 hover:text-amber-400 text-xs font-semibold tracking-widest uppercase transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}>
            Sign In
          </a>
        </div>
      </div>

      {/* ── Main layout: Left stats + Right form ── */}
      <div className={`relative z-10 w-full max-w-6xl px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-24 ${mounted ? "brand-enter" : "opacity-0"}`}>

        {/* ── Left: Brand storytelling ── */}
        <div className="flex-1 text-center lg:text-left space-y-8 hidden lg:block">
          {/* Headline */}
          <div className="space-y-3">
            <div className="decorative-line h-px w-16 mb-6 hidden lg:block" />
            <p className="text-amber-400/70 text-[10px] font-bold tracking-[0.3em] uppercase"
              style={{ fontFamily: "Inter, sans-serif" }}>
              Luxury Fashion Marketplace
            </p>
            <h1
              className="text-5xl xl:text-6xl font-light leading-[1.08] text-white"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              Where Style<br />
              <span className="shimmer-text font-bold italic">
                Meets Excellence
              </span>
            </h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mt-4"
              style={{ fontFamily: "Inter, sans-serif" }}>
              Curated collections for the modern wardrobe. Minimal. Timeless. Effortlessly yours.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-sm">
            {[
              { n: "50K+", l: "Members" },
              { n: "500+", l: "Brands" },
              { n: "4.9★", l: "Rating" },
            ].map(({ n, l }) => (
              <div key={l} className="glass-card rounded-xl p-4 text-center">
                <p className="shimmer-text text-2xl font-black"
                  style={{ fontFamily: "Inter, sans-serif" }}>{n}</p>
                <p className="text-white/40 text-[10px] mt-1 font-semibold tracking-widest uppercase"
                  style={{ fontFamily: "Inter, sans-serif" }}>{l}</p>
              </div>
            ))}
          </div>

          {/* Feature bullets */}
          <div className="space-y-3">
            {[
              "Verified seller onboarding",
              "Secure escrow payments",
              "Global shipping network",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-white/40 text-xs"
                  style={{ fontFamily: "Inter, sans-serif" }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Registration form card ── */}
        <div
          className={`w-full max-w-[420px] flex-shrink-0 ${mounted ? "card-enter" : "opacity-0"}`}
          style={{ animationDelay: "0.15s" }}
        >
          {/* Glow behind card */}
          <div className="absolute -inset-8 rounded-3xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(201,162,39,0.08) 0%, transparent 70%)", filter: "blur(20px)" }} />

          <div className="glass-card rounded-2xl p-7 relative overflow-hidden"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)" }}>

            {/* Top gold accent line */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent 0%, #c9a227 30%, #ecc246 50%, #c9a227 70%, transparent 100%)", animation: "borderGlow 3s ease-in-out infinite" }} />

            {/* Card header */}
            <div className="mb-6">
              {/* Mobile logo */}
              <div className="flex lg:hidden items-center gap-2 mb-5">
                <div className="w-6 h-6 flex items-center justify-center rounded-sm"
                  style={{ background: "linear-gradient(135deg, #c9a227, #ecc246)", color: "#0a0a0f" }}>
                  <DiamondIcon size={12} />
                </div>
                <span className="text-white font-black tracking-[0.2em] uppercase text-sm"
                  style={{ fontFamily: "Inter, sans-serif" }}>AAVRAN</span>
              </div>

              <p className="label-text mb-1.5">Create Account</p>
              <h2 className="text-white text-2xl font-bold leading-snug"
                style={{ fontFamily: "Inter, sans-serif" }}>
                Join the Aavran<br />
                <span className="shimmer-text">Community</span>
              </h2>
              <p className="text-white/35 text-xs mt-1.5 leading-relaxed"
                style={{ fontFamily: "Inter, sans-serif" }}>
                Thousands of buyers &amp; sellers trust Aavran.
              </p>
            </div>

            {/* Google */}
            <ContinueWithGoogle />

            {/* OR */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              <span className="text-white/25 text-[9px] font-bold tracking-[0.25em] uppercase"
                style={{ fontFamily: "Inter, sans-serif" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            </div>

            {/* Form */}
            <form onSubmit={submit} noValidate className="space-y-3.5">
              {/* ── Redux error banner ── */}
              {error && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs"
                  style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.3)", fontFamily: "Inter, sans-serif" }}>
                  <svg width="13" height="13" fill="none" stroke="#f87171" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                  <span style={{ color: "#f87171" }}>{error}</span>
                </div>
              )}

              <GlassInput id="name" label="Full Name" placeholder="Jane Doe"
                icon={<UserIcon />} value={form.fullName} onChange={handle("fullName")} />
              <GlassInput id="email" label="Email Address" type="email" placeholder="jane@aavran.com"
                icon={<MailIcon />} value={form.email} onChange={handle("email")} />
              <GlassInput id="phone" label="Contact Number" type="tel" placeholder="+91 98765 43210"
                icon={<PhoneIcon />} value={form.phone} onChange={handle("phone")} />
              <GlassInput id="password" label="Password" type={showPw ? "text" : "password"}
                placeholder="Min. 8 characters" icon={<LockIcon />}
                value={form.password} onChange={handle("password")}
                rightEl={
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="text-white/25 hover:text-amber-400 transition-colors focus:outline-none">
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                } />

              {/* Seller toggle */}
              <div className="seller-toggle rounded-lg p-3.5 flex items-center justify-between"
                onClick={() => setForm(p => ({ ...p, isSeller: !p.isSeller }))}>
                <div className="flex items-center gap-3">
                  <span className="text-amber-400/60"><StoreIcon /></span>
                  <div>
                    <p className="text-white text-xs font-semibold"
                      style={{ fontFamily: "Inter, sans-serif" }}>Register as Seller</p>
                    <p className="text-white/30 text-[10px]"
                      style={{ fontFamily: "Inter, sans-serif" }}>List & manage your collections</p>
                  </div>
                </div>
                {/* Toggle switch */}
                <button type="button" role="switch" aria-checked={form.isSeller}
                  onClick={e => { e.stopPropagation(); setForm(p => ({ ...p, isSeller: !p.isSeller })); }}
                  className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none"
                  style={{ background: form.isSeller ? "#c9a227" : "rgba(255,255,255,0.12)" }}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-300 ${form.isSeller ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="gold-btn w-full py-3 px-6 rounded-lg text-xs font-black text-[#0a0a0f] flex items-center justify-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                style={{ fontFamily: "Inter, sans-serif", letterSpacing: "0.14em" }}>
                {loading ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                    </svg>
                    CREATING…
                  </>
                ) : "CREATE ACCOUNT"}
              </button>
            </form>

            {/* Footer links */}
            <p className="mt-5 text-center text-[11px] text-white/30"
              style={{ fontFamily: "Inter, sans-serif" }}>
              Already have an account?{" "}
              <a href="/login"
                className="font-bold hover:underline underline-offset-2 transition-colors"
                style={{ color: "#c9a227" }}>
                Sign In
              </a>
            </p>
            <p className="mt-3 text-center text-[10px] text-white/18 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Inter, sans-serif" }}>
              By registering you agree to our{" "}
              <a href="/terms" className="underline hover:text-amber-400/70 transition-colors">Terms</a>
              {" "}&amp;{" "}
              <a href="/privacy" className="underline hover:text-amber-400/70 transition-colors">Privacy Policy</a>.
            </p>

            {/* Bottom gold accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.3) 50%, transparent 100%)" }} />
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center px-8 py-4 z-20">
        <p className="text-white/20 text-[9px] tracking-[0.22em] uppercase"
          style={{ fontFamily: "Inter, sans-serif" }}>
          © 2025 Aavran Fashion · All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Register;