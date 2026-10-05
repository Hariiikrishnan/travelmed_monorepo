import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, X, Check, Loader2, Pill, Package } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const SITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000';
const assetUrl = (src: string) => (src.startsWith('/') ? `${SITE_URL}${src}` : src);

/** Icons that ship with the website (public/icons). Any other path or URL can be typed in. */
const ICON_LIBRARY = [
  '/icons/Antacids.webp', '/icons/Antimotility Drugs.webp', '/icons/cough.webp', '/icons/antibiotic.webp',
  '/icons/antihistamines.webp', '/icons/Motion Sickness Tablets.webp', '/icons/Antipyretic.svg', '/icons/Anticold.webp',
  '/icons/sore-throat.webp', '/icons/probiotics.webp', '/icons/bandage.webp',
];

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('travelmed_admin_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

type Kind = 'kit-types' | 'medicine-categories';

interface Draft {
  id?: string;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
  status: 'Active' | 'Inactive';
}

const EMPTY: Draft = { name: '', description: '', icon: '', sortOrder: 0, status: 'Active' };

interface CategoriesViewProps {
  kitTypes: any[];
  setKitTypes: React.Dispatch<React.SetStateAction<any[]>>;
  medicineCategories: any[];
  setMedicineCategories: React.Dispatch<React.SetStateAction<any[]>>;
  addActivityLog: (action: string, changes: string) => void;
}

const inputCls = 'w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]';

export default function CategoriesView({ kitTypes, setKitTypes, medicineCategories, setMedicineCategories, addActivityLog }: CategoriesViewProps) {
  const [kind, setKind] = useState<Kind>('kit-types');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isKit = kind === 'kit-types';
  const rows = isKit ? kitTypes : medicineCategories;
  const setRows = isKit ? setKitTypes : setMedicineCategories;
  const label = isKit ? 'kit type' : 'medicine category';

  const save = async () => {
    if (!draft || draft.name.trim().length < 2) return setError('Enter a name.');
    setSaving(true);
    setError('');
    const body = isKit
      ? { name: draft.name, description: draft.description, sortOrder: Number(draft.sortOrder) || 0, status: draft.status }
      : { name: draft.name, icon: draft.icon, sortOrder: Number(draft.sortOrder) || 0 };
    try {
      const res = await fetch(`${API_URL}/api/${kind}${draft.id ? `/${draft.id}` : ''}`, {
        method: draft.id ? 'PATCH' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || `Failed to save ${label}.`);
      setRows((prev) =>
        [...prev.filter((r) => r.id !== json.data.id), json.data].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
      );
      addActivityLog(draft.id ? 'Category Updated' : 'Category Created', `${isKit ? 'Kit type' : 'Medicine category'}: ${json.data.name}`);
      setDraft(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to save ${label}.`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: any) => {
    if (!confirm(`Delete ${row.name}?`)) return;
    const res = await fetch(`${API_URL}/api/${kind}/${row.id}`, { method: 'DELETE', headers: authHeaders() });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return alert(json.message || `Failed to delete ${label}.`);
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    addActivityLog('Category Deleted', row.name);
  };

  return (
    <div className="space-y-6 text-left text-xs font-semibold text-slate-650">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-5 w-5 text-teal-600" /> Categories
          </h2>
          <p className="mt-1 text-slate-400">
            Kit types group your kits on the website. Medicine categories group medicines and supply the icons in “What&apos;s included”.
          </p>
        </div>
        <button onClick={() => { setDraft({ ...EMPTY, sortOrder: rows.length + 1 }); setError(''); }} className="flex items-center gap-1.5 rounded-xl bg-[#0B4F8C] px-4 py-2.5 font-bold text-white cursor-pointer">
          <Plus className="h-4 w-4" /> New {label}
        </button>
      </div>

      <div className="flex gap-2">
        {([
          { id: 'kit-types', label: `Kit types (${kitTypes.length})`, icon: Package },
          { id: 'medicine-categories', label: `Medicine categories (${medicineCategories.length})`, icon: Pill },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => { setKind(t.id); setDraft(null); setError(''); }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-bold cursor-pointer ${kind === t.id ? 'bg-[#0B4F8C] text-white' : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {draft && (
        <div className="rounded-2xl border border-[#0B4F8C]/20 bg-[#EEF6FF]/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-bold uppercase tracking-wider text-[#172B4D]">{draft.id ? `Edit ${label}` : `New ${label}`}</p>
            <button onClick={() => setDraft(null)} aria-label="Close" className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="h-4 w-4" /></button>
          </div>
          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-600">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="space-y-1.5 md:col-span-2">
              <span className="block font-bold uppercase tracking-wider text-slate-500">Name</span>
              <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputCls} placeholder={isKit ? 'e.g. Short Trip' : 'e.g. Antacids'} />
            </label>
            <label className="space-y-1.5">
              <span className="block font-bold uppercase tracking-wider text-slate-500">Display order</span>
              <input type="number" value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} className={inputCls} />
            </label>
            {isKit ? (
              <>
                <label className="space-y-1.5 md:col-span-2">
                  <span className="block font-bold uppercase tracking-wider text-slate-500">Description</span>
                  <input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={inputCls} placeholder="Who this type of kit is for" />
                </label>
                <label className="space-y-1.5">
                  <span className="block font-bold uppercase tracking-wider text-slate-500">Status</span>
                  <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Draft['status'] })} className={inputCls}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </label>
              </>
            ) : (
              <div className="md:col-span-3 space-y-2">
                <span className="block font-bold uppercase tracking-wider text-slate-500">Icon</span>
                <div className="flex flex-wrap gap-2">
                  {ICON_LIBRARY.map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setDraft({ ...draft, icon: src })}
                      title={src}
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border bg-white cursor-pointer ${draft.icon === src ? 'border-[#0B4F8C] ring-2 ring-[#0B4F8C]/30' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetUrl(src)} alt="" className="h-7 w-7 object-contain" />
                    </button>
                  ))}
                  <button type="button" onClick={() => setDraft({ ...draft, icon: '' })} className={`h-12 rounded-xl border px-3 bg-white cursor-pointer ${draft.icon === '' ? 'border-[#0B4F8C] ring-2 ring-[#0B4F8C]/30' : 'border-slate-200'}`}>
                    Default
                  </button>
                </div>
                <input value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} className={inputCls} placeholder="Or paste a path (/icons/name.webp) or image URL" />
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#0B4F8C] px-5 py-2.5 font-bold text-white disabled:opacity-60 cursor-pointer">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              {!isKit && <th className="px-4 py-3 w-14">Icon</th>}
              <th className="px-4 py-3">Name</th>
              {isKit && <th className="px-4 py-3">Description</th>}
              <th className="px-4 py-3">{isKit ? 'Kits' : 'Medicines'}</th>
              {isKit && <th className="px-4 py-3">Status</th>}
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50">
                {!isKit && (
                  <td className="px-4 py-2.5">
                    {r.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={assetUrl(r.icon)} alt="" className="h-7 w-7 object-contain" />
                    ) : (
                      <Pill className="h-5 w-5 text-slate-300" />
                    )}
                  </td>
                )}
                <td className="px-4 py-2.5 font-bold text-slate-800">{r.name}</td>
                {isKit && <td className="px-4 py-2.5 text-slate-500">{r.description || '—'}</td>}
                <td className="px-4 py-2.5">{r.usage ?? 0}</td>
                {isKit && (
                  <td className="px-4 py-2.5">
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${r.status === 'Active' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>{r.status}</span>
                  </td>
                )}
                <td className="px-4 py-2.5 text-slate-400">{r.sortOrder}</td>
                <td className="px-4 py-2.5">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setDraft({ id: r.id, name: r.name, description: r.description ?? '', icon: r.icon ?? '', sortOrder: r.sortOrder, status: r.status ?? 'Active' }); setError(''); }}
                      aria-label={`Edit ${r.name}`}
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:text-[#0B4F8C] cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => remove(r)}
                      disabled={(r.usage ?? 0) > 0}
                      title={(r.usage ?? 0) > 0 ? 'In use — move its items first' : 'Delete'}
                      aria-label={`Delete ${r.name}`}
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-slate-400">Nothing here yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
