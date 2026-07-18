import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import ThemeToggle from "../../../app/ThemeToggle.jsx";
import { useTheme } from "../../../app/ThemeContext";

/* ─── Scoped styles for Aavran Success Page ─── */
const SuccessGlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,600&family=Inter:wght@100..900&display=swap');
    
    *, *::before, *::after { box-sizing: border-box; }

    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to   { transform: scale(1); opacity: 1; }
    }
    @keyframes checkmark {
      0% { stroke-dashoffset: 50; }
      100% { stroke-dashoffset: 0; }
    }

    .success-enter {
      animation: scaleIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .draw-check {
      stroke-dasharray: 50;
      stroke-dashoffset: 50;
      animation: checkmark 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.2s;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .gold-btn {
      background: linear-gradient(135deg, #c9a227 0%, #ecc246 50%, #c9a227 100%);
      background-size: 200% auto;
      color: #0a0a0f;
      font-weight: 800;
      transition: background-position 0.3s, box-shadow 0.3s, transform 0.2s;
      border: none;
      cursor: pointer;
    }
    .gold-btn:hover {
      background-position: right center;
      box-shadow: 0 8px 28px rgba(201, 162, 39, 0.35);
      transform: translateY(-1px);
    }

    [data-theme="light"] .success-bg {
      background: #F7F4EE !important;
      color: #1C1408 !important;
    }
    [data-theme="light"] .glass-card {
      background: rgba(255, 255, 255, 0.9) !important;
      border-color: rgba(139, 105, 20, 0.15) !important;
      box-shadow: 0 10px 40px rgba(90, 60, 10, 0.07) !important;
    }
    [data-theme="light"] .text-white { color: #1C1408 !important; }
    [data-theme="light"] .text-white\/80 { color: #2C200C !important; }
    [data-theme="light"] .text-white\/50 { color: #5A4520 !important; }
    [data-theme="light"] .text-white\/40 { color: #5A4520 !important; }
    [data-theme="light"] .text-white\/30 { color: #8A6E4C !important; }
    [data-theme="light"] .border-light { border-color: rgba(139, 105, 20, 0.15) !important; }
    [data-theme="light"] .label-text { color: #8B6914 !important; }
    [data-theme="light"] .gold-btn {
      background: #8B6914 !important;
      color: #ffffff !important;
    }
    [data-theme="light"] .gold-btn:hover {
      background: #6B5010 !important;
      box-shadow: 0 8px 28px rgba(139, 105, 20, 0.28) !important;
    }
  `}</style>
);

const DiamondIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 8l9 15 9-15L12 1zm0 2.5L19.2 8.3 12 20.8 4.8 8.3 12 3.5z" />
    <path d="M3 8h18" stroke="currentColor" strokeWidth="0.5" fill="none" />
  </svg>
);

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const orderData = location.state || {};
  const { orderId, paymentId, address, cartSummary, items, isCod } = orderData;

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect to home if accessed directly without state
  if (!orderId) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0f] text-white px-4" style={{ fontFamily: "Inter, sans-serif" }}>
        <p className="text-white/50 text-sm mb-4">No order details found.</p>
        <button onClick={() => navigate("/home")} className="px-6 py-2.5 rounded-lg text-xs font-bold bg-amber-500 text-black">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="success-bg relative min-h-screen w-full overflow-x-hidden flex flex-col justify-between"
      style={{ fontFamily: "Inter, sans-serif", background: "#0a0a0f", color: "#fff" }}>
      
      <SuccessGlobalStyles />

      {/* ── Fixed bg gradients ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 55% at 15% 28%, rgba(201,162,39,0.055) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 45% at 85% 72%, rgba(201,162,39,0.04) 0%, transparent 65%)' }} />
      </div>

      {/* ── Watermark ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, display: 'flex', items: 'center', justifycontent: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
        <span className="watermark-text" style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: 'clamp(72px, 18vw, 22vw)', fontWeight: 900,
          color: 'rgba(201,162,39,0.025)', letterSpacing: '0.22em',
          textTransform: 'uppercase', userSelect: 'none',
        }}>AAVRAN</span>
      </div>

      {/* ── Corner decorative lines ── */}
      <div className="absolute top-20 left-8 w-12 h-12 pointer-events-none z-0 hidden md:block">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-amber-400/50 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-amber-400/50 to-transparent" />
      </div>
      <div className="absolute bottom-20 right-8 w-12 h-12 pointer-events-none z-0 hidden md:block">
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-amber-400/50 to-transparent" />
        <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-amber-400/50 to-transparent" />
      </div>

      {/* ── Header ── */}
      <header
        className="relative sticky top-0 z-50 h-16 flex items-center justify-between px-5 sm:px-8 backdrop-blur-md border-b border-light transition-colors z-20"
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
        <ThemeToggle />
      </header>

      {/* ── Main content ── */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-10 lg:py-16 success-enter">
        
        {/* Confirmation Circle */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-emerald-500/10 border border-emerald-500/30">
            <svg width="30" height="30" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" className="draw-check" />
            </svg>
          </div>
          <p className="label-text text-[10px] uppercase font-bold tracking-[0.25em] mb-2">Order Confirmed</p>
          <h1 className="text-3xl sm:text-4xl font-light text-white leading-tight" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
            Thank You For Your Purchase
          </h1>
          <p className="text-white/50 text-xs mt-2 max-w-md">
            Your ethnic luxury coordinates have been secured. A confirmation email and tracking link will be sent shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Transaction details & Address */}
          <div className="space-y-8">
            {/* Transaction Metadata */}
            <section className="glass-card rounded-2xl p-6 border-light">
              <h3 className="label-text mb-4 pb-2 border-b border-light text-xs font-bold uppercase tracking-wider">
                Transaction Reference
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">Order ID:</span>
                  <span className="text-white font-mono font-semibold">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Payment ID:</span>
                  <span className="text-white font-mono font-semibold">{paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Payment Method:</span>
                  <span className="text-white font-semibold">{isCod ? "Cash on Delivery" : "Razorpay Online"}</span>
                </div>
              </div>
            </section>

            {/* Delivery Address */}
            <section className="glass-card rounded-2xl p-6 border-light">
              <h3 className="label-text mb-4 pb-2 border-b border-light text-xs font-bold uppercase tracking-wider">
                Delivery Address
              </h3>
              {address ? (
                <div className="text-xs space-y-1.5">
                  <p className="text-white font-semibold text-sm">{address.fullname}</p>
                  <p className="text-white/60">{address.contact}</p>
                  <p className="text-white/50 leading-relaxed mt-2">
                    {address.houseNumber}, {address.area}
                    {address.landmark && `, Landmark: ${address.landmark}`}
                    <br />
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <span className="inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 text-amber-400 mt-2">
                    {address.addressType}
                  </span>
                </div>
              ) : (
                <p className="text-white/35 text-xs">Address details not available.</p>
              )}
            </section>
          </div>

          {/* Right Column: Ordered items & Bill details */}
          <div className="space-y-8">
            {/* Ordered Items */}
            <section className="glass-card rounded-2xl p-6 border-light">
              <h3 className="label-text mb-5 pb-2 border-b border-light text-xs font-bold uppercase tracking-wider">
                Items Purchased ({items ? items.length : 0})
              </h3>
              
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
                {items && items.map((item, idx) => {
                  const images = (item.product?.images || []).flatMap((img) =>
                    (img.url || "").split(" ~ ").map((u) => u.trim()).filter(Boolean)
                  );
                  const firstImg = images[0] || "";
                  const itemPrice = item.price?.amount ?? 0;

                  return (
                    <div key={idx} className="flex gap-3 pb-3 border-b border-light/40 last:border-b-0 last:pb-0">
                      <div className="w-12 h-16 bg-white/5 border border-light/50 overflow-hidden flex-shrink-0">
                        {firstImg ? (
                          <img src={firstImg} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-white/20">No Image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-xs truncate">{item.product?.title}</h4>
                        <p className="text-white/40 text-[10px] mt-0.5">Qty: {item.quantity}</p>
                        <p className="text-amber-400 font-bold text-xs mt-1">₹{itemPrice.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Bill Details */}
            <section className="glass-card rounded-2xl p-6 border-light">
              <h3 className="label-text mb-4 pb-2 border-b border-light text-xs font-bold uppercase tracking-wider">
                Payment Summary
              </h3>
              {cartSummary ? (
                <div className="space-y-3 text-xs text-white/40 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">₹{cartSummary.subAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-white">{cartSummary.shipping === 0 ? "FREE" : `₹${cartSummary.shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="text-white">₹{cartSummary.gst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="pt-3 flex justify-between items-center font-bold text-sm text-white border-t border-light/50">
                    <span>Grand Total Paid</span>
                    <span style={{ color: "#c9a227" }} className="text-base">₹{cartSummary.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ) : (
                <p className="text-white/35 text-xs">Summary details not available.</p>
              )}
            </section>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button onClick={() => navigate("/shop")} className="gold-btn px-10 py-3.5 rounded-lg text-[10px] font-black uppercase tracking-[0.25em] shadow-md w-full sm:w-auto">
            Continue Shopping
          </button>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full text-center py-6 text-[10px] uppercase font-bold tracking-widest text-white/20 border-t border-light mt-10">
        © 2026 Aavran Atelier. All Rights Reserved.
      </footer>
    </div>
  );
};

export default OrderSuccess;
