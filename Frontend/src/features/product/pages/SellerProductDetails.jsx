import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useSearchParams, useNavigate } from "react-router";
import { useProduct } from "../hooks/use.product";
import ThemeToggle from "../../../app/ThemeToggle.jsx";
import AccountDropDown from "../../shared/components/AccountDropDown.jsx";

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

    .spd-fade-up { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both; }

    .shimmer-text {
      background: linear-gradient(90deg, #c9a227 0%, #f5e6c8 40%, #ecc246 60%, #c9a227 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    .spd-glass {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .spd-gold-btn {
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
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    .spd-gold-btn:hover {
      background-position: right center;
      box-shadow: 0 8px 28px rgba(201,162,39,0.4);
      transform: translateY(-1px);
    }

    .spd-ghost-btn {
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
    .spd-ghost-btn:hover {
      border-color: rgba(201,162,39,0.6);
      background: rgba(201,162,39,0.08);
      color: #c9a227;
    }

    .spd-glass-input {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.15);
      color: #fff;
      transition: all 0.25s ease;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      width: 100%;
      padding: 10px 14px;
      border-radius: 6px;
      outline: none;
    }
    .spd-glass-input::placeholder { color: rgba(255,255,255,0.28); }
    .spd-glass-input:focus {
      outline: none;
      border-color: #c9a227;
      background: rgba(201,162,39,0.1);
    }
    .spd-glass-input option { background: #0a0a0f; color: #fff; }

    .spd-upload-zone {
      border: 1.5px dashed rgba(255,255,255,0.15);
      background: rgba(255,255,255,0.04);
      transition: border-color 0.25s ease, background 0.25s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .spd-upload-zone:hover {
      border-color: rgba(201,162,39,0.55);
      background: rgba(201,162,39,0.05);
    }

    /* ─── Light mode overrides ─── */
    [data-theme="light"] .spd-page-bg { background: #F7F4EE !important; }
    [data-theme="light"] .spd-glass {
      background: rgba(255,255,255,0.88) !important;
      border-color: rgba(139,105,20,0.14) !important;
      box-shadow: 0 4px 40px rgba(90,60,10,0.10) !important;
    }
    [data-theme="light"] .spd-text-main { color: #1C1408 !important; }
    [data-theme="light"] .spd-text-muted { color: #7A6040 !important; }
    [data-theme="light"] .spd-border { border-color: rgba(139,105,20,0.15) !important; }
    [data-theme="light"] .spd-divider { background: rgba(139,105,20,0.12) !important; }
    [data-theme="light"] .spd-img-box { background: #ECE8E0 !important; }
    [data-theme="light"] .spd-ghost-btn {
      border-color: rgba(139,105,20,0.3) !important;
      color: #5A4520 !important;
    }
    [data-theme="light"] .spd-ghost-btn:hover {
      border-color: #8B6914 !important;
      background: rgba(139,105,20,0.06) !important;
      color: #8B6914 !important;
    }
    [data-theme="light"] .spd-gold-btn {
      background: #8B6914 !important;
      color: #fff !important;
    }
    [data-theme="light"] .spd-gold-btn:hover {
      background: #6B5010 !important;
      box-shadow: 0 8px 28px rgba(139,105,20,0.30) !important;
    }
    [data-theme="light"] .spd-attr-box {
      background: rgba(247,244,238,0.9) !important;
      border-color: rgba(139,105,20,0.12) !important;
    }
    [data-theme="light"] .spd-back-btn {
      color: #5A4520 !important;
      border-color: rgba(139,105,20,0.2) !important;
    }
    [data-theme="light"] .spd-back-btn:hover {
      color: #8B6914 !important;
      border-color: #8B6914 !important;
    }
    [data-theme="light"] .spd-glass-input {
      background: rgba(28,20,8,0.04);
      border: 1px solid rgba(139,105,20,0.2);
      color: #1C1408;
    }
    [data-theme="light"] .spd-glass-input::placeholder { color: rgba(28,20,8,0.4); }
    [data-theme="light"] .spd-glass-input:focus {
      background: rgba(139,105,20,0.05);
      border-color: #8B6914;
    }
    [data-theme="light"] .spd-glass-input option { background: #fff; color: #1C1408; }
    [data-theme="light"] .spd-upload-zone {
      border: 1.5px dashed rgba(139,105,20,0.25);
      background: rgba(28,20,8,0.02);
    }
    [data-theme="light"] .spd-upload-zone:hover {
      border-color: #8B6914;
      background: rgba(139,105,20,0.05);
    }
    [data-theme="light"] .spd-variant-card {
      background: #fff !important;
      border-color: rgba(139,105,20,0.12) !important;
    }
    [data-theme="light"] .spd-header {
      background: rgba(247,244,238,0.92) !important;
      border-color: rgba(139,105,20,0.12) !important;
    }
  `}</style>
);

/* ─── SVG Icons ─── */
const DiamondIcon = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 8l9 15 9-15L12 1zm0 2.5L19.2 8.3 12 20.8 4.8 8.3 12 3.5z" />
        <path d="M3 8h18" stroke="currentColor" strokeWidth="0.5" fill="none" />
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

const PersonIcon = () => (
    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
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

const TrashIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const PlusIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

/* ─── Image Gallery ─── */
const ImageGallery = ({ images }) => {
    const [activeIdx, setActiveIdx] = useState(0);
    const allUrls = (images || []).flatMap((img) =>
        (img.url || "").split(" ~ ").map((u) => u.trim()).filter(Boolean)
    );
    const prev = () => setActiveIdx((i) => (i - 1 + allUrls.length) % allUrls.length);
    const next = () => setActiveIdx((i) => (i + 1) % allUrls.length);

    return (
        <div style={{ display: "flex", gap: 12, width: "100%" }}>
            {/* Thumbnail strip */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                {allUrls.length === 0
                    ? [0, 1, 2].map((i) => (
                        <div key={i} style={{ width: 56, height: 72, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.05)" }} />
                    ))
                    : allUrls.slice(0, 5).map((url, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIdx(i)}
                            style={{
                                width: 56, height: 72, overflow: "hidden", padding: 0, cursor: "pointer",
                                border: activeIdx === i ? "2px solid #c9a227" : "2px solid transparent",
                                opacity: activeIdx === i ? 1 : 0.6, background: "none",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <img src={url} alt={`Thumb ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </button>
                    ))}
            </div>
            {/* Main image */}
            <div className="spd-img-box" style={{ position: "relative", flex: 1, overflow: "hidden", aspectRatio: "3/4", background: "rgba(255,255,255,0.02)", minHeight: 320 }}>
                {allUrls.length > 0 ? (
                    <img src={allUrls[activeIdx]} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.2 }}>No Image</span>
                    </div>
                )}
                {allUrls.length > 1 && (
                    <>
                        <button onClick={prev} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>
                            <ChevronLeftIcon />
                        </button>
                        <button onClick={next} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>
                            <ChevronRightIcon />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

/* ─── Skeleton Loading ─── */
const SkeletonDetail = () => (
    <div style={{ maxWidth: 1140, margin: "0 auto", padding: "32px 16px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
            <div style={{ display: "flex", gap: 12, flex: "1 1 50%", minWidth: 280 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[0, 1, 2].map((i) => <div key={i} style={{ width: 56, height: 72, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />)}
                </div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", aspectRatio: "3/4", borderRadius: 4 }} />
            </div>
            <div style={{ flex: "1 1 40%", display: "flex", flexDirection: "column", gap: 16, minWidth: 280 }}>
                <div style={{ height: 16, width: 80, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
                <div style={{ height: 32, width: "75%", background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
                <div style={{ height: 20, width: "33%", background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
                <div style={{ height: 16, width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
                <div style={{ height: 44, width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
            </div>
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const SellerProductDetails = () => {
    const { id } = useParams();
    const { handleGetProductDetail, handleAddVariants } = useProduct();
    const product = useSelector((state) => state.product.productDetail);
    const loading = useSelector((state) => state.product.loading);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const [mounted, setMounted] = useState(false);
    const [showAddVariant, setShowAddVariant] = useState(false);
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);

    // Variant form states
    const [vPrice, setVPrice] = useState("");
    const [vStock, setVStock] = useState("0");
    const [vColor, setVColor] = useState("");
    const [vSize, setVSize] = useState("");
    const [vImages, setVImages] = useState([]);
    const [vAttributes, setVAttributes] = useState([{ key: "", value: "" }]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState(false);

    const fileInputRef = useRef(null);
    const MAX_IMAGES = 5;

    useEffect(() => {
        setMounted(true);
        handleGetProductDetail(id);
        if (searchParams.get("addVariant") === "true") {
            setShowAddVariant(true);
        }
    }, [id]);

    // Image upload helpers
    const addImages = useCallback(
        (files) => {
            const remaining = MAX_IMAGES - vImages.length;
            const toAdd = Array.from(files).slice(0, remaining);
            setVImages((prev) => [
                ...prev,
                ...toAdd.map((file) => ({ file, preview: URL.createObjectURL(file) })),
            ]);
        },
        [vImages.length]
    );

    const removeImage = (idx) => {
        setVImages((prev) => {
            URL.revokeObjectURL(prev[idx].preview);
            return prev.filter((_, i) => i !== idx);
        });
    };

    // Dynamic attribute key-value management
    const addAttrField = () => setVAttributes([...vAttributes, { key: "", value: "" }]);
    const removeAttrField = (idx) => setVAttributes(vAttributes.filter((_, i) => i !== idx));
    const changeAttrField = (idx, field, val) => {
        const updated = [...vAttributes];
        updated[idx][field] = val;
        setVAttributes(updated);
    };

    // Submit handler
    const handleSaveVariant = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess(false);

        if (!vColor.trim()) {
            setFormError("Please enter a color for this variant.");
            return;
        }
        if (!vSize.trim()) {
            setFormError("Please enter a size for this variant.");
            return;
        }
        if (vStock === "" || Number(vStock) < 0) {
            setFormError("Please enter a valid stock quantity.");
            return;
        }

        const attrObj = {};
        vAttributes.forEach(({ key, value }) => {
            if (key.trim() && value.trim()) attrObj[key.trim()] = value.trim();
        });

        setSubmitLoading(true);
        try {
            const fd = new FormData();
            if (vPrice) fd.append("price", vPrice);
            fd.append("stock", vStock);
            fd.append("color", vColor);
            fd.append("size", vSize);
            fd.append("attributes", JSON.stringify(attrObj));
            vImages.forEach(({ file }) => fd.append("images", file));

            const res = await handleAddVariants(id, fd);
            if (res) {
                setFormSuccess(true);
                setVPrice("");
                setVStock("0");
                setVColor("");
                setVSize("");
                vImages.forEach((img) => URL.revokeObjectURL(img.preview));
                setVImages([]);
                setVAttributes([{ key: "", value: "" }]);
                setShowAddVariant(false);
                handleGetProductDetail(id);
            }
        } catch (err) {
            setFormError(err?.response?.data?.message || "Failed to add variant.");
        } finally {
            setSubmitLoading(false);
        }
    };

    // Derived values
    const price = product?.price?.amount ?? 0;
    const currency = product?.price?.currency ?? "INR";
    const symbol = currency === "INR" ? "₹" : "$";

    // Build attribute list (show only what exists)
    const attrs = [];
    if (product?.material) attrs.push({ icon: <FabricIcon />, label: "Fabric", value: product.material });
    if (product?.work) attrs.push({ icon: <SparkleIcon />, label: "Work", value: product.work });
    if (product?.occasion) attrs.push({ icon: <OccasionIcon />, label: "Occasion", value: product.occasion });
    if (product?.length) attrs.push({ icon: <LengthIcon />, label: "Length", value: product.length });

    // Build product spec list (show only what exists)
    const details = [];
    if (product?.sku) details.push(["SKU", product.sku]);
    if (product?.material) details.push(["Material", product.material]);
    if (product?.countryOfOrigin) details.push(["Country of Origin", product.countryOfOrigin]);
    if (product?.care) details.push(["Care Instructions", product.care]);
    if (product?.packageContents) details.push(["Package Contents", product.packageContents]);

    /* ─── RENDER ─── */
    return (
        <div
            className="spd-page-bg"
            style={{
                minHeight: "100vh",
                fontFamily: "'Inter', sans-serif",
                background: "#0a0a0f",
                color: "#fff",
                transition: "background 0.3s ease, color 0.3s ease",
            }}
        >
            <GlobalStyles />

            {/* ══ HEADER ══ */}
            <header
                className="spd-header"
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 40px",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    background: "rgba(10,10,15,0.85)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                <Link to="/seller/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#c9a227,#ecc246)", color: "#0a0a0f" }}>
                        <DiamondIcon size={12} />
                    </div>
                    <span className="shimmer-text" style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" }}>AAVRAN</span>
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <ThemeToggle />
                    <div className="relative">
                        <div
                            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                            style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#c9a227,#ecc246)", color: "#0a0a0f", cursor: "pointer" }}
                            className="flex items-center justify-center"
                        >
                            <PersonIcon />
                        </div>
                        {showAccountDropdown && (
                            <AccountDropDown user={user} onClose={() => setShowAccountDropdown(false)} />
                        )}
                    </div>
                </div>
            </header>

            {/* ══ MAIN ══ */}
            {loading && !product ? (
                <SkeletonDetail />
            ) : (
                <main
                    className={mounted ? "spd-fade-up" : ""}
                    style={{ maxWidth: 1140, margin: "0 auto", padding: "32px 16px", opacity: mounted ? 1 : 0 }}
                >
                    {/* Back link */}
                    <Link
                        to="/seller/dashboard"
                        className="spd-back-btn"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 24,
                            fontSize: 12,
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.5)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            padding: "6px 12px",
                            textDecoration: "none",
                            borderRadius: 4,
                            transition: "all 0.2s ease",
                        }}
                    >
                        <ChevronLeftIcon /> Back to Dashboard
                    </Link>

                    {/* Two column layout */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 56 }}>
                        {/* Left: Gallery */}
                        <div style={{ flex: "1 1 50%", minWidth: 280 }}>
                            <ImageGallery images={product?.images || []} />
                        </div>

                        {/* Right: Product Info */}
                        <div style={{ flex: "1 1 40%", minWidth: 280 }}>
                            {/* Badge */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <span
                                    className="spd-glass"
                                    style={{
                                        fontSize: 10,
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                        letterSpacing: "0.1em",
                                        padding: "2px 8px",
                                        borderRadius: 4,
                                        color: "#c9a227",
                                        border: "1px solid rgba(201,162,39,0.2)",
                                    }}
                                >
                                    Seller View
                                </span>
                            </div>

                            {/* Title */}
                            <h1
                                className="spd-text-main"
                                style={{
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontSize: "clamp(22px, 4vw, 32px)",
                                    fontWeight: 300,
                                    lineHeight: 1.2,
                                    color: "#fff",
                                    margin: "0 0 8px 0",
                                }}
                            >
                                {product?.title || "Product Title"}
                            </h1>

                            {/* Price */}
                            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                                <span className="spd-text-main" style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "#c9a227" }}>
                                    {symbol}{price.toLocaleString("en-IN")}
                                </span>
                                <span className="spd-text-muted" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Base Price</span>
                            </div>

                            {/* Divider */}
                            <div className="spd-divider" style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "16px 0" }} />

                            {/* Description */}
                            <p className="spd-text-muted" style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 20, maxWidth: 460, color: "rgba(255,255,255,0.6)" }}>
                                {product?.description}
                            </p>

                            {/* Attributes (only available ones) */}
                            {attrs.length > 0 && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                                    {attrs.map(({ icon, label, value }) => (
                                        <div
                                            key={label}
                                            className="spd-attr-box"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                                padding: "12px 16px",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                                background: "rgba(255,255,255,0.02)",
                                                borderRadius: 4,
                                            }}
                                        >
                                            <span style={{ color: "#c9a227" }}>{icon}</span>
                                            <div>
                                                <p className="spd-text-muted" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>{label}</p>
                                                <p className="spd-text-main" style={{ fontSize: 12, fontWeight: 600, margin: "2px 0 0 0" }}>{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* CTA: Add Variant */}
                            <button
                                onClick={() => setShowAddVariant((v) => !v)}
                                className="spd-gold-btn"
                                style={{ width: "100%", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 48 }}
                            >
                                <PlusIcon />
                                {showAddVariant ? "Cancel Add Variant" : "Add Variant"}
                            </button>

                            {/* ── Add Variant Form ── */}
                            {showAddVariant && (
                                <div
                                    className="spd-glass spd-variant-card"
                                    style={{ marginTop: 24, padding: 20, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}
                                >
                                    <h3 style={{ color: "#c9a227", fontSize: 14, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px 0" }}>
                                        New Variant Configuration
                                    </h3>

                                    <form onSubmit={handleSaveVariant}>
                                        {formError && (
                                            <div style={{ color: "#f87171", fontSize: 12, padding: "8px 12px", border: "1px solid rgba(248,113,113,0.2)", background: "rgba(248,113,113,0.05)", borderRadius: 4, marginBottom: 12 }}>
                                                {formError}
                                            </div>
                                        )}
                                        {formSuccess && (
                                            <div style={{ color: "#4ade80", fontSize: 12, padding: "8px 12px", border: "1px solid rgba(74,222,128,0.2)", background: "rgba(74,222,128,0.05)", borderRadius: 4, marginBottom: 12 }}>
                                                Variant saved successfully!
                                            </div>
                                        )}

                                        {/* Price & Stock */}
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                                            <div>
                                                <label className="spd-text-muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                                                    Variant Price ({symbol})
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder={`${price} (default)`}
                                                    value={vPrice}
                                                    onChange={(e) => setVPrice(e.target.value)}
                                                    className="spd-glass-input"
                                                />
                                            </div>
                                            <div>
                                                <label className="spd-text-muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                                                    Stock Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={vStock}
                                                    onChange={(e) => setVStock(e.target.value)}
                                                    className="spd-glass-input"
                                                />
                                            </div>
                                        </div>

                                        {/* Color & Size */}
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                                            <div>
                                                <label className="spd-text-muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                                                    Variant Color
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. Red"
                                                    value={vColor}
                                                    onChange={(e) => setVColor(e.target.value)}
                                                    className="spd-glass-input"
                                                />
                                            </div>
                                            <div>
                                                <label className="spd-text-muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                                                    Variant Size
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. L"
                                                    value={vSize}
                                                    onChange={(e) => setVSize(e.target.value)}
                                                    className="spd-glass-input"
                                                />
                                            </div>
                                        </div>

                                        {/* Image uploads */}
                                        <div style={{ marginBottom: 16 }}>
                                            <label className="spd-text-muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                                                Variant Images ({vImages.length}/{MAX_IMAGES})
                                            </label>
                                            <div
                                                onClick={() => vImages.length < MAX_IMAGES && fileInputRef.current?.click()}
                                                className="spd-upload-zone"
                                                style={{ padding: 16, borderRadius: 6, textAlign: "center" }}
                                            >
                                                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24" style={{ opacity: 0.4, color: "#c9a227" }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0-3 3m3-3 3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                                </svg>
                                                <p className="spd-text-muted" style={{ fontSize: 12, marginTop: 6 }}>
                                                    Drag & drop or <span style={{ color: "#c9a227", fontWeight: 500 }}>browse</span>
                                                </p>
                                            </div>
                                            <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => addImages(e.target.files)} />

                                            {/* Preview strip */}
                                            {vImages.length > 0 && (
                                                <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto", paddingBottom: 4 }}>
                                                    {vImages.map((img, idx) => (
                                                        <div key={idx} style={{ position: "relative", width: 48, height: 64, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
                                                            <img src={img.preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(idx)}
                                                                style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center" }}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Dynamic Attributes */}
                                        <div style={{ marginBottom: 16 }}>
                                            <label className="spd-text-muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                                                Attributes (e.g. Size, Color, Fit)
                                            </label>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                {vAttributes.map((attr, idx) => (
                                                    <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                        <input type="text" placeholder="Name (e.g. Size)" value={attr.key} onChange={(e) => changeAttrField(idx, "key", e.target.value)} className="spd-glass-input" style={{ flex: 1 }} />
                                                        <input type="text" placeholder="Value (e.g. XL)" value={attr.value} onChange={(e) => changeAttrField(idx, "value", e.target.value)} className="spd-glass-input" style={{ flex: 1 }} />
                                                        <button type="button" onClick={() => removeAttrField(idx)} style={{ padding: 8, border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", background: "transparent", borderRadius: 4, cursor: "pointer", flexShrink: 0 }}>
                                                            <TrashIcon />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button type="button" onClick={addAttrField} className="spd-ghost-btn" style={{ marginTop: 10, padding: "6px 12px", borderRadius: 4, fontSize: 10 }}>
                                                + Add Attribute Key/Value
                                            </button>
                                        </div>

                                        <button type="submit" disabled={submitLoading} className="spd-gold-btn" style={{ width: "100%", padding: "12px 24px", marginTop: 16 }}>
                                            {submitLoading ? "Publishing Variant..." : "Publish Variant"}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Bottom Section: Details & Variants ── */}
                    <div style={{ marginTop: 48 }}>
                        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 0, marginBottom: 24 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", color: "#c9a227", borderBottom: "2px solid #c9a227", paddingBottom: 10, display: "inline-block" }}>
                                Detailed Inventory & Variants
                            </span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                            {/* Left: Product Specs */}
                            <div>
                                <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(201,162,39,0.8)", margin: "0 0 16px 0" }}>
                                    Product Metadata (Available only)
                                </h3>
                                {details.length === 0 ? (
                                    <p className="spd-text-muted" style={{ fontSize: 12 }}>No specifications set for this product.</p>
                                ) : (
                                    details.map(([k, v]) => (
                                        <div key={k} style={{ display: "flex", gap: 16, fontSize: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                            <span className="spd-text-muted" style={{ width: 144, flexShrink: 0 }}>{k}</span>
                                            <span className="spd-text-main" style={{ fontWeight: 500 }}>{v}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Right: Existing Variants */}
                            <div>
                                <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(201,162,39,0.8)", margin: "0 0 16px 0" }}>
                                    Published Variants ({product?.variants?.length || 0})
                                </h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    {!product?.variants || product.variants.length === 0 ? (
                                        <div style={{ padding: 24, borderRadius: 4, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", textAlign: "center" }}>
                                            <p className="spd-text-muted" style={{ fontSize: 12, margin: 0 }}>No variants published yet.</p>
                                        </div>
                                    ) : (
                                        product.variants.map((v, idx) => {
                                            const vUrls = (v.images || []).flatMap((img) =>
                                                (img.url || "").split(" ~ ").map((u) => u.trim()).filter(Boolean)
                                            );
                                            return (
                                                <div
                                                    key={v._id || idx}
                                                    className="spd-variant-card"
                                                    style={{
                                                        display: "flex",
                                                        gap: 16,
                                                        padding: 12,
                                                        borderRadius: 4,
                                                        border: "1px solid rgba(255,255,255,0.06)",
                                                        background: "rgba(255,255,255,0.02)",
                                                    }}
                                                >
                                                    <div style={{ width: 48, height: 64, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
                                                        {vUrls.length > 0 ? (
                                                            <img src={vUrls[0]} alt="variant" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                                        ) : (
                                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyCenter: "center", opacity: 0.25 }}>
                                                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                            <span className="spd-text-main" style={{ fontWeight: 600, fontSize: 14 }}>
                                                                {symbol}{(v.price || price).toLocaleString("en-IN")}
                                                            </span>
                                                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: v.stock > 0 ? "#4ade80" : "#f87171" }}>
                                                                {v.stock > 0 ? `Stock: ${v.stock}` : "Out of Stock"}
                                                            </span>
                                                        </div>
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                                                            <span className="spd-glass spd-text-muted" style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)" }}>
                                                                color: {v.color}
                                                            </span>
                                                            <span className="spd-glass spd-text-muted" style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)" }}>
                                                                size: {v.size}
                                                            </span>
                                                            {v.attributes && Object.entries(v.attributes).map(([key, val]) => (
                                                                <span
                                                                    key={key}
                                                                    className="spd-glass spd-text-muted"
                                                                    style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)" }}
                                                                >
                                                                    {key}: {val}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}

            {/* ══ FOOTER ══ */}
            <footer
                style={{
                    marginTop: 64,
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    padding: "24px 0",
                    textAlign: "center",
                    color: "rgba(255,255,255,0.25)",
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                }}
            >
                © 2026 Aavran Fashion · All rights reserved
            </footer>
        </div>
    );
};

export default SellerProductDetails;