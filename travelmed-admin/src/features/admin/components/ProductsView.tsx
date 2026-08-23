import React, { useState } from 'react';
import { 
  Package, Plus, Save, Trash2, Edit2, Globe, Image as ImageIcon, 
  HelpCircle, Sparkles, X, ListPlus 
} from 'lucide-react';

interface ProductsViewProps {
  products: any[];
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
  addActivityLog: (action: string, changes: string) => void;
}

export default function ProductsView({
  products,
  setProducts,
  addActivityLog,
}: ProductsViewProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTab, setFormTab] = useState<'general' | 'features' | 'seo_faq' | 'media'>('general');

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0);
  const [gst, setGst] = useState(18);
  const [stock, setStock] = useState(100);
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'Visible' | 'Hidden'>('Visible');
  const [status, setStatus] = useState<'In Stock' | 'Out of Stock'>('In Stock');
  
  // Array State fields
  const [highlights, setHighlights] = useState<string[]>(['TSA compliant travel case', '150+ essential medicines']);
  const [newHighlight, setNewHighlight] = useState('');
  const [benefits, setBenefits] = useState<string[]>(['Avoid international clinic charges', '24/7 direct doctor link']);
  const [newBenefit, setNewBenefit] = useState('');
  const [specs, setSpecs] = useState<Record<string, string>>({ Material: 'Nylon', Waterproof: 'Yes' });
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([
    { q: 'Is it airline friendly?', a: 'Yes, liquid volumes conform to security check parameters.' }
  ]);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoKeys, setSeoKeys] = useState('');

  // Images
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=300'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleCreateNewClick = () => {
    setName('');
    setSku('TM-KIT-' + Math.floor(1000 + Math.random() * 9000));
    setPrice(3499);
    setOfferPrice(2650);
    setGst(18);
    setStock(120);
    setWeight('850g');
    setDimensions('22cm x 15cm x 8cm');
    setDescription('Comprehensive premium medical kit containing 150+ prescription and OTC medicines coupled with a 24/7 teleconsultation service card.');
    setHighlights(['TSA compliant travel case', '150+ essential medicines', 'Quick scan digital doctor card']);
    setBenefits(['Avoid overseas walk-in clinic charges', '24/7 direct US/EU doctor consultations', 'Waterproof shockproof nylon shell']);
    setSpecs({ Material: 'High-density Shockproof Nylon', Waterproof: 'IPX-5 Rated Zipper Seal', Certifications: 'FDA, WHO-GMP Approved Brands' });
    setFaqs([{ q: 'Can I carry it in my cabin bag?', a: 'Yes, it is strictly cabin-luggage friendly.' }]);
    setSeoTitle('Travel Med Kit - Premium Travel First Aid');
    setSeoDesc('Buy Premium Travel Medical Kit with 24/7 doctor consultations included.');
    setSeoKeys('travel medical kit, travel first aid, travel doctor');
    setImages(['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=300']);
    setIsCreating(true);
    setEditingId(null);
    setFormTab('general');
  };

  const handleEdit = (prod: any) => {
    setEditingId(prod.id);
    setName(prod.name);
    setSku(prod.sku);
    setPrice(prod.price);
    setOfferPrice(prod.offerPrice);
    setGst(prod.gst);
    setStock(prod.stock);
    setWeight(prod.weight);
    setDimensions(prod.dimensions);
    setDescription(prod.description);
    setHighlights(prod.highlights || []);
    setBenefits(prod.benefits || []);
    setSpecs(prod.specifications || {});
    setFaqs(prod.faq || []);
    setSeoTitle(prod.seoTitle || '');
    setSeoDesc(prod.seoDesc || '');
    setSeoKeys(prod.seoKeys || '');
    setImages(prod.images || []);
    setIsCreating(true);
    setFormTab('general');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      setProducts(prev => prev.map(p => p.id === editingId ? {
        ...p,
        name, sku, price, offerPrice, gst, stock, weight, dimensions, description,
        highlights, benefits, specifications: specs, faq: faqs, seoTitle, seoDesc, seoKeys,
        images, visibility, status
      } : p));
      addActivityLog('Product Updated', `Updated product: ${name} (SKU: ${sku})`);
    } else {
      const newProduct = {
        id: 'p-' + Math.floor(100 + Math.random() * 900),
        name, sku, price, offerPrice, gst, stock, weight, dimensions, description,
        highlights, benefits, specifications: specs, faq: faqs, seoTitle, seoDesc, seoKeys,
        images, visibility, status
      };
      setProducts(prev => [...prev, newProduct]);
      addActivityLog('Product Created', `Created product: ${name} (SKU: ${sku})`);
    }

    setIsCreating(false);
    setEditingId(null);
  };

  const handleDelete = (id: string, prodName: string) => {
    if (confirm(`Are you sure you want to delete ${prodName}?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      addActivityLog('Product Deleted', `Deleted product: ${prodName}`);
    }
  };

  return (
    <div className="space-y-6 text-slate-650">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="text-left">
          <h2 className="text-xl font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
            <Package className="h-5 w-5 text-teal-650" /> Products Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configure and manage storefront products.</p>
        </div>
        {!isCreating && (
          <button 
            onClick={handleCreateNewClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0B4F8C] text-white rounded-xl font-bold text-xs hover:bg-[#083B69] shadow-sm transition cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Create Product
          </button>
        )}
      </div>

      {/* VIEW MODES */}
      {!isCreating ? (
        
        /* ── PRODUCTS LIST ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div key={prod.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-sm transition flex flex-col justify-between">
              
              {/* Product Thumbnail */}
              <div className="h-48 bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-200">
                <img 
                  src={prod.images && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=300'} 
                  alt={prod.name}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase ${
                    prod.status === 'In Stock' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                      : 'bg-rose-50 text-rose-600 border-rose-200'
                  }`}>
                    {prod.status}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase ${
                    prod.visibility === 'Visible' 
                      ? 'bg-teal-50 text-teal-650 border-teal-200' 
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {prod.visibility}
                  </span>
                </div>
              </div>

              {/* Product Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SKU: {prod.sku}</p>
                  <h3 className="text-base font-extrabold text-[#172B4D] leading-tight">{prod.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 pt-1">{prod.description}</p>
                </div>

                {/* Price and Details */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-800">₹{prod.offerPrice.toLocaleString()}</span>
                  {prod.price > prod.offerPrice && (
                    <span className="text-xs text-slate-400 line-through">₹{prod.price.toLocaleString()}</span>
                  )}
                  <span className="text-[9px] font-bold text-teal-600 uppercase bg-teal-50 px-1.5 py-0.5 rounded">
                    {Math.round(((prod.price - prod.offerPrice) / prod.price) * 100)}% OFF
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs font-semibold">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">CURRENT STOCK</span>
                    <span className="text-slate-700 font-bold">{prod.stock} units</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">WEIGHT / DIM</span>
                    <span className="text-slate-750 font-bold truncate block">{prod.weight || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="bg-slate-50/50 border-t border-slate-100 px-5 py-3 flex gap-3 justify-end">
                <button 
                  onClick={() => handleEdit(prod)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 font-bold rounded-xl transition cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </button>
                {products.length > 1 && (
                  <button 
                    onClick={() => handleDelete(prod.id, prod.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-500 hover:text-white text-xs text-rose-650 font-bold rounded-xl transition cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

      ) : (

        /* ── CREATE / EDIT PRODUCT TABS FORM ── */
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl text-left space-y-6 p-6">
          
          {/* Form Header */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-teal-650" /> {editingId ? 'Edit Product Setup' : 'Create New Kit Registry'}
            </h3>
            <button 
              type="button" 
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
            {[
              { id: 'general', label: 'General & Pricing', icon: Package },
              { id: 'features', label: 'Highlights & Specs', icon: ListPlus },
              { id: 'seo_faq', label: 'FAQ & SEO Meta', icon: Globe },
              { id: 'media', label: 'Media Assets', icon: ImageIcon }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFormTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  formTab === tab.id 
                    ? 'bg-[#0B4F8C] text-white shadow-sm font-black' 
                    : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {React.createElement(tab.icon, { className: "h-3.5 w-3.5" })}
                {tab.label}
              </button>
            ))}
          </div>

          {/* FORM VIEW CONTROLLER */}
          <div className="min-h-[300px]">
            
            {/* T1: GENERAL AND PRICING */}
            {formTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
                
                {/* Product Name */}
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">Product Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="e.g. Travel Med Premium Kit"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C] focus:ring-1 focus:ring-[#0B4F8C]"
                    required
                  />
                </div>

                {/* SKU & Stock */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">SKU Code</label>
                  <input 
                    type="text" 
                    value={sku} 
                    onChange={e => setSku(e.target.value)} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-855 focus:outline-none focus:border-[#0B4F8C]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">Stock Units Available</label>
                  <input 
                    type="number" 
                    value={stock || ''} 
                    onChange={e => setStock(e.target.value ? parseInt(e.target.value) : ('' as any))} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-855 focus:outline-none focus:border-[#0B4F8C]"
                  />
                </div>

                {/* Prices */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">Base Price (INR)</label>
                  <input 
                    type="number" 
                    value={price || ''} 
                    onChange={e => setPrice(e.target.value ? parseFloat(e.target.value) : ('' as any))} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-855 focus:outline-none focus:border-[#0B4F8C] font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">Offer / Sale Price (INR)</label>
                  <input 
                    type="number" 
                    value={offerPrice || ''} 
                    onChange={e => setOfferPrice(e.target.value ? parseFloat(e.target.value) : ('' as any))} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-855 focus:outline-none focus:border-[#0B4F8C] font-mono"
                  />
                </div>

                {/* Logistics */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">Weight (grams/kg)</label>
                  <input 
                    type="text" 
                    value={weight} 
                    onChange={e => setWeight(e.target.value)} 
                    placeholder="e.g. 750g"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-855 focus:outline-none focus:border-[#0B4F8C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">Dimensions (L x W x H)</label>
                  <input 
                    type="text" 
                    value={dimensions} 
                    onChange={e => setDimensions(e.target.value)} 
                    placeholder="e.g. 20cm x 12cm x 6cm"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-855 focus:outline-none focus:border-[#0B4F8C]"
                  />
                </div>

                {/* Status Options */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">Inventory Status</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-855 focus:outline-none focus:border-[#0B4F8C]"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">Visibility Mode</label>
                  <select 
                    value={visibility} 
                    onChange={e => setVisibility(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-855 focus:outline-none focus:border-[#0B4F8C]"
                  >
                    <option value="Visible">Visible (On Storefront)</option>
                    <option value="Hidden">Hidden (Internal Draft)</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">Product Description</label>
                  <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    rows={4}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-855 focus:outline-none focus:border-[#0B4F8C] leading-relaxed"
                  />
                </div>

              </div>
            )}

            {/* T2: FEATURES AND SPECIFICATIONS */}
            {formTab === 'features' && (
              <div className="space-y-6 text-xs font-semibold">
                
                {/* Highlights List Builder */}
                <div className="space-y-3">
                  <label className="text-slate-505 font-bold uppercase tracking-wider block text-left">Product Highlights</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newHighlight} 
                      onChange={e => setNewHighlight(e.target.value)} 
                      placeholder="Add highlight point..."
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (newHighlight.trim()) {
                          setHighlights([...highlights, newHighlight.trim()]);
                          setNewHighlight('');
                        }
                      }}
                      className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-teal-650 rounded-xl border border-slate-200 font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {highlights.map((h, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 font-medium">
                        {h}
                        <button type="button" onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))} className="text-rose-600 hover:text-rose-500">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Benefits List Builder */}
                <div className="space-y-3">
                  <label className="text-slate-505 font-bold uppercase tracking-wider block text-left">Client Benefits</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newBenefit} 
                      onChange={e => setNewBenefit(e.target.value)} 
                      placeholder="Add benefit statement..."
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (newBenefit.trim()) {
                          setBenefits([...benefits, newBenefit.trim()]);
                          setNewBenefit('');
                        }
                      }}
                      className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-teal-650 rounded-xl border border-slate-200 font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {benefits.map((b, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 font-medium">
                        {b}
                        <button type="button" onClick={() => setBenefits(benefits.filter((_, idx) => idx !== i))} className="text-rose-600 hover:text-rose-500">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specifications Key Value Builder */}
                <div className="space-y-3">
                  <label className="text-slate-505 font-bold uppercase tracking-wider block text-left">Specifications Registry</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newSpecKey} 
                      onChange={e => setNewSpecKey(e.target.value)} 
                      placeholder="Property Name (e.g. Material)"
                      className="w-1/3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                    />
                    <input 
                      type="text" 
                      value={newSpecVal} 
                      onChange={e => setNewSpecVal(e.target.value)} 
                      placeholder="Value (e.g. Nylon)"
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (newSpecKey.trim() && newSpecVal.trim()) {
                          setSpecs({ ...specs, [newSpecKey.trim()]: newSpecVal.trim() });
                          setNewSpecKey('');
                          setNewSpecVal('');
                        }
                      }}
                      className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-teal-650 rounded-xl border border-slate-200 font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {Object.entries(specs).map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="text-left">
                          <span className="text-[9px] font-bold text-slate-450 block uppercase">{k}</span>
                          <span className="text-slate-700 font-bold">{v}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => {
                            const copy = { ...specs };
                            delete copy[k];
                            setSpecs(copy);
                          }}
                          className="text-rose-600 hover:text-rose-500 hover:bg-slate-100 p-1 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* T3: FAQ & SEO METADATA */}
            {formTab === 'seo_faq' && (
              <div className="space-y-6 text-xs font-semibold">
                
                {/* FAQs Accordion Builder */}
                <div className="space-y-3">
                  <label className="text-slate-505 font-bold uppercase tracking-wider block text-left">Product FAQ Builder</label>
                  <div className="space-y-2.5 bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <input 
                      type="text" 
                      value={newFaqQ} 
                      onChange={e => setNewFaqQ(e.target.value)} 
                      placeholder="Frequently Asked Question..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                    />
                    <textarea 
                      value={newFaqA} 
                      onChange={e => setNewFaqA(e.target.value)} 
                      placeholder="Answer details..."
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:border-[#0B4F8C] leading-relaxed"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (newFaqQ.trim() && newFaqA.trim()) {
                          setFaqs([...faqs, { q: newFaqQ.trim(), a: newFaqA.trim() }]);
                          setNewFaqQ('');
                          setNewFaqA('');
                        }
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 font-bold text-center"
                    >
                      Register FAQ Node
                    </button>
                  </div>
                  <div className="space-y-2">
                    {faqs.map((faq, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex justify-between gap-4">
                        <div className="space-y-1 text-left">
                          <p className="font-bold text-slate-800 flex items-center gap-1.5"><HelpCircle className="h-3.5 w-3.5 text-blue-600 shrink-0" /> {faq.q}</p>
                          <p className="text-slate-500 pl-5">{faq.a}</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                          className="text-rose-600 hover:text-rose-500 shrink-0 self-start p-1 rounded hover:bg-slate-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SEO Optimization Fields */}
                <div className="space-y-4 border-t border-slate-200 pt-6">
                  <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-1.5"><Globe className="h-4.5 w-4.5 text-teal-650" /> Search Engine Optimizations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-slate-500 font-bold uppercase tracking-wider">SEO Meta Title</label>
                      <input 
                        type="text" 
                        value={seoTitle} 
                        onChange={e => setSeoTitle(e.target.value)} 
                        placeholder="Google Title Tag..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-slate-500 font-bold uppercase tracking-wider">SEO Focus Keywords</label>
                      <input 
                        type="text" 
                        value={seoKeys} 
                        onChange={e => setSeoKeys(e.target.value)} 
                        placeholder="Keywords separated by commas..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                      />
                    </div>
                    <div className="space-y-1.5 text-left col-span-1 md:col-span-2">
                      <label className="text-slate-500 font-bold uppercase tracking-wider">SEO Meta Description</label>
                      <textarea 
                        value={seoDesc} 
                        onChange={e => setSeoDesc(e.target.value)} 
                        rows={2}
                        placeholder="Brief summary snippet for search results..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* T4: MEDIA ASSETS GALLERY */}
            {formTab === 'media' && (
              <div className="space-y-6 text-xs font-semibold">
                
                {/* Image Gallery Uploader Mock */}
                <div className="space-y-3">
                  <label className="text-slate-500 font-bold uppercase tracking-wider block text-left">Add Image to Gallery</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newImageUrl} 
                      onChange={e => setNewImageUrl(e.target.value)} 
                      placeholder="Paste image URL..."
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (newImageUrl.trim()) {
                          setImages([...images, newImageUrl.trim()]);
                          setNewImageUrl('');
                        }
                      }}
                      className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-teal-650 rounded-xl border border-slate-200 font-bold"
                    >
                      Insert
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-slate-500 font-bold uppercase tracking-wider block">Active Asset Files ({images.length})</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {images.map((img, i) => (
                      <div key={i} className="relative aspect-video rounded-xl bg-slate-50 border border-slate-200 overflow-hidden group">
                        <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">
                          <button 
                            type="button"
                            onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                            className="p-1.5 bg-rose-500 text-white hover:bg-rose-600 rounded-lg transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Form Actions Footer */}
          <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsCreating(false)}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 font-bold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0B4F8C] hover:bg-[#083B69] text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              <Save className="h-4 w-4" /> Save Kit Configuration
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
