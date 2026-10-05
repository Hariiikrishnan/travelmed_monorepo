import React, { useMemo, useState } from 'react';
import {
  Package, Plus, Edit2, Trash2, Copy, X, Sparkles, Star, EyeOff, Pill, Stethoscope, Briefcase,
  Globe, Image as ImageIcon, ListPlus, IndianRupee, Search, Loader2,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
/** Website origin — kit photos and category icons are stored as website paths like /icons/x.webp */
const SITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000';
const assetUrl = (src: string) => (src.startsWith('/') ? `${SITE_URL}${src}` : src);

/** API products are used as-is; kept as a function so callers have one mapping point. */
export const toProductView = (p: any) => p;

const authHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('travelmed_admin_token') : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

type KitItemForm = { medicineId: string; quantity: number; unit: string; note: string };

interface KitForm {
  name: string;
  slug: string;
  sku: string;
  kitTypeId: string;
  tagline: string;
  tripLength: string;
  isFeatured: boolean;
  sortOrder: number;
  mrp: number;
  price: number;
  gstPercent: number;
  stock: number;
  status: 'In Stock' | 'Out of Stock';
  visibility: 'Visible' | 'Hidden';
  description: string;
  consultsIncluded: number;
  bagSize: string;
  bagWeight: string;
  specs: Record<string, string>;
  highlights: string[];
  benefits: string[];
  items: KitItemForm[];
  faqs: { q: string; a: string }[];
  images: string[];
  seoTitle: string;
  seoDescription: string;
}

const EMPTY: KitForm = {
  name: '', slug: '', sku: '', kitTypeId: '', tagline: '', tripLength: '', isFeatured: false, sortOrder: 0,
  mrp: 0, price: 0, gstPercent: 5, stock: 0, status: 'In Stock', visibility: 'Hidden', description: '',
  consultsIncluded: 0, bagSize: '', bagWeight: '', specs: {}, highlights: [], benefits: [], items: [],
  faqs: [], images: [], seoTitle: '', seoDescription: '',
};

const fromProduct = (p: any): KitForm => ({
  name: p.name ?? '',
  slug: p.slug ?? '',
  sku: p.sku ?? '',
  kitTypeId: p.kitTypeId ?? '',
  tagline: p.tagline ?? '',
  tripLength: p.tripLength ?? '',
  isFeatured: Boolean(p.isFeatured),
  sortOrder: p.sortOrder ?? 0,
  mrp: p.mrp ?? 0,
  price: p.price ?? 0,
  gstPercent: p.gstPercent ?? 5,
  stock: p.stock ?? 0,
  status: p.status ?? 'In Stock',
  visibility: p.visibility ?? 'Visible',
  description: p.description ?? '',
  consultsIncluded: p.consultsIncluded ?? 0,
  bagSize: p.bagSize ?? '',
  bagWeight: p.bagWeight ?? '',
  specs: Object.fromEntries(Object.entries(p.specs ?? {}).filter(([k]) => k !== 'Dimensions' && k !== 'Weight')) as Record<string, string>,
  highlights: p.highlights ?? [],
  benefits: p.benefits ?? [],
  items: (p.items ?? []).map((i: any) => ({ medicineId: i.medicineId, quantity: i.quantity, unit: i.unit, note: i.note ?? '' })),
  faqs: p.faqs ?? [],
  images: p.images ?? [],
  seoTitle: p.seoTitle ?? '',
  seoDescription: p.seoDescription ?? '',
});

const slugify = (text: string) => text.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const inr = (n: number) => `₹${Math.round(Number(n) || 0).toLocaleString('en-IN')}`;
const UNITS = ['tablets', 'capsules', 'strips', 'sachets', 'pcs', 'pack', 'ml', 'tube', 'bottle'];

const inputCls = 'w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C] focus:ring-1 focus:ring-[#0B4F8C]';
const labelCls = 'text-slate-500 font-bold uppercase tracking-wider';

function Field({ label, hint, children, wide }: { label: string; hint?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`space-y-1.5 ${wide ? 'md:col-span-2' : ''}`}>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="text-[10px] font-medium text-slate-400">{hint}</p>}
    </div>
  );
}

/** Editable list of short strings (highlights, benefits, image URLs). */
function ListEditor({ values, onChange, placeholder }: { values: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    if (!draft.trim()) return;
    onChange([...values, draft.trim()]);
    setDraft('');
  };
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={`${v}-${i}`} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="flex-1 truncate text-slate-700">{v}</span>
          <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} aria-label="Remove" className="text-slate-400 hover:text-rose-600 cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())} placeholder={placeholder} className={inputCls} />
        <button type="button" onClick={add} className="shrink-0 rounded-xl bg-[#0B4F8C] px-4 font-bold text-white cursor-pointer">Add</button>
      </div>
    </div>
  );
}

interface ProductsViewProps {
  products: any[];
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
  addActivityLog: (action: string, changes: string) => void;
  medicines: any[];
  medicineCategories: any[];
  kitTypes: any[];
}

type Tab = 'general' | 'pricing' | 'contents' | 'bag' | 'details' | 'media' | 'seo';

export default function ProductsView({ products, setProducts, addActivityLog, medicines, medicineCategories, kitTypes }: ProductsViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('general');
  const [form, setForm] = useState<KitForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [medSearch, setMedSearch] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');

  const set = <K extends keyof KitForm>(key: K, value: KitForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const openEditor = (initial: KitForm, id: string | null) => {
    setForm(initial);
    setEditingId(id);
    setTab('general');
    setError('');
    setMedSearch('');
    setOpen(true);
  };

  const duplicate = (p: any) =>
    openEditor(
      {
        ...fromProduct(p),
        name: `${p.name} (Copy)`,
        slug: `${p.slug}-copy`,
        sku: `${p.sku}-COPY`,
        isFeatured: false,
        visibility: 'Hidden',
      },
      null
    );

  // ── Contents helpers ──
  const itemByMed = useMemo(() => new Map(form.items.map((i) => [i.medicineId, i])), [form.items]);
  const toggleMedicine = (medicineId: string) =>
    set('items', itemByMed.has(medicineId) ? form.items.filter((i) => i.medicineId !== medicineId) : [...form.items, { medicineId, quantity: 1, unit: 'tablets', note: '' }]);
  const patchItem = (medicineId: string, patch: Partial<KitItemForm>) =>
    set('items', form.items.map((i) => (i.medicineId === medicineId ? { ...i, ...patch } : i)));

  const groupedMedicines = useMemo(() => {
    const q = medSearch.trim().toLowerCase();
    const list = medicines.filter((m) => !q || m.name.toLowerCase().includes(q) || (m.activeIngredient ?? '').toLowerCase().includes(q));
    const order = new Map<string, number>(medicineCategories.map((c: any, i: number) => [c.id, i]));
    const groups = new Map<string, { name: string; icon: string; meds: any[] }>();
    for (const m of list) {
      const cat = m.medicineCategory ?? { id: 'none', name: m.category || 'Uncategorised', icon: '' };
      const g: { name: string; icon: string; meds: any[] } = groups.get(cat.id) ?? { name: cat.name, icon: cat.icon, meds: [] };
      g.meds.push(m);
      groups.set(cat.id, g);
    }
    return [...groups.entries()].sort((a, b) => (order.get(a[0]) ?? 999) - (order.get(b[0]) ?? 999));
  }, [medicines, medicineCategories, medSearch]);

  const totals = useMemo(() => {
    const selected = medicines.filter((m) => itemByMed.has(m.id));
    return {
      medicines: selected.length,
      units: form.items.reduce((s, i) => s + (Number(i.quantity) || 0), 0),
      categories: new Set(selected.map((m) => m.categoryId).filter(Boolean)).size,
    };
  }, [medicines, itemByMed, form.items]);

  // ── Save / delete ──
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Enter a kit name.');
    if (!form.price || !form.mrp || form.price > form.mrp) {
      setTab('pricing');
      return setError('Enter a selling price and an MRP. The selling price cannot be higher than the MRP.');
    }

    const payload = {
      ...form,
      slug: slugify(form.slug || form.name),
      sku: form.sku.trim() || slugify(form.name).toUpperCase(),
      kitTypeId: form.kitTypeId || null,
      mrp: Number(form.mrp),
      price: Number(form.price),
      gstPercent: Number(form.gstPercent) || 0,
      stock: Number(form.stock) || 0,
      sortOrder: Number(form.sortOrder) || 0,
      consultsIncluded: Number(form.consultsIncluded) || 0,
      specs: { ...form.specs, ...(form.bagSize ? { Dimensions: form.bagSize } : {}), ...(form.bagWeight ? { Weight: form.bagWeight } : {}) },
      items: form.items.map((i) => ({ ...i, quantity: Math.max(1, Number(i.quantity) || 1) })),
    };

    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/products${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Failed to save kit.');
      const saved = body.data;
      setProducts((prev) => {
        const rest = prev.filter((p) => p.id !== saved.id).map((p) => (saved.isFeatured ? { ...p, isFeatured: false } : p));
        return [...rest, saved].sort((a, b) => a.sortOrder - b.sortOrder);
      });
      addActivityLog(editingId ? 'Kit Updated' : 'Kit Created', `${saved.name} · ${inr(saved.price)} · ${saved.counts?.medicines ?? 0} medicines`);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save kit.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: any) => {
    if (!confirm(`Delete ${p.name}? It disappears from the website immediately. Past orders keep their details.`)) return;
    const res = await fetch(`${API_URL}/api/products/${p.id}`, { method: 'DELETE', headers: authHeaders() });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return alert(body.message || 'Failed to delete kit.');
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
    addActivityLog('Kit Deleted', p.name);
  };

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'general', label: 'General', icon: Package },
    { id: 'pricing', label: 'Pricing & Stock', icon: IndianRupee },
    { id: 'contents', label: `Contents (${form.items.length})`, icon: Pill },
    { id: 'bag', label: 'Bag & Consults', icon: Briefcase },
    { id: 'details', label: 'Highlights & FAQ', icon: ListPlus },
    { id: 'media', label: 'Photos', icon: ImageIcon },
    { id: 'seo', label: 'SEO', icon: Globe },
  ];

  return (
    <div className="space-y-6 text-slate-650">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="text-left">
          <h2 className="text-xl font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
            <Package className="h-5 w-5 text-teal-650" /> Kits
          </h2>
          <p className="text-xs text-slate-400 mt-1">Each kit has its own price, medicines, bag and free consultations. Changes go live on the website when you save.</p>
        </div>
        {!open && (
          <button onClick={() => openEditor(EMPTY, null)} className="flex items-center gap-1.5 bg-[#0B4F8C] hover:bg-[#0B4F8C]/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer">
            <Plus className="h-4 w-4" /> New kit
          </button>
        )}
      </div>

      {!open ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-sm transition flex flex-col text-left">
              <div className="h-44 bg-slate-50 relative flex items-center justify-center border-b border-slate-200">
                {p.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={assetUrl(p.images[0])} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="h-10 w-10 text-slate-300" />
                )}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {p.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700">
                      <Star className="h-3 w-3" /> Featured
                    </span>
                  )}
                  {p.visibility === 'Hidden' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[9px] font-bold uppercase text-slate-500">
                      <EyeOff className="h-3 w-3" /> Hidden
                    </span>
                  )}
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${p.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">{p.kitType?.name ?? 'No kit type'}</p>
                  <h3 className="mt-0.5 text-base font-extrabold text-[#172B4D] leading-tight">{p.name}</h3>
                  {p.tripLength && <p className="mt-0.5 text-xs font-semibold text-slate-500">{p.tripLength}</p>}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-800">{inr(p.price)}</span>
                  {p.mrp > p.price && <span className="text-xs text-slate-400 line-through">{inr(p.mrp)}</span>}
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-[11px] font-semibold">
                  <div><span className="block text-[9px] uppercase tracking-wider text-slate-400">Medicines</span>{p.counts?.medicines ?? 0} · {p.counts?.categories ?? 0} cat.</div>
                  <div><span className="block text-[9px] uppercase tracking-wider text-slate-400">Consults</span>{p.consultsIncluded} free</div>
                  <div><span className="block text-[9px] uppercase tracking-wider text-slate-400">Stock</span><span className={p.stock <= 10 ? 'text-rose-600' : ''}>{p.stock}</span></div>
                </div>
              </div>
              <div className="bg-slate-50/50 border-t border-slate-100 px-5 py-3 flex gap-2 justify-end">
                <button onClick={() => duplicate(p)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 font-bold rounded-xl cursor-pointer">
                  <Copy className="h-3.5 w-3.5" /> Duplicate
                </button>
                <button onClick={() => openEditor(fromProduct(p), p.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 font-bold rounded-xl cursor-pointer">
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </button>
                {products.length > 1 && (
                  <button onClick={() => handleDelete(p)} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-500 hover:text-white text-xs text-rose-600 font-bold rounded-xl cursor-pointer">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="col-span-full py-12 text-center text-sm text-slate-400">No kits yet. Create your first kit.</p>}
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl text-left space-y-6 p-6 text-xs font-semibold">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-teal-600" /> {editingId ? `Edit ${form.name || 'kit'}` : 'New kit'}
            </h3>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-600">{error}</div>}

          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${tab === t.id ? 'bg-[#0B4F8C] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <t.icon className="h-3.5 w-3.5" /> {t.label}
              </button>
            ))}
          </div>

          <div className="min-h-[320px]">
            {tab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Kit name" wide>
                  <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Short-Trip Travel Kit" className={inputCls} required />
                </Field>
                <Field label="Kit type" hint="Manage kit types in Categories.">
                  <select value={form.kitTypeId} onChange={(e) => set('kitTypeId', e.target.value)} className={inputCls}>
                    <option value="">— None —</option>
                    {kitTypes.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
                  </select>
                </Field>
                <Field label="Trip length" hint="Shown on the kit card, e.g. “Trips up to 10 days”.">
                  <input value={form.tripLength} onChange={(e) => set('tripLength', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Tagline" wide>
                  <input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="One line that sells this kit" className={inputCls} />
                </Field>
                <Field label="Description" wide>
                  <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} className={`${inputCls} leading-relaxed`} />
                </Field>
                <Field label="URL slug" hint={editingId ? 'The kit ID stays the same; the slug changes the web address /buy/<slug>.' : 'Web address: /buy/<slug>. Leave blank to use the name.'}>
                  <input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="short-trip-kit" className={inputCls} />
                </Field>
                <Field label="Display order" hint="Lower numbers appear first.">
                  <input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value))} className={inputCls} />
                </Field>
                <label className="md:col-span-2 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0B4F8C]" />
                  <span>
                    <span className="block font-bold text-slate-800">Featured kit</span>
                    <span className="text-[11px] font-medium text-slate-500">Used on the home page hero, price banner and FAQ. Only one kit can be featured.</span>
                  </span>
                </label>
              </div>
            )}

            {tab === 'pricing' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="MRP (₹) — shown struck through">
                  <input type="number" min={0} value={form.mrp || ''} onChange={(e) => set('mrp', Number(e.target.value))} className={`${inputCls} font-mono`} />
                </Field>
                <Field label="Selling price (₹) — charged on the website">
                  <input type="number" min={0} value={form.price || ''} onChange={(e) => set('price', Number(e.target.value))} className={`${inputCls} font-mono`} />
                </Field>
                {form.mrp > 0 && form.price > 0 && form.price <= form.mrp && (
                  <p className="md:col-span-2 rounded-xl bg-teal-50 px-4 py-2.5 text-teal-700">
                    Customers see “Save {Math.round(((form.mrp - form.price) / form.mrp) * 100)}% · You save {inr(form.mrp - form.price)}”.
                  </p>
                )}
                <Field label="GST %">
                  <input type="number" min={0} max={28} value={form.gstPercent} onChange={(e) => set('gstPercent', Number(e.target.value))} className={inputCls} />
                </Field>
                <Field label="SKU">
                  <input value={form.sku} onChange={(e) => set('sku', e.target.value)} placeholder="TM-KIT-SHORT" className={inputCls} />
                </Field>
                <Field label="Stock units">
                  <input type="number" min={0} value={form.stock} onChange={(e) => set('stock', Number(e.target.value))} className={inputCls} />
                </Field>
                <Field label="Stock status">
                  <select value={form.status} onChange={(e) => set('status', e.target.value as KitForm['status'])} className={inputCls}>
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </Field>
                <Field label="Visibility" wide>
                  <select value={form.visibility} onChange={(e) => set('visibility', e.target.value as KitForm['visibility'])} className={inputCls}>
                    <option value="Visible">Visible on the website</option>
                    <option value="Hidden">Hidden (draft)</option>
                  </select>
                </Field>
              </div>
            )}

            {tab === 'contents' && (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <p className="rounded-xl bg-[#EEF6FF] px-4 py-2.5 font-bold text-[#0B4F8C]">
                    {totals.medicines} medicines · {totals.units} units · {totals.categories} categories
                  </p>
                  <div className="relative md:w-72">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input value={medSearch} onChange={(e) => setMedSearch(e.target.value)} placeholder="Search medicines…" className={`${inputCls} pl-9`} />
                  </div>
                </div>
                <p className="text-[11px] font-medium text-slate-400">Tick the medicines in this kit and set how much is included. Add new medicines in the Medicines screen.</p>
                <div className="space-y-4">
                  {groupedMedicines.map(([catId, g]) => (
                    <div key={catId} className="rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 font-bold text-slate-700">
                        {g.icon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={assetUrl(g.icon)} alt="" className="h-5 w-5 object-contain" />
                        ) : (
                          <Pill className="h-4 w-4 text-slate-400" />
                        )}
                        {g.name}
                        <span className="ml-auto text-[10px] text-slate-400">{g.meds.filter((m) => itemByMed.has(m.id)).length}/{g.meds.length}</span>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {g.meds.map((m) => {
                          const item = itemByMed.get(m.id);
                          return (
                            <div key={m.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-2.5 ${item ? 'bg-teal-50/30' : ''}`}>
                              <label className="flex flex-1 items-center gap-3 cursor-pointer min-w-0">
                                <input type="checkbox" checked={Boolean(item)} onChange={() => toggleMedicine(m.id)} className="h-4 w-4 accent-[#0B4F8C]" />
                                <span className="min-w-0">
                                  <span className="block truncate font-bold text-slate-800">{m.name}</span>
                                  <span className="block truncate text-[10px] font-medium text-slate-400">{m.activeIngredient}</span>
                                </span>
                              </label>
                              {item && (
                                <div className="flex items-center gap-2">
                                  <input type="number" min={1} value={item.quantity} onChange={(e) => patchItem(m.id, { quantity: Number(e.target.value) })} aria-label="Quantity" className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 font-mono" />
                                  <select value={item.unit} onChange={(e) => patchItem(m.id, { unit: e.target.value })} aria-label="Unit" className="rounded-lg border border-slate-200 px-2 py-1.5">
                                    {[...new Set([...UNITS, item.unit])].map((u) => <option key={u}>{u}</option>)}
                                  </select>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {groupedMedicines.length === 0 && <p className="py-8 text-center text-slate-400">No medicines match.</p>}
                </div>
              </div>
            )}

            {tab === 'bag' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Bag size (L × W × H)">
                  <input value={form.bagSize} onChange={(e) => set('bagSize', e.target.value)} placeholder="e.g. 21 × 14 × 6 cm" className={inputCls} />
                </Field>
                <Field label="Packed weight">
                  <input value={form.bagWeight} onChange={(e) => set('bagWeight', e.target.value)} placeholder="e.g. 650 g" className={inputCls} />
                </Field>
                <div className="md:col-span-2 rounded-xl border border-teal-100 bg-teal-50/40 p-4 space-y-2">
                  <label className={`${labelCls} flex items-center gap-1.5`}><Stethoscope className="h-3.5 w-3.5" /> Free teleconsultations per kit</label>
                  <input type="number" min={0} max={10} value={form.consultsIncluded} onChange={(e) => set('consultsIncluded', Number(e.target.value))} className={`${inputCls} md:w-40`} />
                  <p className="text-[11px] font-medium text-slate-500">An order gets this many per kit bought (2 kits × {form.consultsIncluded} = {2 * form.consultsIncluded}). Set 0 if this kit has no doctor consultations.</p>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className={labelCls}>Other specifications</label>
                  {Object.entries(form.specs).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <span className="w-40 shrink-0 font-bold text-slate-700">{k}</span>
                      <span className="flex-1 truncate text-slate-600">{v}</span>
                      <button type="button" aria-label="Remove" onClick={() => set('specs', Object.fromEntries(Object.entries(form.specs).filter(([key]) => key !== k)))} className="text-slate-400 hover:text-rose-600 cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="e.g. Material" className={inputCls} />
                    <input value={specVal} onChange={(e) => setSpecVal(e.target.value)} placeholder="e.g. 1680D ballistic nylon" className={inputCls} />
                    <button type="button" onClick={() => { if (specKey.trim() && specVal.trim()) { set('specs', { ...form.specs, [specKey.trim()]: specVal.trim() }); setSpecKey(''); setSpecVal(''); } }} className="shrink-0 rounded-xl bg-[#0B4F8C] px-4 font-bold text-white cursor-pointer">Add</button>
                  </div>
                </div>
              </div>
            )}

            {tab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Highlights (bullet points on the kit page)">
                  <ListEditor values={form.highlights} onChange={(v) => set('highlights', v)} placeholder="e.g. Doctor-signed prescription" />
                </Field>
                <Field label="Benefits">
                  <ListEditor values={form.benefits} onChange={(v) => set('benefits', v)} placeholder="e.g. Avoid pharmacy hunts abroad" />
                </Field>
                <div className="md:col-span-2 space-y-2">
                  <label className={labelCls}>Kit FAQs</label>
                  {form.faqs.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex-1"><p className="font-bold text-slate-800">{f.q}</p><p className="mt-1 font-medium text-slate-500">{f.a}</p></div>
                      <button type="button" aria-label="Remove" onClick={() => set('faqs', form.faqs.filter((_, j) => j !== i))} className="text-slate-400 hover:text-rose-600 cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                  <input value={faqQ} onChange={(e) => setFaqQ(e.target.value)} placeholder="Question" className={inputCls} />
                  <textarea value={faqA} onChange={(e) => setFaqA(e.target.value)} placeholder="Answer" rows={2} className={inputCls} />
                  <button type="button" onClick={() => { if (faqQ.trim() && faqA.trim()) { set('faqs', [...form.faqs, { q: faqQ.trim(), a: faqA.trim() }]); setFaqQ(''); setFaqA(''); } }} className="rounded-xl bg-[#0B4F8C] px-4 py-2 font-bold text-white cursor-pointer">Add FAQ</button>
                </div>
              </div>
            )}

            {tab === 'media' && (
              <div className="space-y-4">
                <Field label="Photo URLs" hint="First photo is the main image. Use website paths like /products/trollybag.webp or full URLs.">
                  <ListEditor values={form.images} onChange={(v) => set('images', v)} placeholder="/products/backpack.webp" />
                </Field>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {form.images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={`${src}-${i}`} src={assetUrl(src)} alt="" className="aspect-square w-full rounded-xl border border-slate-200 object-cover" />
                  ))}
                </div>
              </div>
            )}

            {tab === 'seo' && (
              <div className="grid grid-cols-1 gap-5">
                <Field label={`SEO title (${form.seoTitle.length}/60)`}>
                  <input value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} maxLength={120} className={inputCls} />
                </Field>
                <Field label={`SEO description (${form.seoDescription.length}/160)`}>
                  <textarea value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} maxLength={320} rows={3} className={inputCls} />
                </Field>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B4F8C] font-bold text-white hover:bg-[#0B4F8C]/90 disabled:opacity-60 cursor-pointer">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'Saving…' : 'Save & publish to website'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
