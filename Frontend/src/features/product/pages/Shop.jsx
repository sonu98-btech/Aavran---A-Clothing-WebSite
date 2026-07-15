import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useProduct } from '../hooks/use.product'
import { useSelector } from 'react-redux'
import ThemeToggle from '../../../app/ThemeToggle.jsx'
import { Link } from 'react-router'

/* ─── Icon Components ───────────────────────────────────────── */
const DiamondIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 8l9 15 9-15L12 1zm0 2.5L19.2 8.3 12 20.8 4.8 8.3 12 3.5z" />
    <path d="M3 8h18" stroke="currentColor" strokeWidth="0.5" fill="none" />
  </svg>
)

const SearchIcon = ({ size = 16 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
)

const CartIcon = ({ size = 15 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
)

const PersonIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
)

const HeartIcon = ({ filled = false }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
)

const CloseIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const FilterIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
  </svg>
)

/* ─── FilterSidebar (shared between desktop & mobile drawer) ── */
const FilterSidebar = ({
  categories, selectedCategory, setSelectedCategory,
  sizes, selectedSize, setSelectedSize,
  maxPrice, setMaxPrice,
  colors, selectedColor, setSelectedColor,
  onApply,
}) => (
  <div className="space-y-7">
    {/* FILTER heading */}
    <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b6914] dark:text-[#c9a227] pb-2 border-b border-[#8b6914]/15 dark:border-white/10">
      Filter
    </h3>

    {/* Category */}
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#1c1408]/50 dark:text-white/50 mb-3">Category</p>
      <ul className="space-y-[9px]">
        {categories.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => { setSelectedCategory(cat); onApply && onApply() }}
              className={`text-[13px] leading-none transition-colors hover:text-[#8b6914] dark:hover:text-[#c9a227] ${selectedCategory === cat
                ? 'text-[#8b6914] dark:text-[#c9a227] font-semibold'
                : 'text-[#1c1408]/75 dark:text-white/60'
                }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </div>

    {/* Size */}
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#1c1408]/50 dark:text-white/50 mb-3">Size</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((sz) => (
          <button
            key={sz}
            onClick={() => { setSelectedSize(sz); onApply && onApply() }}
            className={`h-8 min-w-[36px] px-2.5 border text-[10px] font-semibold tracking-wider uppercase transition-all ${selectedSize === sz
              ? 'border-[#8b6914] bg-[#8b6914]/8 text-[#8b6914] dark:border-[#c9a227] dark:text-[#c9a227] dark:bg-[#c9a227]/10'
              : 'border-[#8b6914]/20 dark:border-white/10 text-[#1c1408]/60 dark:text-white/55 hover:border-[#8b6914] dark:hover:border-[#c9a227]'
              }`}
          >
            {sz}
          </button>
        ))}
      </div>
    </div>

    {/* Price */}
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#1c1408]/50 dark:text-white/50 mb-3">Price</p>
      <input
        type="range" min="412" max="9999" step="100"
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        className="w-full h-[3px] rounded-full accent-[#8b6914] dark:accent-[#c9a227] mb-2"
      />
      <div className="flex justify-between text-[11px] text-[#1c1408]/55 dark:text-white/45">
        <span>₹999</span>
        <span className="font-semibold text-[#8b6914] dark:text-[#c9a227]">₹{maxPrice.toLocaleString('en-IN')}</span>
      </div>
    </div>

    {/* Color */}
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#1c1408]/50 dark:text-white/50 mb-3">Color</p>
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <button
            key={c.name}
            title={c.name}
            onClick={() => { setSelectedColor(c.name); onApply && onApply() }}
            className={`color-swatch w-6 h-6 transition-all hover:scale-110 ${selectedColor === c.name
              ? 'ring-2 ring-offset-1 ring-[#8b6914] dark:ring-[#c9a227] dark:ring-offset-[#0a0a0f] scale-110'
              : ''
              }`}
            style={{ backgroundColor: c.hex || 'transparent', border: c.hex ? '1px solid rgba(139, 105, 20, 0.25)' : '1.5px dashed rgba(139, 105, 20, 0.3)' }}
          >
            {!c.hex && (
              <span className="text-[7px] font-bold uppercase text-[#8b6914]/70 dark:text-[#c9a227]/70">All</span>
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
)

/* ─── Product Card ───────────────────────────────────────────── */
const ProductCard = ({ product, wishlisted, onToggleWishlist }) => {
  const [imgIndex, setImgIndex] = useState(0)
  // images is an array of objects; each object has a `url` field with `~`-separated URLs
  const allImageUrls = (product.images || []).flatMap(img =>
    (img.url || '').split(' ~ ').map(u => u.trim()).filter(Boolean)
  )
  const images = allImageUrls
  const price = product.price?.amount ?? 0

  return (
    <article
      className="group flex flex-col cursor-pointer"
      onMouseEnter={() => images.length > 1 && setImgIndex(1)}
      onMouseLeave={() => setImgIndex(0)}
    >
      {/* ── Image box ── */}
      <div className="relative overflow-hidden bg-[#ece8e0] dark:bg-[#14141e] aspect-[3/4]">
        {images.length > 0 ? (
          <>
            {/* primary */}
            <img
              src={images[0]}
              alt={product.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgIndex === 0 ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* secondary (hover) */}
            {images[1] && (
              <img
                src={images[1]}
                alt={product.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgIndex === 1 ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-[#1c1408]/20 dark:text-white/20 text-xs tracking-widest uppercase">
            No Image
          </div>
        )}

        {/* Wishlist heart button */}
        <button
          onClick={(e) => { e.preventDefault(); onToggleWishlist(product._id) }}
          aria-label="Toggle wishlist"
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm shadow transition-all hover:scale-110 ${wishlisted
            ? 'bg-[#8b6914] text-white dark:bg-[#c9a227] dark:text-[#0a0a0f]'
            : 'bg-white/80 dark:bg-black/50 text-[#1c1408] dark:text-white'
            }`}
        >
          <HeartIcon filled={wishlisted} />
        </button>
      </div>

      {/* ── Info below image ── */}
      <div className="mt-3 space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8b6914]/80 dark:text-[#c9a227]/70">
          {product.title.split(' ')[0]}
        </p>
        <h3 className="text-sm text-[#1c1408] dark:text-white/90 font-normal leading-snug line-clamp-2 group-hover:text-[#8b6914] dark:group-hover:text-[#c9a227] transition-colors duration-300">
          {product.title}
        </h3>
        <p className="text-sm font-semibold text-[#8b6914] dark:text-[#c9a227] pt-0.5">
          ₹{price.toLocaleString('en-IN')}
        </p>
      </div>
    </article>
  )
}

/* ─── Skeleton Card ──────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="flex flex-col gap-3">
    <div className="aspect-[3/4] bg-[#ece8e0] dark:bg-white/5 animate-pulse" />
    <div className="h-3 w-1/3 bg-[#ece8e0] dark:bg-white/5 animate-pulse rounded" />
    <div className="h-4 w-5/6 bg-[#ece8e0] dark:bg-white/5 animate-pulse rounded" />
    <div className="h-4 w-1/4 bg-[#ece8e0] dark:bg-white/5 animate-pulse rounded" />
  </div>
)

/* ─── MAIN Shop Component ────────────────────────────────────── */
const Shop = () => {
  const { handleGetAllProducts } = useProduct()
  const storeProducts = useSelector((state) => state.product.allProducts) || []

  const productsRef = useRef(null)
  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const [loading, setLoading] = useState(true)
  const [wishlistedIds, setWishlistedIds] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSize, setSelectedSize] = useState('All')
  const [maxPrice, setMaxPrice] = useState(9999)
  const [selectedColor, setSelectedColor] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', 'Kurta Sets', 'Sarees', 'Lehenga', 'Anarkali', 'Dupatta Sets']
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = [
    { name: 'All', hex: '' },
    { name: 'Pink', hex: '#f9a8d4' },
    { name: 'Green', hex: '#16a34a' },
    { name: 'Brown', hex: '#92400e' },
    { name: 'Maroon', hex: '#881337' },
    { name: 'Cream', hex: '#fef9c3' },
    { name: 'Blue', hex: '#1d4ed8' },
    { name: 'Red', hex: '#dc2626' },
    { name: 'Olive', hex: '#65a30d' },
  ]

  useEffect(() => {
    const load = async () => {
      try { await handleGetAllProducts() }
      catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const toggleWishlist = (id) => {
    setWishlistedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const matchCategory = (p, cat) => {
    if (cat === 'All') return true
    const t = p.title.toLowerCase()
    const d = (p.description || '').toLowerCase()
    if (cat === 'Kurta Sets') return t.includes('kurta') && (t.includes('palazzo') || t.includes('pant') || t.includes('trouser') || t.includes('set') || d.includes('kurta with'))
    if (cat === 'Sarees') return t.includes('saree')
    if (cat === 'Lehenga') return t.includes('lehenga')
    if (cat === 'Anarkali') return t.includes('anarkali')
    if (cat === 'Dupatta Sets') return t.includes('dupatta')
    return false
  }

  const matchColor = (p, col) => {
    if (col === 'All') return true
    return `${p.title} ${p.description}`.toLowerCase().includes(col.toLowerCase())
  }

  const filteredProducts = useMemo(() => {
    let list = [...storeProducts]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p => p.title.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
    }
    if (selectedCategory !== 'All') list = list.filter(p => matchCategory(p, selectedCategory))
    if (selectedSize !== 'All') list = list.filter(p => `${p.title} ${p.description}`.toLowerCase().includes(selectedSize.toLowerCase()))
    list = list.filter(p => (p.price?.amount ?? 0) <= maxPrice)
    if (selectedColor !== 'All') list = list.filter(p => matchColor(p, selectedColor))
    if (sortBy === 'newest') list.sort((a, b) => b._id.localeCompare(a._id))
    if (sortBy === 'price-low') list.sort((a, b) => (a.price?.amount ?? 0) - (b.price?.amount ?? 0))
    if (sortBy === 'price-high') list.sort((a, b) => (b.price?.amount ?? 0) - (a.price?.amount ?? 0))
    return list
  }, [storeProducts, searchQuery, selectedCategory, selectedSize, maxPrice, selectedColor, sortBy])

  const clearFilters = () => {
    setSelectedCategory('All')
    setSelectedSize('All')
    setMaxPrice(9999)
    setSelectedColor('All')
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-[#F7F4EE] dark:bg-[#0a0a0f] text-[#1c1408] dark:text-white transition-colors duration-300">

      {/* ══ STICKY NAVBAR ══════════════════════════════════════ */}
      <header className="shop-header sticky top-0 z-50 h-16 flex items-center justify-between px-5 sm:px-10 bg-[#F7F4EE]/90 dark:bg-[#0a0a0f]/85 backdrop-blur-md border-b border-[#8b6914]/12 dark:border-white/8 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#8b6914] dark:bg-gradient-to-br dark:from-[#c9a227] dark:to-[#ecc246] flex items-center justify-center text-white dark:text-[#0a0a0f]">
            <DiamondIcon size={12} />
          </div>
          <span className="shimmer-text inline-block text-sm font-bold tracking-[0.22em] uppercase">AAVRAN</span>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link to="/cart" className="w-9 h-9 rounded-full flex items-center justify-center border border-[#8b6914]/20 dark:border-white/10 text-[#5a4520] dark:text-white/55 hover:border-[#8b6914] hover:text-[#8b6914] dark:hover:border-[#c9a227] dark:hover:text-[#c9a227] transition-all no-underline">
            <CartIcon size={15} />
          </Link>
          <div className="w-8 h-8 rounded-full bg-[#8b6914] dark:bg-gradient-to-br dark:from-[#c9a227] dark:to-[#ecc246] flex items-center justify-center text-white dark:text-[#0a0a0f] cursor-pointer">
            <PersonIcon />
          </div>
        </div>
      </header>

      {/* ══ HERO BANNER ════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-[#0a0a0f]" style={{ minHeight: 'clamp(240px, 34vh, 400px)' }}>
        <img
          src="/festive_banner.png"
          alt="Women's Collection"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-90 dark:opacity-50 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-center h-full px-8 sm:px-14 py-12">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-semibold text-[#ecc246] mb-3">
            <span className="inline-block w-7 h-px bg-[#ecc246]" />
            Atelier SS 2026
          </p>
          <h1 className="shop-hero-title text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight mb-3 text-white" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
            Women's<br /><span className="shimmer-text inline-block font-semibold italic">Collection</span>
          </h1>
          <p className="text-sm text-white/70 max-w-sm mb-8 leading-relaxed">
            Timeless outfits for every occasion.
          </p>
          <button onClick={scrollToProducts} className="gold-btn self-start px-8 py-3 bg-[#8b6914] text-white dark:text-[#0a0a0f] text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:-translate-y-0.5 shadow-md">
            SHOP NOW
          </button>
        </div>
      </section>

      {/* ══ MAIN LAYOUT: sidebar + grid ════════════════════════ */}
      <div ref={productsRef} className="max-w-[1440px] mx-auto flex gap-0">

        {/* ─ Desktop sidebar ─ */}
        <aside className="shop-sidebar hidden lg:block w-56 xl:w-64 flex-shrink-0 px-6 xl:px-8 py-8 border-r border-[#8b6914]/10 dark:border-white/8 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <FilterSidebar
            categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
            sizes={sizes} selectedSize={selectedSize} setSelectedSize={setSelectedSize}
            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
            colors={colors} selectedColor={selectedColor} setSelectedColor={setSelectedColor}
          />
        </aside>

        {/* ─ Content column ─ */}
        <div className="flex-grow min-w-0 px-5 sm:px-8 py-8">

          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 items-center justify-between mb-6 pb-5 border-b border-[#8b6914]/12 dark:border-white/8">
            <p className="text-xs text-[#1c1408]/55 dark:text-white/50">
              Showing <span className="font-semibold text-[#1c1408] dark:text-white">{loading ? '—' : filteredProducts.length}</span> products
            </p>

            <div className="flex flex-wrap gap-2 items-center">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="glass-input pl-8 pr-3 py-2 text-xs w-44 sm:w-52 bg-white/70 dark:bg-white/5 border border-[#8b6914]/18 dark:border-white/10 focus:border-[#8b6914] dark:focus:border-[#c9a227] outline-none text-[#1c1408] dark:text-white placeholder-[#1c1408]/35 dark:placeholder-white/30 transition-colors"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#1c1408]/35 dark:text-white/30 pointer-events-none">
                  <SearchIcon size={13} />
                </span>
              </div>

              {/* Mobile filter button */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-[#8b6914]/20 dark:border-white/10 text-xs hover:border-[#8b6914] dark:hover:border-[#c9a227] transition-colors"
              >
                <FilterIcon /> Filter
              </button>

              {/* Sort */}
              <div className="glass-input relative flex items-center gap-2 px-3 py-2 bg-white/70 dark:bg-white/5 border border-[#8b6914]/18 dark:border-white/10 hover:border-[#8b6914] dark:hover:border-[#c9a227] transition-colors">
                <span className="text-[10px] text-[#1c1408]/40 dark:text-white/35 uppercase tracking-wider whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-[#1c1408] dark:text-white border-none outline-none cursor-pointer pr-5 appearance-none dark:[&>option]:bg-[#0a0a0f] dark:[&>option]:text-white"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <span className="absolute right-2 pointer-events-none text-[#1c1408]/40 dark:text-white/40">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-9">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-xl font-light mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>No products found</p>
              <p className="text-xs text-[#1c1408]/50 dark:text-white/40 mb-6">Try adjusting your filters or search query.</p>
              <button onClick={clearFilters} className="px-6 py-2.5 border border-[#8b6914] dark:border-[#c9a227] text-[#8b6914] dark:text-[#c9a227] text-xs uppercase tracking-widest hover:bg-[#8b6914]/5 dark:hover:bg-[#c9a227]/8 transition-all">
                Clear Filters
              </button>
            </div>
          )}

          {/* ── Product grid ── */}
          {!loading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-9">
              {filteredProducts.map((product) => (

                <Link to={`/shop/${product._id}`} key={product._id} >
                  <ProductCard
                    product={product}
                    wishlisted={wishlistedIds.includes(product._id)}
                    onToggleWishlist={toggleWishlist}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ MOBILE FILTER DRAWER ═══════════════════════════════ */}
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className={`fixed inset-0 z-50 bg-black/45 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />
      {/* Panel */}
      <div className={`fixed top-0 left-0 z-50 h-full w-[min(320px,90vw)] bg-[#F7F4EE] dark:bg-[#0f0f18] p-6 shadow-2xl overflow-y-auto transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-semibold uppercase tracking-widest">Filters</span>
          <button onClick={() => setIsDrawerOpen(false)} className="p-1 hover:text-[#8b6914] dark:hover:text-[#c9a227] transition-colors">
            <CloseIcon />
          </button>
        </div>
        <FilterSidebar
          categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          sizes={sizes} selectedSize={selectedSize} setSelectedSize={setSelectedSize}
          maxPrice={maxPrice} setMaxPrice={setMaxPrice}
          colors={colors} selectedColor={selectedColor} setSelectedColor={setSelectedColor}
          onApply={() => setIsDrawerOpen(false)}
        />
      </div>

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <footer className="mt-16 border-t border-[#8b6914]/10 dark:border-white/8 py-6 text-center text-[10px] tracking-[0.22em] uppercase text-[#1c1408]/35 dark:text-white/30">
        © 2026 Aavran Fashion · All rights reserved
      </footer>
    </div>
  )
}

export default Shop