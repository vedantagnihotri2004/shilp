import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Link, NavLink, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck, Bell, BookOpen, Check, CheckCircle2, ChevronDown, CircleHelp, Cloud, CloudOff, Compass, ImagePlus, Leaf, LoaderCircle, MapPin, Mic, Minus, Package, Pencil, Plus, RefreshCw, Search, Settings2, ShieldCheck, ShoppingBag, Sparkles, Sprout, Star, Store, UploadCloud, UserRound, Volume2, Wifi, X, Share2 } from 'lucide-react'
import { artisans, marketplaceProducts, pricing, products as initialProducts, stories } from './data/artisanData'
import './App.css'

const AppContext = createContext(null)
const useApp = () => useContext(AppContext)
const copy = {
  en: { home: 'Home', products: 'My Products', create: 'Create', market: 'Marketplace', profile: 'Profile', story: 'My story', createProduct: 'Create a product', productsTitle: 'My Products', publish: 'Publish', speak: 'Speak', capture: 'Capture', catalog: 'Catalog', price: 'Price', publishStep: 'Publish', dashboard: 'Your craft, out in the world.', marketplaceTitle: 'Digital Bazaar', storyTitle: 'Tell your story', profileTitle: 'Artisan Profile', continue: 'Continue', all: 'All', drafts: 'Drafts', published: 'Published', offline: 'Offline', syncing: 'Syncing' },
  hi: { home: 'होम', products: 'मेरे उत्पाद', create: 'बनाएं', market: 'बाज़ार', profile: 'प्रोफ़ाइल', story: 'मेरी कहानी', createProduct: 'उत्पाद बनाएं', productsTitle: 'मेरे उत्पाद', publish: 'प्रकाशित करें', speak: 'बोलें', capture: 'फ़ोटो लें', catalog: 'विवरण', price: 'कीमत', publishStep: 'प्रकाशित करें', dashboard: 'आपका हुनर, दुनिया के नाम।', marketplaceTitle: 'डिजिटल बाज़ार', storyTitle: 'अपनी कहानी बताएं', profileTitle: 'कारीगर प्रोफ़ाइल', continue: 'आगे बढ़ें', all: 'सभी', drafts: 'ड्राफ़्ट', published: 'प्रकाशित', offline: 'ऑफ़लाइन', syncing: 'सिंक हो रहा' },
}
const navigation = [
  { to: '/dashboard', label: 'home', icon: Compass }, { to: '/products', label: 'products', icon: Package }, { to: '/create-product', label: 'create', icon: Plus, primary: true }, { to: '/marketplace', label: 'market', icon: Store }, { to: '/profile', label: 'profile', icon: UserRound },
]

function AppProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('shilp-language') || 'en')
  const [isOnline, setIsOnline] = useState(() => localStorage.getItem('shilp-online') !== 'false')
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem('shilp-products')) || initialProducts } catch { return initialProducts } })
  const [profile, setProfile] = useState(() => { try { return JSON.parse(localStorage.getItem('shilp-profile')) || artisans[0] } catch { return artisans[0] } })
  const [editingProduct, setEditingProduct] = useState(null)
  const [toast, setToast] = useState('')
  const [modal, setModal] = useState(null)
  const [syncing, setSyncing] = useState(false)
  useEffect(() => localStorage.setItem('shilp-products', JSON.stringify(items)), [items])
  useEffect(() => localStorage.setItem('shilp-language', language), [language])
  useEffect(() => localStorage.setItem('shilp-online', String(isOnline)), [isOnline])
  useEffect(() => localStorage.setItem('shilp-profile', JSON.stringify(profile)), [profile])
  useEffect(() => { if (!toast) return undefined; const timer = window.setTimeout(() => setToast(''), 3200); return () => window.clearTimeout(timer) }, [toast])
  const pendingCount = items.filter((item) => item.status === 'Offline' || item.status === 'Draft').length
  const value = { language, setLanguage, isOnline, setIsOnline, items, setItems, profile, setProfile, editingProduct, setEditingProduct, toast, setToast, modal, setModal, syncing, setSyncing, t: copy[language], pendingCount }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

function LanguageToggle() {
  const { language, setLanguage } = useApp()
  return <div className="language-toggle" aria-label="Choose language"><button className={language === 'hi' ? 'selected' : ''} onClick={() => setLanguage('hi')}>हिंदी</button><span /><button className={language === 'en' ? 'selected' : ''} onClick={() => setLanguage('en')}>English</button></div>
}

function OfflineIndicator({ compact = false }) {
  const { isOnline, setIsOnline, setToast } = useApp()
  return <button className={`network-pill ${isOnline ? 'online' : 'offline'} ${compact ? 'compact' : ''}`} onClick={() => { setIsOnline(!isOnline); setToast(!isOnline ? 'You are back online.' : 'Offline mode is on. Your work is saved on this device.') }} title="Toggle online / offline mode">{isOnline ? <Wifi size={15} /> : <CloudOff size={15} />}<span>{isOnline ? 'Online' : 'Offline Mode'}</span><span className="network-dot" /></button>
}

function Sidebar() {
  const { t, profile, pendingCount } = useApp()
  return <aside className="sidebar"><Link to="/dashboard" className="brand"><span className="brand-mark"><Sprout size={24} /></span><span><strong>shilp sahayak</strong><small>Hunar se bazaar tak</small></span></Link><div className="sidebar-label">YOUR WORKSPACE</div><nav className="side-nav">{navigation.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Icon size={19} strokeWidth={1.8} /><span>{t[label]}</span>{label === 'products' && pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}</NavLink>)}</nav><div className="story-link-wrap"><div className="sidebar-label">YOUR VOICE MATTERS</div><NavLink to="/story" className={({ isActive }) => `nav-item story-link ${isActive ? 'active' : ''}`}><BookOpen size={19} /><span>{t.story}</span></NavLink><div className="sidebar-quote">“Every handcrafted piece carries a piece of your story.”<span>— Shilp Sahayak</span></div></div><div className="sidebar-bottom"><div className="sync-mini"><span className="sync-mini-icon"><Cloud size={17} /></span><span><strong>{pendingCount} items to sync</strong><small>Saved safely on this device</small></span></div><Link to="/profile" className="sidebar-user"><span className="avatar small-avatar">{profile.name?.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span><strong>{profile.name}</strong><small>{profile.craft}</small></span><ChevronDown size={16} /></Link></div></aside>
}

function MobileNavbar() {
  const { t } = useApp()
  return <nav className="mobile-nav">{navigation.map(({ to, label, icon: Icon, primary }) => <NavLink key={to} to={to} className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''} ${primary ? 'mobile-create' : ''}`}><span><Icon size={primary ? 23 : 20} strokeWidth={primary ? 2.2 : 1.8} /></span><small>{t[label]}</small></NavLink>)}</nav>
}

function AppShell() {
  const { toast, modal, setModal, setToast } = useApp()
  return <div className="app-frame"><Sidebar /><main className="main-shell"><header className="topbar"><Link to="/dashboard" className="mobile-brand"><Sprout size={23} /><span>shilp sahayak</span></Link><div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-dot">·</span><strong>Smart India Hackathon 2026</strong></div><div className="topbar-actions"><OfflineIndicator compact /><LanguageToggle /><button className="icon-button notifications" aria-label="Notifications" onClick={() => setToast('You’re all caught up!')}><Bell size={19} /><i /></button><Link to="/profile" className="topbar-avatar avatar">R</Link></div></header><div className="page-area"><Outlet /></div></main><MobileNavbar />{toast && <Toast message={toast} onClose={() => setToast('')} />}{modal && <Modal {...modal} onClose={() => setModal(null)} />}</div>
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="heading-action">{action}</div>}</div>
}

function ProductImage({ product, className = '' }) {
  return <div className={`product-image ${className}`}>{product?.image ? <img src={product.image} alt={product?.name || 'Handcrafted product'} /> : <><div className="image-sun" /><span className="image-plant plant-one">✳</span><span className="image-plant plant-two">❋</span><span className="product-emoji">{product?.emoji || '🐘'}</span><span className="image-caption">MADE BY HAND</span></>}</div>
}

function ProductCard({ product, onDelete }) {
  const { setModal, setToast, setEditingProduct } = useApp()
  const navigate = useNavigate()
  const statusClass = { Published: 'status-green', Draft: 'status-amber', Offline: 'status-gray', Syncing: 'status-blue' }
  return <article className="product-card"><Link to={`/product/${product.id}`} className="product-card-image-link"><ProductImage product={product} className="card-image" /><span className={`status-chip ${statusClass[product.status] || 'status-gray'}`}><i />{product.status}</span></Link><div className="product-card-body"><div className="product-card-top"><span className="product-category">{product.category || product.craft}</span><button className="more-button" aria-label="Product options" onClick={() => setModal({ title: 'Product options', message: `What would you like to do with ${product.name}?`, actions: [{ label: 'Edit details', onClick: () => { setEditingProduct(product); navigate('/create-product') } }, { label: 'Delete product', danger: true, onClick: () => onDelete ? onDelete(product.id) : setToast('This sample listing is read-only.') }] })}>···</button></div><Link to={`/product/${product.id}`} className="product-name-link"><h3>{product.name}</h3></Link><div className="product-card-bottom"><strong>₹{Number(product.price).toLocaleString('en-IN')}</strong><span>{product.material || 'Handcrafted'}</span></div></div></article>
}

function ProductForm({ value, onChange }) {
  const fields = [['name', 'Product name'], ['category', 'Category'], ['material', 'Material'], ['craft', 'Craft type'], ['description', 'Description']]
  return <div className="product-form">{fields.map(([key, label]) => <label key={key} className={key === 'description' ? 'full-field' : ''}><span>{label}</span>{key === 'description' ? <textarea rows="3" value={value[key]} onChange={(event) => onChange({ ...value, [key]: event.target.value })} /> : <input value={value[key]} onChange={(event) => onChange({ ...value, [key]: event.target.value })} />}</label>)}</div>
}

function PriceEstimator({ price, setPrice }) {
  return <div className="price-estimator"><div className="estimate-label"><span className="sparkle-badge"><Sparkles size={16} /></span><span>PROTOTYPE PRICE ESTIMATE</span><button title="About this estimate"><CircleHelp size={16} /></button></div><div className="suggested-price">₹{price.toLocaleString('en-IN')}</div><p className="price-range-text">Suggested range <strong>₹800 — ₹1,200</strong></p><div className="range-visual"><div className="range-labels"><span>₹800</span><span>₹1,200</span></div><div className="range-track"><span className="range-fill" /><i className="range-marker" /></div></div><div className="price-factors"><span><span className="factor-icon orange"><Leaf size={16} /></span>Material cost</span><span><span className="factor-icon green"><Settings2 size={16} /></span>Craft complexity</span><span><span className="factor-icon yellow"><Store size={16} /></span>Market range</span></div><div className="manual-price"><div><strong>Set your own price</strong><small>You know the value of your work best.</small></div><div className="price-controls"><button onClick={() => setPrice((amount) => Math.max(100, amount - 50))} aria-label="Decrease price"><Minus size={17} /> ₹50</button><button onClick={() => setPrice((amount) => amount + 50)} aria-label="Increase price"><Plus size={17} /> ₹50</button></div></div></div>
}

function VoiceButton({ onClick, listening }) {
  return <button className={`voice-button ${listening ? 'listening' : ''}`} onClick={onClick} aria-label="Press and speak"><span className="voice-orbit orbit-one" /><span className="voice-orbit orbit-two" /><Mic size={32} fill="currentColor" /><span className="voice-ripple" /></button>
}

function StepProgress({ step }) {
  const { t } = useApp()
  const labels = [t.speak, t.capture, t.catalog, t.price, t.publishStep]
  return <div className="step-progress">{labels.map((label, index) => <div key={label} className={`step-item ${step === index + 1 ? 'current' : ''} ${step > index + 1 ? 'done' : ''}`}><span className="step-circle">{step > index + 1 ? <Check size={14} /> : index + 1}</span><span>{label}</span>{index < labels.length - 1 && <i className="step-connector" />}</div>)}</div>
}

function StoryCard({ story }) {
  return <article className="story-card"><div className="story-card-art"><span>“</span><div className="story-art-motif">{story.emoji || '✳'}</div></div><div className="story-card-content"><span className="product-category">{story.craft}</span><h3>{story.title}</h3><p>{story.excerpt}</p><div className="story-author"><span className="avatar tiny-avatar">{story.name[0]}</span><span><strong>{story.name}</strong><small>{story.location}</small></span></div></div></article>
}

function MarketplaceCard({ product }) {
  const { setToast } = useApp()
  const navigate = useNavigate()
  return <article className="market-card"><ProductImage product={product} className="market-image" /><div className="market-card-body"><span className="craft-tag">{product.craft}</span><h3>{product.name}</h3><div className="market-maker"><span className="avatar tiny-avatar">{product.artisan[0]}</span><span><strong>{product.artisan}</strong><small><MapPin size={12} />{product.location}</small></span></div><div className="market-card-footer"><strong>₹{Number(product.price).toLocaleString('en-IN')}</strong><div className="market-card-actions"><button className="button secondary small-button" onClick={() => navigate(`/product/${product.id}`)}>View</button><button className="button dark small-button" onClick={() => setToast('Demo purchase flow. No payment will be collected.')}>Buy</button></div></div></div></article>
}

function SyncStatus() {
  const { pendingCount, syncing, setSyncing, setItems, setToast, isOnline } = useApp()
  const [syncLabel, setSyncLabel] = useState('Syncing your work…')
  const runSync = () => {
    if (!isOnline) { setToast('Turn on Online mode before syncing.'); return }
    if (!pendingCount) { setToast('You’re all caught up. Nothing to sync!'); return }
    setSyncing(true)
    setSyncLabel('Syncing…')
    window.setTimeout(() => setSyncLabel(`Uploading ${pendingCount} products…`), 650)
    window.setTimeout(() => { setItems((current) => current.map((item) => item.status === 'Draft' || item.status === 'Offline' ? { ...item, status: 'Published' } : item)); setSyncing(false); setToast(`✓ All ${pendingCount} products synced.`) }, 1750)
  }
  return <div className="sync-card"><div className="sync-card-icon"><Cloud size={21} /></div><div className="sync-card-copy"><strong>{syncing ? syncLabel : `${pendingCount} products waiting to sync`}</strong><span>{syncing ? 'Your work is moving safely' : 'Your work is safe on this device'}</span></div>{syncing ? <LoaderCircle className="spin" size={20} /> : <button className="button secondary sync-button" onClick={runSync}><RefreshCw size={15} /> Sync now</button>}</div>
}

function Toast({ message, onClose }) {
  return <div className="toast"><CheckCircle2 size={19} /><span>{message}</span><button onClick={onClose} aria-label="Dismiss"><X size={17} /></button></div>
}

function Modal({ title, message, actions = [], onClose }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal-card" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button><span className="modal-icon"><Sparkles size={23} /></span><h2>{title}</h2><p>{message}</p><div className="modal-actions">{actions.map((action) => <button key={action.label} className={`button ${action.danger ? 'danger-button' : 'secondary'}`} onClick={() => { action.onClick?.(); onClose() }}>{action.label}</button>)}<button className="button terracotta-button" onClick={onClose}>Done</button></div></div></div>
}

function Dashboard() {
  const { t, items, pendingCount, setToast } = useApp()
  const navigate = useNavigate()
  const stats = [{ label: 'My products', value: items.length, icon: Package, tint: 'tint-orange' }, { label: 'Published', value: items.filter((item) => item.status === 'Published').length, icon: BadgeCheck, tint: 'tint-green' }, { label: 'Drafts', value: items.filter((item) => item.status === 'Draft').length, icon: Pencil, tint: 'tint-yellow' }, { label: 'Pending sync', value: pendingCount, icon: Cloud, tint: 'tint-blue' }]
  return <div className="dashboard-page"><section className="welcome-banner"><div className="welcome-copy"><span className="welcome-kicker"><span className="tiny-sun">✳</span> Namaste, Ram Lal ji</span><h1>{t.dashboard}</h1><p>Apne hunar ko digital bazaar tak le jaiye.</p><div className="welcome-actions"><button className="button terracotta-button large-button" onClick={() => navigate('/create-product')}><Plus size={20} /> {t.createProduct} <ArrowRight size={18} /></button><button className="button welcome-link" onClick={() => setToast('Your work is always saved, even when you’re offline.')}><CircleHelp size={16} /> How it works</button></div></div><div className="welcome-art" aria-hidden="true"><div className="welcome-art-sun" /><div className="welcome-leaf leaf-a">❋</div><div className="welcome-leaf leaf-b">✳</div><div className="welcome-art-object">🐘</div><div className="welcome-art-caption">CRAFTED WITH CARE<br /><span>AGRA, INDIA</span></div></div><span className="banner-decoration deco-one">✳</span><span className="banner-decoration deco-two">✣</span></section><div className="dashboard-status"><SyncStatus /><div className="offline-note"><span className="offline-note-icon"><ShieldCheck size={18} /></span><span><strong>Made for your pace</strong><small>Work offline. Sync when ready.</small></span></div></div><section className="stats-grid">{stats.map(({ label, value, icon: Icon, tint }) => <button key={label} className="stat-card" onClick={() => label === 'Pending sync' ? setToast(`${pendingCount} products are saved and ready to sync.`) : navigate('/products')}><span className={`stat-icon ${tint}`}><Icon size={19} /></span><span className="stat-label">{label}</span><strong>{value}</strong><span className="stat-foot">View details <ArrowRight size={13} /></span></button>)}</section><section className="section-block"><div className="section-heading"><div><span className="eyebrow">YOUR HANDIWORK</span><h2>Recently added</h2></div><Link to="/products" className="text-link">See all products <ArrowRight size={16} /></Link></div><div className="product-grid dashboard-products">{items.slice(0, 3).map((item) => <ProductCard key={item.id} product={item} />)}</div></section><section className="dashboard-bottom"><div className="daily-note"><span className="note-icon"><Volume2 size={21} /></span><div><span className="eyebrow">A LITTLE ENCOURAGEMENT</span><p>“The hands that create with care deserve to be seen by the world.”</p><small>Your craft has a place here.</small></div><span className="note-flower">✳</span></div><Link to="/story" className="story-prompt"><span className="story-prompt-icon"><BookOpen size={21} /></span><span><strong>Let buyers know your story</strong><small>Share the person behind every piece.</small></span><ArrowRight size={18} /></Link></section></div>
}

function ProductsPage() {
  const { t, items, setItems, setToast } = useApp()
  const [filter, setFilter] = useState('All')
  const filters = ['All', 'Drafts', 'Published', 'Offline', 'Syncing']
  const visible = useMemo(() => items.filter((item) => filter === 'All' || item.status.toLowerCase() === filter.toLowerCase().replace(/s$/, '')), [items, filter])
  const remove = (id) => { setItems((current) => current.filter((item) => item.id !== id)); setToast('Product removed from your collection.') }
  return <><PageHeading eyebrow="YOUR WORKSPACE" title={t.productsTitle} description="Every piece has a story. Keep them all in one place." action={<Link to="/create-product" className="button terracotta-button"><Plus size={18} /> {t.createProduct}</Link>} /><div className="products-toolbar"><div className="tab-list">{filters.map((tab) => <button key={tab} className={filter === tab ? 'active' : ''} onClick={() => setFilter(tab)}>{t[tab.toLowerCase()] || tab}<span>{tab === 'All' ? items.length : items.filter((item) => item.status.toLowerCase() === tab.toLowerCase().replace(/s$/, '')).length}</span></button>)}</div><button className="filter-button"><Settings2 size={16} /> Filter</button></div>{visible.length ? <div className="product-grid products-management-grid">{visible.map((item) => <ProductCard key={item.id} product={item} onDelete={remove} />)}</div> : <div className="empty-state"><span className="empty-icon"><Package size={26} /></span><h2>No products here yet</h2><p>Create your first listing and share your craft with the world.</p><Link to="/create-product" className="button terracotta-button"><Plus size={17} /> Create a product</Link></div>}</>
}

const emptyProduct = { name: 'Handcrafted Wooden Elephant', category: 'Wood Craft', material: 'Sheesham Wood', craft: 'Traditional Wood Carving', description: 'Handcrafted decorative wooden elephant created using traditional artisan techniques.', price: pricing.suggested, image: '', emoji: '🐘' }
function CreateProduct() {
  const { setItems, profile, isOnline, setToast, editingProduct, setEditingProduct, t } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(() => {
    try { return editingProduct || JSON.parse(localStorage.getItem('shilp-product-wizard')) || emptyProduct } catch { return editingProduct || emptyProduct }
  })
  const [listening, setListening] = useState(false)
  const [voiceCaptured, setVoiceCaptured] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [enhanced, setEnhanced] = useState(false)
  const inputRef = useRef(null)
  useEffect(() => { localStorage.setItem('shilp-product-wizard', JSON.stringify(form)) }, [form])
  const simulateVoice = () => { if (listening) return; setListening(true); window.setTimeout(() => { setForm((current) => ({ ...current, description: 'Ye ek handmade wooden elephant hai jo traditional carving technique se banaya gaya hai.' })); setVoiceCaptured(true); setListening(false); setToast('Voice captured. Your words are ready!') }, 2100) }
  const upload = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setForm((current) => ({ ...current, image: reader.result })); reader.readAsDataURL(file) }
  const generate = () => { setGenerating(true); window.setTimeout(() => { setForm((current) => ({ ...current, ...emptyProduct, image: current.image })); setGenerating(false); setToast('A fresh catalog suggestion is ready to review.') }, 1300) }
  const save = (status) => { const saved = { ...form, id: editingProduct?.id || `p-${Date.now()}`, status: status === 'Published' && !isOnline ? 'Offline' : status, artisan: profile.name, location: profile.location, createdAt: editingProduct?.createdAt || new Date().toISOString() }; setItems((current) => editingProduct ? current.map((item) => item.id === editingProduct.id ? saved : item) : [saved, ...current]); setEditingProduct(null); localStorage.removeItem('shilp-product-wizard'); setToast(status === 'Published' && isOnline ? 'Your product is published!' : 'Saved safely on this device.'); navigate('/products') }
  const content = () => {
    if (step === 1) return <div className="wizard-content voice-step"><span className="step-eyebrow"><span className="mini-step-number">01</span> TELL US ABOUT YOUR CRAFT</span><h2>Apne product ke baare mein batayein</h2><p className="step-intro">Aap bolkar batayein — hum likh lenge. No typing needed.</p><div className="voice-area"><VoiceButton onClick={simulateVoice} listening={listening} /><strong>{listening ? 'Listening to your story…' : 'Press and speak'}</strong><span>{listening ? 'Go ahead, take your time' : 'Tap the microphone and speak naturally'}</span><div className="voice-language"><span>Speaking in</span><button className="selected">हिंदी</button><button onClick={() => setToast('English voice demo selected.')}>English</button></div></div><div className={`transcript-box ${voiceCaptured ? 'has-transcript' : ''}`}><div className="transcript-heading"><span>{voiceCaptured ? <><CheckCircle2 size={16} /> Voice captured</> : <><Mic size={15} /> Your words will appear here</>}</span>{voiceCaptured && <button onClick={() => { setForm({ ...form, description: '' }); setVoiceCaptured(false) }}>Clear</button>}</div><p>{voiceCaptured ? form.description : '“Main apne product ke baare mein bolne ke liye taiyaar hoon…”'}</p></div></div>
    if (step === 2) return <div className="wizard-content capture-step"><span className="step-eyebrow"><span className="mini-step-number">02</span> LET YOUR WORK SHINE</span><h2>Apne product ki photo lein</h2><p className="step-intro">A simple photo helps buyers see the care in your craft.</p><input ref={inputRef} type="file" accept="image/*" onChange={upload} hidden />{form.image ? <div className="upload-preview"><img src={form.image} alt="Your product preview" /><button className="remove-image" onClick={() => setForm({ ...form, image: '' })}><X size={16} /> Remove photo</button></div> : <button className="upload-dropzone" onClick={() => inputRef.current?.click()}><span className="upload-icon"><ImagePlus size={30} /></span><strong>Tap to choose a photo</strong><span>or drag a photo here</span><small>JPG, PNG · up to 10 MB</small></button>}<div className="photo-actions"><button className={`button secondary ${enhanced ? 'success-button' : ''}`} onClick={() => { setEnhanced(true); setToast('Photo presentation improved for this demo.') }}><Sparkles size={16} />{enhanced ? 'Photo improved' : 'Improve Photo'}</button><button className={`button secondary ${enhanced ? 'success-button' : ''}`} onClick={() => { setEnhanced(true); setToast('Background removal simulated.') }}><ImagePlus size={16} /> Remove Background</button></div><div className="ai-support"><span><Sparkles size={15} /></span><div><strong>AI Photo Support <em>DEMO</em></strong><small>Improve product presentation before publishing.</small></div><CheckCircle2 size={17} /></div></div>
    if (step === 3) return <div className="wizard-content catalog-step"><span className="step-eyebrow"><span className="mini-step-number">03</span> A FIRST DRAFT, MADE FOR YOU</span><h2>{t.catalog}</h2><p className="step-intro">We’ve put together a starting point. Make it yours.</p><ProductForm value={form} onChange={setForm} /><button className="generate-link" onClick={generate} disabled={generating}>{generating ? <LoaderCircle className="spin" size={16} /> : <Sparkles size={16} />}{generating ? 'Finding the right words…' : 'Generate Again'} <span>Demo suggestion</span></button></div>
    if (step === 4) return <div className="wizard-content price-step"><span className="step-eyebrow"><span className="mini-step-number">04</span> YOUR WORK HAS VALUE</span><h2>{t.price === 'Price' ? 'Suggested Fair Price' : 'उचित कीमत का सुझाव'}</h2><p className="step-intro">A starting point to help you choose with confidence.</p><PriceEstimator price={form.price} setPrice={(update) => setForm((current) => ({ ...current, price: typeof update === 'function' ? update(current.price) : update }))} /><p className="price-disclaimer"><ShieldCheck size={15} /> A simple prototype estimate, not a real market or AI prediction. You decide your final price.</p></div>
    return <div className="wizard-content publish-step"><span className="step-eyebrow"><span className="mini-step-number">05</span> READY TO MEET THE WORLD</span><h2>Your listing preview</h2><p className="step-intro">This is how buyers will see your work. You can always make changes.</p><div className="listing-preview"><ProductImage product={form} className="listing-preview-image" /><div className="listing-preview-details"><span className="craft-tag">{form.category}</span><h3>{form.name}</h3><p>{form.description}</p><strong className="listing-price">₹{Number(form.price).toLocaleString('en-IN')}</strong><div className="listing-attributes"><span><Sprout size={15} />{form.craft}</span><span><UserRound size={15} />{profile.name}</span><span><MapPin size={15} />{profile.location}</span></div></div></div><div className="publish-note"><ShieldCheck size={18} /><span>{isOnline ? 'You’re online — your listing is ready to publish.' : 'Offline mode — save now and publish when you’re back online.'}</span></div></div>
  }
  return <div className="create-page"><div className="create-topline"><button className="back-link" onClick={() => step === 1 ? navigate('/dashboard') : setStep((current) => current - 1)}><ArrowLeft size={17} /> {step === 1 ? 'Back to home' : 'Previous step'}</button><span className="autosave-label"><Check size={14} /> Saved on this device</span></div><div className="create-title"><span className="eyebrow">A NEW CREATION</span><h1>{t.create === 'Create' ? 'Let’s bring your craft to life.' : 'आइए, आपके हुनर को दिखाएं।'}</h1><p>A few simple steps. Your story, your way.</p></div><StepProgress step={step} /><section className="wizard-card">{content()}<div className="wizard-footer"><span className="wizard-step-count">Step {step} of 5</span><div>{step > 1 && <button className="button secondary" onClick={() => setStep((current) => current - 1)}>Back</button>}{step < 5 ? <button className="button terracotta-button" onClick={() => setStep((current) => current + 1)}>{step === 4 ? 'See my listing' : t.continue} <ArrowRight size={17} /></button> : <><button className="button secondary" onClick={() => save('Draft')}><Cloud size={17} /> Save Offline</button><button className="button terracotta-button" onClick={() => save('Published')}><UploadCloud size={17} /> {isOnline ? t.publish : 'Save for later'}</button></>}</div></div></section><div className="create-reassurance"><ShieldCheck size={16} /><span>Your work is saved on this device at every step. No rush.</span></div></div>
}

function MarketplacePage() {
  const { setToast, t } = useApp()
  const [destination, setDestination] = useState('Discover')
  return <><PageHeading eyebrow="A WORLD OF BUYERS" title={t.marketplaceTitle} description="Discover beautiful work made by artisans across India." action={<button className="button secondary"><Search size={17} /> Find a craft</button>} /><div className="marketplace-banner"><div><span className="eyebrow">A PLACE FOR EVERY HANDMADE STORY</span><h2>Find something made with meaning.</h2><p>Every purchase helps keep a beautiful tradition alive.</p></div><div className="market-banner-art"><span>✳</span><b>हस्तकला</b><small>MADE WITH MEANING</small></div></div><div className="marketplace-toolbar"><div className="market-destinations"><span>EXPLORE ON</span>{['Discover', 'GeM', 'ONDC'].map((option) => <button key={option} className={destination === option ? 'selected' : ''} onClick={() => { setDestination(option); if (option !== 'Discover') setToast(`Demo: Products would be shown on ${option}.`) }}>{option === 'GeM' ? <span className="gem-mark">G</span> : option === 'ONDC' ? <span className="ondc-mark">o</span> : <Compass size={16} />}{option}{option !== 'Discover' && <span className="demo-badge">DEMO</span>}</button>)}</div><button className="filter-button"><Settings2 size={16} /> All crafts <ChevronDown size={15} /></button></div><div className="marketplace-grid">{marketplaceProducts.map((product) => <MarketplaceCard key={product.id} product={product} />)}</div><div className="market-connect-card"><span className="connect-icon"><Store size={21} /></span><div><strong>Your craft belongs in every bazaar.</strong><small>Marketplace connections are simulated for this prototype.</small></div><div className="market-connect-actions"><button className="button secondary" onClick={() => setToast('Demo: Product would be sent to GeM.')}>Publish to GeM</button><button className="button dark" onClick={() => setToast('Demo: Product would be sent to ONDC.')}>Publish to ONDC</button></div></div></>
}

function ProductDetail() {
  const { id } = useParams()
  const { items, profile, setToast } = useApp()
  const product = items.find((item) => item.id === id) || marketplaceProducts.find((item) => item.id === id) || initialProducts[0]
  const artisan = artisans.find((item) => item.name === product.artisan) || profile
  const story = stories.find((item) => item.name === artisan.name)?.excerpt || stories[0].excerpt
  return <div className="detail-page"><button className="back-link" onClick={() => window.history.back()}><ArrowLeft size={17} /> Back to bazaar</button><div className="detail-layout"><ProductImage product={product} className="detail-image" /><div className="detail-content"><span className="craft-tag">{product.category || product.craft}</span><h1>{product.name}</h1><div className="detail-rating"><Star size={16} fill="currentColor" /> 4.9 <span>·</span> Loved by craft lovers</div><strong className="detail-price">₹{Number(product.price).toLocaleString('en-IN')}</strong><p className="detail-description">{product.description}</p><div className="detail-specs"><div><span>Craft</span><strong>{product.craft || product.category}</strong></div><div><span>Material</span><strong>{product.material || 'Handcrafted materials'}</strong></div><div><span>Made in</span><strong>{product.location || artisan.location}</strong></div></div><div className="detail-maker"><span className="avatar artisan-avatar">{artisan.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span><small>MADE WITH CARE BY</small><strong>{artisan.name}</strong><span><MapPin size={14} />{artisan.location}</span></span><BadgeCheck size={19} /></div><div className="detail-actions"><button className="button terracotta-button large-button" onClick={() => setToast('Demo purchase flow. No payment will be collected.')}><ShoppingBag size={18} /> Buy Now</button><button className="button secondary large-button" onClick={() => setToast('Demo: Artisan contact details would be shared here.')}><Volume2 size={18} /> Contact Artisan</button></div><p className="prototype-note"><ShieldCheck size={15} /> Demo listing · No real purchase or payment</p></div></div><section className="maker-story"><div><span className="eyebrow">THE HANDS BEHIND THE CRAFT</span><h2>A little about {artisan.name.split(' ')[0]}</h2><p>{story}</p><Link to="/story" className="text-link">Read the full story <ArrowRight size={16} /></Link></div><span className="story-emblem">✳</span></section></div>
}

function StoryPage() {
  const { profile, setProfile, setToast, t } = useApp()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...profile, story: profile.story || stories[0].excerpt })
  const save = () => { setProfile(form); setEditing(false); setToast('Your story has been saved.') }
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  return <><PageHeading eyebrow="THE PERSON BEHIND THE CRAFT" title={t.storyTitle} description="The story behind a piece can make someone fall in love with it." action={!editing && <button className="button secondary" onClick={() => { setForm({ ...profile, story: profile.story || stories[0].excerpt }); setEditing(true) }}><Pencil size={16} /> Edit story</button>} />{editing ? <div className="story-editor"><div className="editor-intro"><span className="story-editor-icon"><BookOpen size={22} /></span><div><strong>Your story, in your own words</strong><small>Write a little, or just the beginning. You can change it anytime.</small></div></div><div className="story-fields"><label>Artisan Name<input name="name" value={form.name} onChange={update} /></label><label>Village / City<input name="location" value={form.location} onChange={update} /></label><label>Craft<input name="craft" value={form.craft} onChange={update} /></label><label>Years of Experience<input name="experience" value={form.experience} onChange={update} /></label><label className="full-field">My Story<textarea name="story" rows="5" value={form.story} onChange={update} placeholder="Tell buyers where your journey began…" /></label></div><div className="editor-actions"><button className="button secondary" onClick={() => setEditing(false)}>Cancel</button><button className="button terracotta-button" onClick={save}><Check size={17} /> Save my story</button></div></div> : <div className="story-showcase"><div className="story-showcase-copy"><span className="eyebrow">A STORY WOVEN BY HAND</span><h2>18 years of carving.<br />A lifetime of tradition.</h2><p>“{form.story}”</p><div className="story-signature"><span>With warmth,</span><strong>{form.name}</strong><small>{form.craft} · {form.location}</small></div><button className="button secondary" onClick={() => setToast('Your story preview is ready to share.')}><Share2 size={16} /> Share my story</button></div><div className="story-showcase-art"><div className="showcase-sun" /><span className="showcase-leaf leaf-left">❋</span><div className="showcase-person"><span>👨🏽‍🎨</span></div><div className="showcase-plaque"><Sprout size={15} /> HANDS THAT HOLD TRADITION</div></div></div>}<section className="community-stories"><div className="section-heading"><div><span className="eyebrow">OUR ARTISAN COMMUNITY</span><h2>Every craft begins somewhere</h2></div><span className="community-count"><span className="community-dots">● ● ●</span> 120+ artisan stories</span></div><div className="story-grid">{stories.map((story) => <StoryCard key={story.id} story={story} />)}</div></section></>
}

function ProfilePage() {
  const { profile, setProfile, items, setToast, t } = useApp()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)
  const publishedCount = items.filter((item) => item.status === 'Published').length
  const update = (event) => setDraft({ ...draft, [event.target.name]: event.target.value })
  const save = () => { setProfile(draft); setEditing(false); setToast('Profile details updated.') }
  return <><PageHeading eyebrow="YOUR SHILP SAHAYAK PROFILE" title={t.profileTitle} description="A home for your craft, your work and your journey." action={!editing && <button className="button secondary" onClick={() => { setDraft(profile); setEditing(true) }}><Pencil size={16} /> Edit profile</button>} /><section className="profile-hero"><div className="profile-hero-art"><span>✳</span><div className="avatar profile-photo">{profile.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div></div><div className="profile-hero-info">{editing ? <div className="profile-edit-fields"><label>Artisan Name<input name="name" value={draft.name} onChange={update} /></label><label>Craft<input name="craft" value={draft.craft} onChange={update} /></label><label>Location<input name="location" value={draft.location} onChange={update} /></label><label>Experience<input name="experience" value={draft.experience} onChange={update} /></label><div className="editor-actions"><button className="button secondary" onClick={() => setEditing(false)}>Cancel</button><button className="button terracotta-button" onClick={save}>Save profile</button></div></div> : <><span className="verified-tag"><BadgeCheck size={14} /> ARTISAN PROFILE</span><h2>{profile.name}</h2><p className="profile-craft">{profile.craft}</p><span className="profile-location"><MapPin size={16} />{profile.location}</span><div className="profile-quick-stats"><span><strong>{profile.experience} years</strong><small>Experience</small></span><span><strong>{items.length}</strong><small>Products</small></span><span><strong>₹{(publishedCount * 950).toLocaleString('en-IN')}</strong><small>Total sales <em>demo</em></small></span></div></>}</div></section><div className="profile-info-grid"><div className="info-card"><span className="info-card-icon tint-orange"><Sprout size={20} /></span><div><small>YOUR CRAFT</small><strong>{profile.craft}</strong><p>Carried forward with patience, care and generations of knowledge.</p></div></div><div className="info-card"><span className="info-card-icon tint-green"><MapPin size={20} /></span><div><small>YOUR HOME</small><strong>{profile.location}</strong><p>Rooted in a community rich with creativity and tradition.</p></div></div><div className="info-card"><span className="info-card-icon tint-yellow"><ShieldCheck size={20} /></span><div><small>YOUR JOURNEY</small><strong>{profile.experience} years of experience</strong><p>Every year adds a new detail to the story of your craft.</p></div></div></div><div className="profile-story-callout"><span><BookOpen size={19} /></span><div><strong>Let buyers meet the artisan behind the work.</strong><small>Your story brings every product to life.</small></div><Link to="/story" className="button secondary">My story <ArrowRight size={16} /></Link></div></>
}

function AppRoutes() {
  return <Routes><Route path="/" element={<AppShell />}><Route index element={<Dashboard />} /><Route path="dashboard" element={<Dashboard />} /><Route path="create-product" element={<CreateProduct />} /><Route path="products" element={<ProductsPage />} /><Route path="marketplace" element={<MarketplacePage />} /><Route path="product/:id" element={<ProductDetail />} /><Route path="story" element={<StoryPage />} /><Route path="profile" element={<ProfilePage />} /><Route path="*" element={<Dashboard />} /></Route></Routes>
}

export default function App() {
  return <BrowserRouter><AppProvider><AppRoutes /></AppProvider></BrowserRouter>
}