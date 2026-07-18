import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAddress } from "../hooks/use.address.js";
import ThemeToggle from "../../../app/ThemeToggle.jsx";

/* ─── Keyframe animations & scoped CSS (Aavran Theme Compliant) ─── */
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

    /* Glass input — dark default */
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

    .gold-btn {
      background: linear-gradient(135deg, #c9a227 0%, #ecc246 50%, #c9a227 100%);
      background-size: 200% auto;
      color: #0a0a0f !important;
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

const ShippingIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M3.75 14.25h12m-12 0V5.25A2.25 2.25 0 0 1 6 3h6m7.5 11.25V9.75M19.5 9.75l-2.25-3H15m4.5 3h-4.5m4.5 0v3m-9-10.5v12" />
  </svg>
);

/* ─── Reusable form field ─── */
const Field = ({ id, label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="label-text block">
      {label}
    </label>
    {children}
  </div>
);

const Address = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleAddAddress, handleUpdateAddress } = useAddress();

  const addressToEdit = location.state?.addressToEdit;
  const isEditMode = !!addressToEdit;

  const [form, setForm] = useState({
    fullname: "",
    contact: "",
    houseNumber: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode && addressToEdit) {
      setForm({
        fullname: addressToEdit.fullname || "",
        contact: addressToEdit.contact || "",
        houseNumber: addressToEdit.houseNumber || "",
        area: addressToEdit.area || "",
        landmark: addressToEdit.landmark || "",
        city: addressToEdit.city || "",
        state: addressToEdit.state || "",
        pincode: addressToEdit.pincode || "",
        addressType: addressToEdit.addressType || "Home",
      });
    }
  }, [isEditMode, addressToEdit]);

  const handleInputChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Basic Validations
    if (!form.fullname.trim()) {
      setError("Full Name is required.");
      return;
    }
    if (!form.contact.trim() || !/^[6-9]\d{9}$/.test(form.contact.trim())) {
      setError("Please enter a valid 10-digit mobile number starting with 6-9.");
      return;
    }
    if (!form.houseNumber.trim()) {
      setError("House / Flat Number is required.");
      return;
    }
    if (!form.area.trim()) {
      setError("Area / Locality is required.");
      return;
    }
    if (!form.city.trim()) {
      setError("City is required.");
      return;
    }
    if (!form.state.trim()) {
      setError("State is required.");
      return;
    }
    if (!form.pincode || !/^[1-9][0-9]{5}$/.test(form.pincode.trim())) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullname: form.fullname,
        contact: form.contact,
        houseNumber: form.houseNumber,
        area: form.area,
        landmark: form.landmark,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        addressType: form.addressType,
      };

      if (isEditMode) {
        await handleUpdateAddress(addressToEdit._id, payload);
      } else {
        await handleAddAddress(payload);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/checkout");
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to save address. Please try again.");
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

      {/* ── Fixed bg gradients (same as Shop.jsx) ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 55% at 15% 28%, rgba(201,162,39,0.055) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 45% at 85% 72%, rgba(201,162,39,0.04) 0%, transparent 65%)' }} />
      </div>

      {/* ── Watermark (same as Shop.jsx) ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
        <span className="watermark-text" style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: 'clamp(72px, 18vw, 22vw)', fontWeight: 900,
          color: 'rgba(201,162,39,0.025)', letterSpacing: '0.22em',
          textTransform: 'uppercase', userSelect: 'none',
        }}>AAVRAN</span>
      </div>

      {/* ── Corner decorative lines ── */}
      <div className="absolute top-6 left-6 w-14 h-14 pointer-events-none hidden lg:block">
        <div className="absolute top-0 left-0 w-full h-px deco-line-h"
          style={{ background: "linear-gradient(90deg, rgba(201,162,39,0.5), transparent)" }} />
        <div className="absolute top-0 left-0 h-full w-px deco-line-v"
          style={{ background: "linear-gradient(180deg, rgba(201,162,39,0.5), transparent)" }} />
      </div>
      <div className="absolute bottom-6 right-6 w-14 h-14 pointer-events-none hidden lg:block">
        <div className="absolute bottom-0 right-0 w-full h-px deco-line-h"
          style={{ background: "linear-gradient(270deg, rgba(201,162,39,0.5), transparent)" }} />
        <div className="absolute bottom-0 right-0 h-full w-px deco-line-v"
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

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <button onClick={() => navigate("/checkout")}
            className="
              flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase
              transition-colors duration-200 bg-transparent border-none cursor-pointer
              text-white/40 hover:text-amber-400
            ">
            <span className="hidden sm:inline">Cancel</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
        <div className="hidden lg:flex flex-1 flex-col justify-center space-y-10 py-12 cp-fade-up">

          {/* Decorative line */}
          <div className="h-px w-14 decorative-line"
            style={{ background: "linear-gradient(90deg, #c9a227, transparent)" }} />

          <div className="space-y-4">
            <p className="label-text">
              Shipping Details
            </p>
            <h1 className="
              text-5xl xl:text-6xl font-light leading-[1.1]
              text-white
            " style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}>
              Secure Your<br />
              <span className="cp-shimmer-text font-semibold italic pr-2">Delivery</span>
            </h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Provide your destination coordinates to finalize your premium fashion collection dispatch.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-7">
            {[
              {
                icon: <ShippingIcon />,
                title: "Premium Courier", desc: "Delivery managed by global signature carriers.",
              },
              {
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
                title: "Secured Packaging", desc: "Arrives in signature, climate-controlled brand boxes.",
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
            <div className="absolute top-0 left-0 right-0 h-px card-top-accent cp-border-glow"
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
                  Checkout
                </p>
                <h2 className="text-white text-xl sm:text-2xl font-semibold leading-snug"
                  style={{ letterSpacing: "0.03em" }}>
                  {isEditMode ? "Update Details" : "Shipping Coordinates"}
                </h2>
                <p className="text-white/30 text-xs mt-1.5 leading-relaxed">
                  {isEditMode ? "Modify your address information below." : "Enter your address details where we should ship your order."}
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
                    <span className="text-green-400 font-[Inter,sans-serif]">Address saved successfully! Redirecting...</span>
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

                {/* Full Name */}
                <Field id="fullname" label="Full Name">
                  <input
                    type="text"
                    id="fullname"
                    value={form.fullname}
                    onChange={handleInputChange("fullname")}
                    className="cp-glass-input"
                    placeholder="e.g. Sonu Kumar"
                    disabled={loading || success}
                    required
                  />
                </Field>

                {/* Contact Number */}
                <Field id="contact" label="Contact Number">
                  <input
                    type="tel"
                    id="contact"
                    maxLength={10}
                    value={form.contact}
                    onChange={handleInputChange("contact")}
                    className="cp-glass-input"
                    placeholder="e.g. 9876543210"
                    disabled={loading || success}
                    required
                  />
                </Field>

                {/* House/Flat Number */}
                <Field id="houseNumber" label="House / Flat / Building No.">
                  <input
                    type="text"
                    id="houseNumber"
                    value={form.houseNumber}
                    onChange={handleInputChange("houseNumber")}
                    className="cp-glass-input"
                    placeholder="e.g. Penthouse A, Block 3"
                    disabled={loading || success}
                    required
                  />
                </Field>

                {/* Area / Locality */}
                <Field id="area" label="Area / Colony / Street">
                  <input
                    type="text"
                    id="area"
                    value={form.area}
                    onChange={handleInputChange("area")}
                    className="cp-glass-input"
                    placeholder="e.g. Gold Coast Avenue, Sector 5"
                    disabled={loading || success}
                    required
                  />
                </Field>

                {/* Landmark */}
                <Field id="landmark" label="Landmark (Optional)">
                  <input
                    type="text"
                    id="landmark"
                    value={form.landmark}
                    onChange={handleInputChange("landmark")}
                    className="cp-glass-input"
                    placeholder="e.g. Near Grand Mall"
                    disabled={loading || success}
                  />
                </Field>

                {/* City */}
                <Field id="city" label="City">
                  <input
                    type="text"
                    id="city"
                    value={form.city}
                    onChange={handleInputChange("city")}
                    className="cp-glass-input"
                    placeholder="e.g. Ludhiana"
                    disabled={loading || success}
                    required
                  />
                </Field>

                {/* State & Pincode Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <Field id="state" label="State">
                    <input
                      type="text"
                      id="state"
                      value={form.state}
                      onChange={handleInputChange("state")}
                      className="cp-glass-input"
                      placeholder="e.g. Punjab"
                      disabled={loading || success}
                      required
                    />
                  </Field>

                  <Field id="pincode" label="Pincode">
                    <input
                      type="text"
                      id="pincode"
                      maxLength={6}
                      value={form.pincode}
                      onChange={handleInputChange("pincode")}
                      className="cp-glass-input"
                      placeholder="e.g. 141001"
                      disabled={loading || success}
                      required
                    />
                  </Field>
                </div>

                {/* Address Type Selection */}
                <Field id="addressType" label="Address Type">
                  <select
                    id="addressType"
                    value={form.addressType}
                    onChange={handleInputChange("addressType")}
                    className="cp-glass-input"
                    disabled={loading || success}
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work / Office</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className="
                    gold-btn btn-gold w-full py-3.5 px-6 rounded-lg text-xs font-black
                    flex items-center justify-center gap-2 cursor-pointer
                    transition-all duration-300 select-none
                  "
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    isEditMode ? "Update & Continue" : "Save & Continue"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Address;
