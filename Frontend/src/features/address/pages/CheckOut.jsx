import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useAddress } from "../hooks/use.address.js";
import { useCart } from "../../cart/hooks/useCart";
import { fetchCart } from "../../cart/services/cart.api";
import { useRazorpay } from "react-razorpay";
import ThemeToggle from "../../../app/ThemeToggle.jsx";
import { useTheme } from "../../../app/ThemeContext";

/* ─── Global Styles — Faithful to Aavran Theme ─── */
const CheckoutGlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Inter:wght@100..900&display=swap');
    
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

    .checkout-enter { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
    
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
      transition: all 0.3s ease;
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
    .gold-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

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

    /* Custom Checkbox/Radio */
    .luxury-radio {
      appearance: none;
      background-color: transparent;
      margin: 0;
      font: inherit;
      color: #c9a227;
      width: 1.25em;
      height: 1.25em;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      display: grid;
      place-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .luxury-radio::before {
      content: "";
      width: 0.65em;
      height: 0.65em;
      border-radius: 50%;
      transform: scale(0);
      transition: 120ms transform ease-in-out;
      background-color: currentColor;
    }
    .luxury-radio:checked {
      border-color: #c9a227;
    }
    .luxury-radio:checked::before {
      transform: scale(1);
    }
    .luxury-radio:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(201, 162, 39, 0.2);
    }

    .edit-btn {
      color: rgba(255, 255, 255, 0.6);
      transition: color 0.2s ease;
    }
    .edit-btn:hover {
      color: #ecc246;
    }

    /* ─── Light Mode overrides ─── */
    [data-theme="light"] .checkout-bg {
      background: #F7F4EE !important;
      color: #1C1408 !important;
    }
    [data-theme="light"] .glass-card {
      background: rgba(255, 255, 255, 0.88) !important;
      border-color: rgba(139, 105, 20, 0.18) !important;
      box-shadow: 0 8px 30px rgba(90, 60, 10, 0.08) !important;
    }
    [data-theme="light"] .text-white { color: #1C1408 !important; }
    [data-theme="light"] .text-white\/80 { color: #2C200C !important; }
    [data-theme="light"] .text-white\/60 { color: #5A4520 !important; }
    [data-theme="light"] .text-white\/40 { color: #5A4520 !important; }
    [data-theme="light"] .text-white\/30 { color: #8A6E4C !important; }
    [data-theme="light"] .text-white\/45 { color: #5A4520 !important; }
    [data-theme="light"] .label-text { color: #8B6914 !important; }
    [data-theme="light"] .edit-btn {
      color: #5A4520 !important;
    }
    [data-theme="light"] .edit-btn:hover {
      color: #8B6914 !important;
    }
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
    [data-theme="light"] .border-light {
      border-color: rgba(139, 105, 20, 0.12) !important;
    }
    [data-theme="light"] .luxury-radio {
      border-color: rgba(139, 105, 20, 0.3) !important;
      color: #8B6914 !important;
    }
    [data-theme="light"] .luxury-radio:checked {
      border-color: #8B6914 !important;
    }
  `}</style>
);

const DiamondIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 8l9 15 9-15L12 1zm0 2.5L19.2 8.3 12 20.8 4.8 8.3 12 3.5z" />
    <path d="M3 8h18" stroke="currentColor" strokeWidth="0.5" fill="none" />
  </svg>
);

const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const { handleGetAllAddresses, handleDeleteAddress } = useAddress();
  const { items, handleGetCart, handleClearCart, handleCreateCartOrder, handleVerifyCartOrder } = useCart();
  const { isLoading, Razorpay } = useRazorpay();

  const user = useSelector((state) => state.auth.user);
  const addresses = useSelector((state) => state.address.addresses);

  const [selectedAddrId, setSelectedAddrId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [cartSummary, setCartSummary] = useState({
    subAmount: 0,
    shipping: 0,
    gst: 0,
    total: 0,
  });

  const [loadingCart, setLoadingCart] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load addresses and cart totals
  useEffect(() => {
    const initData = async () => {
      try {
        const addrs = await handleGetAllAddresses();
        if (addrs && addrs.length > 0) {
          const defaultAddr = addrs.find((a) => a.isDefault);
          setSelectedAddrId(defaultAddr ? defaultAddr._id : addrs[0]._id);
        }

        // Get exact totals from backend cart
        const cartData = await fetchCart();
        if (cartData?.cart) {
          setCartSummary({
            subAmount: cartData.cart.subAmount || 0,
            shipping: cartData.cart.shipping || 0,
            gst: cartData.cart.gst || 0,
            total: cartData.cart.total || 0,
          });
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoadingCart(false);
      }
    };

    initData();
    handleGetCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAddress = (id) => {
    setSelectedAddrId(id);
  };

  const handleEditAddress = (addr, e) => {
    e.stopPropagation();
    navigate("/address", { state: { addressToEdit: addr } });
  };

  const handleDeleteAddr = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this address?")) {
      const remaining = await handleDeleteAddress(id);
      if (selectedAddrId === id && remaining && remaining.length > 0) {
        setSelectedAddrId(remaining[0]._id);
      } else if (!remaining || remaining.length === 0) {
        setSelectedAddrId("");
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddrId) {
      setErrorMessage("Please select a delivery address.");
      return;
    }

    setErrorMessage("");
    setPlacingOrder(true);

    try {
      const selectedAddress = addresses.find((a) => a._id === selectedAddrId);

      if (paymentMethod === "razorpay") {
        setStatusMessage("Initializing secure payment gateway...");
        const order = await handleCreateCartOrder();

        if (!order) {
          throw new Error("Failed to create Razorpay order.");
        }

        const options = {
          key: "rzp_test_TESAUuPjzFlnoC", // Shared test key
          amount: order.amount,
          currency: order.currency,
          name: "AAVRAN",
          description: "Premium Fashion Purchase",
          order_id: order.id,
          handler: async (response) => {
            try {
              setStatusMessage("Verifying transaction...");
              const success = await handleVerifyCartOrder(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature
              );
              if (!success) {
                throw new Error("Payment verification failed.");
              }
              const selectedAddress = addresses.find((a) => a._id === selectedAddrId);
              setOrderSuccess(true);
              handleClearCart();
              setStatusMessage("Thank you! Your luxury order has been placed successfully.");
              setTimeout(() => {
                navigate("/order/success", {
                  state: {
                    orderId: response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id,
                    address: selectedAddress,
                    cartSummary,
                    items,
                    isCod: false,
                  },
                });
              }, 1500);
            } catch (err) {
              setErrorMessage(err.response?.data?.message || err.message || "Failed to verify transaction.");
              setStatusMessage("");
            }
          },
          prefill: {
            name: selectedAddress?.fullname || user?.fullname || "Customer",
            email: user?.email || "customer@example.com",
            contact: selectedAddress?.contact || user?.contact || "9999999999",
          },
          theme: {
            color: "#c9a227",
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        // Cash On Delivery Simulation
        setStatusMessage("Securing your COD order...");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const selectedAddress = addresses.find((a) => a._id === selectedAddrId);
        setOrderSuccess(true);
        handleClearCart();
        setStatusMessage("Thank you! Your Cash on Delivery order has been successfully scheduled.");
        setTimeout(() => {
          navigate("/order/success", {
            state: {
              orderId: "COD-" + Math.floor(100000 + Math.random() * 900000),
              paymentId: "CASH_ON_DELIVERY",
              address: selectedAddress,
              cartSummary,
              items,
              isCod: true,
            },
          });
        }, 1500);
      }
    } catch (err) {
      setErrorMessage(err.message || "An error occurred while placing your order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-bg relative min-h-screen w-full overflow-x-hidden flex flex-col justify-between"
      style={{ fontFamily: "Inter, sans-serif", background: "#0a0a0f", color: "#fff" }}>

      <CheckoutGlobalStyles />

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

      {/* ── Header ── */}
      <header
        className="relative sticky top-0 z-50 h-16 flex items-center justify-between px-5 sm:px-8 backdrop-blur-md border-b transition-colors"
        style={{ background: "rgba(10,10,15,0.75)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <Link to="/cart" className="flex items-center gap-2.5 no-underline">
          <div className="w-7 h-7 flex items-center justify-center rounded-sm"
            style={{ background: "linear-gradient(135deg, #c9a227, #ecc246)", color: "#0a0a0f" }}>
            <DiamondIcon size={14} />
          </div>
          <span className="inline-block font-black tracking-[0.22em] uppercase text-sm text-white">
            AAVRAN
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 lg:py-12 checkout-enter">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 mb-6 text-[10px] uppercase tracking-widest text-white/40">
          <Link to="/cart" className="hover:text-amber-400 transition-colors" style={{ color: "inherit", textDecoration: "none" }}>Cart</Link>
          <span>/</span>
          <span className="shimmer-text font-bold">Checkout</span>
        </div>

        {/* Page Title */}
        <div className="mb-10">
          <p className="label-text mb-1">Finalize Order</p>
          <h1 className="text-white text-3xl font-light tracking-wide leading-none " style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
            Luxury <span className="hm-shimmer font-bold italic">Checkout</span>
          </h1>
        </div>

        {loadingCart ? (
          <div className="py-24 text-center text-white/40">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            Loading checkout details...
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* Left Column: Address and Payment */}
            <div className="w-full lg:w-[65%] space-y-10">

              {/* Delivery Address Section */}
              <section className="glass-card cp-card rounded-2xl p-6 sm:p-8 relative overflow-hidden border-light">
                <h2 className="label-text mb-6 pb-3 border-b border-light flex items-center gap-2 text-sm">
                  <span>📍</span> Delivery Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses && addresses.length > 0 ? (
                    addresses.map((addr) => {
                      const isSelected = selectedAddrId === addr._id;
                      return (
                        <div
                          key={addr._id}
                          onClick={() => handleSelectAddress(addr._id)}
                          className={`relative glass-card rounded-xl p-5 border cursor-pointer hover:border-amber-400/50 transition-all ${isSelected ? "border-amber-400/90 shadow-[0_0_15px_rgba(201,162,39,0.12)]" : "border-light"
                            }`}
                        >
                          {/* Accent bar for selected address */}
                          {isSelected && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#c9a227]" />
                          )}

                          {/* Absolute positioned Delete Icon */}
                          <button
                            onClick={(e) => handleDeleteAddr(addr._id, e)}
                            className="absolute top-4 right-4 text-red-400/70 hover:text-red-400 transition-colors p-1"
                            title="Delete Address"
                          >
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>

                          <div className="flex justify-between items-start mb-2 pr-8">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 text-amber-400">
                              {addr.addressType || "Home"}
                            </span>
                            {isSelected && (
                              <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                                ✓ Active
                              </span>
                            )}
                          </div>

                          <p className="text-white font-semibold text-sm mb-1">{addr.fullname}</p>
                          <p className="text-white/60 text-xs mb-3">{addr.contact}</p>
                          <p className="text-white/50 text-xs leading-relaxed">
                            {addr.houseNumber}, {addr.area}
                            {addr.landmark && `, Landmark: ${addr.landmark}`}
                            <br />
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>

                          <div className="flex gap-4 mt-4 pt-3 border-t border-light text-[10px] uppercase font-bold tracking-wider">
                            <button
                              onClick={(e) => handleEditAddress(addr, e)}
                              className="edit-btn"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-center py-6 text-white/40 text-xs">
                      No addresses saved. Please add a shipping address to place your order.
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-light">
                  <button
                    onClick={() => navigate("/address")}
                    className="ghost-btn w-full py-3.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    + Add New Address
                  </button>
                </div>
              </section>

              {/* Payment Method Section */}
              <section className="glass-card cp-card rounded-2xl p-6 sm:p-8 relative overflow-hidden border-light">
                <h2 className="label-text mb-6 pb-3 border-b border-light flex items-center gap-2 text-sm">
                  <span>💳</span> Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Razorpay */}
                  <label className={`glass-card rounded-xl p-5 border cursor-pointer flex items-center justify-between hover:border-amber-400/50 transition-all ${paymentMethod === "razorpay" ? "border-amber-400/90" : "border-light"
                    }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "razorpay"}
                        onChange={() => setPaymentMethod("razorpay")}
                        className="luxury-radio"
                      />
                      <div>
                        <span className="text-white font-semibold text-xs tracking-wider block">Razorpay Gateway</span>
                        <span className="text-white/30 text-[10px] tracking-wide">Cards, UPI, NetBanking</span>
                      </div>
                    </div>
                  </label>

                  {/* COD */}
                  <label className={`glass-card rounded-xl p-5 border flex items-center justify-between opacity-40 cursor-not-allowed border-light`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={false}
                        disabled={true}
                        className="luxury-radio opacity-50 cursor-not-allowed"
                      />
                      <div>
                        <span className="text-white font-semibold text-xs tracking-wider block">Cash On Delivery</span>
                        <span className="text-white/30 text-[10px] tracking-wide">Pay on delivery (COD) — Coming Soon</span>
                      </div>
                    </div>
                    <span className="text-red-400 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 border border-red-500/20 rounded bg-red-500/5 ml-auto">
                      Coming Soon
                    </span>
                  </label>
                </div>
              </section>
            </div>

            {/* Right Column: Order Summary & Place Order */}
            <div className="w-full lg:w-[35%] lg:sticky lg:top-24">
              <div className="absolute -inset-4 rounded-3xl pointer-events-none z-0"
                style={{ background: "radial-gradient(ellipse at center, rgba(201,162,39,0.06) 0%, transparent 75%)", filter: "blur(12px)" }} />

              <div className="glass-card cp-card rounded-2xl p-6 sm:p-7 relative overflow-hidden z-10 border-light"
                style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>

                {/* Top gold accent line */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent 0%, #c9a227 30%, #ecc246 50%, #c9a227 70%, transparent 100%)" }} />

                <h2 className="label-text mb-5 pb-3 border-b border-light">
                  Order Summary
                </h2>

                <div className="space-y-4 text-xs sm:text-sm text-white/40 mb-6 font-medium">
                  <div className="flex justify-between items-center">
                    <span>Items ({items ? items.length : 0})</span>
                    <span className="text-white font-bold">₹{cartSummary.subAmount.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-white font-bold">
                      {cartSummary.shipping === 0 ? (
                        <span className="text-amber-400 uppercase tracking-widest text-[10px]">FREE</span>
                      ) : (
                        `₹${cartSummary.shipping}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>GST (18%)</span>
                    <span className="text-white font-bold">₹{cartSummary.gst.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="pt-4 flex justify-between items-center font-bold text-base text-white border-t border-light">
                    <span>Grand Total</span>
                    <span style={{ color: "#c9a227" }}>₹{cartSummary.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Status/Error Messages */}
                {errorMessage && (
                  <div className="mb-4 p-3 rounded text-[11px] leading-relaxed bg-red-950/40 border border-red-500/20 text-red-400">
                    ⚠️ {errorMessage}
                  </div>
                )}

                {statusMessage && (
                  <div className="mb-4 p-3 rounded text-[11px] leading-relaxed bg-amber-950/20 border border-amber-500/10 text-amber-400">
                    ✨ {statusMessage}
                  </div>
                )}

                {/* Place Order CTA Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || orderSuccess || items.length === 0}
                  className="gold-btn w-full py-3.5 px-6 rounded-lg text-xs font-black flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                >
                  {placingOrder ? (
                    <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                  ) : orderSuccess ? (
                    "Order Placed! ✓"
                  ) : (
                    "Place Order"
                  )}
                </button>

                <p className="text-[10px] text-center text-white/30 mt-4 leading-relaxed flex items-center justify-center gap-1.5">
                  🛡️ Secure checkout powered by SSL encryption
                </p>

                {/* Bottom gold accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.3) 50%, transparent 100%)" }} />
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center border-t border-light"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-white/20 text-[9px] tracking-[0.22em] uppercase">
          © 2026 Aavran Fashion · All rights reserved
        </p>
      </footer>
    </div>
  );
};

export default CheckOut;
