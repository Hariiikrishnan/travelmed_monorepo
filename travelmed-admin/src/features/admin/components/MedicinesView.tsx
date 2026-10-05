import React, { useState, useMemo } from 'react';
import { Pill, Plus, Search, Edit2, Trash2, Save, X, AlertTriangle, Loader2, Plane } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const authHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('travelmed_admin_token') : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

const RX_STATUS = 'CDSCO Regulated / Prescription Only';
const OTC_STATUS = 'DGCI Approved / Over The Counter';
const isRx = (m: any) => /prescription/i.test(m?.fdaStatus ?? '');

interface MedicinesViewProps {
  medicines: any[];
  setMedicines: React.Dispatch<React.SetStateAction<any[]>>;
  addActivityLog: (action: string, changes: string) => void;
  /** Managed in Categories → Medicine categories */
  medicineCategories: any[];
}

const EMPTY = {
  name: '',
  categoryId: '',
  activeIngredient: '',
  dosage: '',
  fdaStatus: OTC_STATUS,
  compartment: 'A',
  description: '',
  warning: '',
  sideEffects: '',
  travelNote: '',
  alternative: '',
  symptoms: '',
};

/** Medicines in the kit. Every field here maps 1:1 to the database — nothing is mock or local-only. */
export default function MedicinesView({ medicines, setMedicines, addActivityLog, medicineCategories }: MedicinesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Category filter chips: only categories that currently have medicines
  const categories = useMemo(
    () => medicineCategories.map((c) => c.name).filter((name) => medicines.some((m) => m.category === name)),
    [medicines, medicineCategories]
  );
  const compartments = useMemo(
    () => [...new Set(['A', 'B', 'C', 'D', 'First Aid Pouch', ...medicines.map((m) => m.compartment).filter(Boolean)])],
    [medicines]
  );

  const filteredMedicines = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return medicines.filter((med) => {
      const matchesSearch =
        !q ||
        (med.name || '').toLowerCase().includes(q) ||
        (med.activeIngredient || '').toLowerCase().includes(q) ||
        (med.dosage || '').toLowerCase().includes(q);
      return matchesSearch && (selectedCategory === 'all' || med.category === selectedCategory);
    });
  }, [medicines, searchTerm, selectedCategory]);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCreateNewClick = () => {
    setForm({ ...EMPTY, categoryId: medicineCategories[0]?.id ?? '' });
    setEditingId(null);
    setError('');
    setIsCreating(true);
  };

  const handleEdit = (med: any) => {
    setEditingId(med.id);
    setForm({
      name: med.name ?? '',
      categoryId: med.categoryId ?? '',
      activeIngredient: med.activeIngredient ?? '',
      dosage: med.dosage ?? '',
      fdaStatus: med.fdaStatus ?? OTC_STATUS,
      compartment: med.compartment ?? 'A',
      description: med.description ?? '',
      warning: med.warning ?? '',
      sideEffects: med.sideEffects ?? '',
      travelNote: med.travelNote ?? '',
      alternative: med.alternative ?? '',
      symptoms: (med.symptoms ?? []).join(', '),
    });
    setError('');
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.categoryId) {
      setError('Name and category are required.');
      return;
    }

    const slugId = 'med-' + form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      ...(editingId ? {} : { id: slugId }),
      name: form.name.trim(),
      categoryId: form.categoryId,
      activeIngredient: form.activeIngredient.trim() || form.name.trim(),
      dosage: form.dosage.trim(),
      fdaStatus: form.fdaStatus,
      compartment: form.compartment,
      description: form.description.trim(),
      warning: form.warning.trim(),
      sideEffects: form.sideEffects.trim(),
      travelNote: form.travelNote.trim(),
      alternative: form.alternative.trim(),
      symptoms: form.symptoms.split(',').map((s) => s.trim()).filter(Boolean),
    };

    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/medicines${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Failed to save medicine.');
      const saved = body.data;
      setMedicines((prev) => (editingId ? prev.map((m) => (m.id === editingId ? saved : m)) : [...prev, saved]));
      addActivityLog(editingId ? 'Medicine Edited' : 'Medicine Created', `${saved.name} (${saved.dosage})`);
      setIsCreating(false);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save medicine.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, medName: string) => {
    const kits = medicines.find((m) => m.id === id)?.kitItems?.map((k: any) => k.product.name) ?? [];
    const warning = kits.length ? `

It will also be removed from: ${kits.join(', ')}.` : '';
    if (!confirm(`Delete ${medName}?${warning}`)) return;
    try {
      const res = await fetch(`${API_URL}/api/medicines/${id}`, { method: 'DELETE', headers: authHeaders() });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Failed to delete medicine.');
      setMedicines((prev) => prev.filter((m) => m.id !== id));
      addActivityLog('Medicine Deleted', medName);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete medicine.');
    }
  };

  const inputCls = 'w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]';
  const labelCls = 'text-slate-500 font-bold uppercase tracking-wider';

  return (
    <div className="space-y-6 text-slate-650">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="text-left">
          <h2 className="text-xl font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
            <Pill className="h-5 w-5 text-teal-650" /> Kit Medicines
          </h2>
          <p className="text-xs text-slate-400 mt-1">{medicines.length} medicines in the Travel Med pouch catalogue.</p>
        </div>
        {!isCreating && (
          <button
            onClick={handleCreateNewClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0B4F8C] hover:bg-[#083B69] text-white rounded-xl font-bold text-xs shadow-sm transition cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Medicine
          </button>
        )}
      </div>

      {!isCreating ? (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="flex-1 max-w-md relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, ingredient, dosage…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
              {['all', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat ? 'bg-[#0B4F8C] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedicines.map((med) => (
              <div key={med.id} className="bg-white border border-slate-200 rounded-2xl flex flex-col justify-between hover:shadow-sm transition text-left">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-[#172B4D] leading-tight">{med.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{med.category}</p>
                    </div>
                    {isRx(med) && (
                      <span className="shrink-0 px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 text-[9px] font-black uppercase rounded">Rx</span>
                    )}
                  </div>
                  <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3 font-semibold">
                    <p className="flex justify-between gap-2"><span className="text-slate-400 text-[10px] uppercase">Dosage</span><span className="text-slate-700 text-right">{med.dosage || '—'}</span></p>
                    <p className="flex justify-between gap-2"><span className="text-slate-400 text-[10px] uppercase">Compartment</span><span className="text-slate-700">{med.compartment}</span></p>
                    <p className="flex justify-between gap-2"><span className="text-slate-400 text-[10px] uppercase">Ingredient</span><span className="text-slate-700 text-right truncate">{med.activeIngredient}</span></p>
                  </div>
                  {med.description && (
                    <p className="bg-slate-50 rounded-xl p-2.5 text-[11px] leading-relaxed text-slate-600 line-clamp-3">{med.description}</p>
                  )}
                  <p className="text-[10px] font-semibold text-slate-400">
                    {med.kitItems?.length
                      ? <>In: {med.kitItems.map((k: any) => `${k.product.name} (${k.quantity} ${k.unit})`).join(', ')}</>
                      : 'Not in any kit yet'}
                  </p>
                </div>
                <div className="bg-slate-50/50 border-t border-slate-100 px-4 py-2.5 flex justify-end gap-2">
                  <button onClick={() => handleEdit(med)} aria-label={`Edit ${med.name}`} className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(med.id, med.name)} aria-label={`Delete ${med.name}`} className="p-1.5 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {filteredMedicines.length === 0 && <div className="col-span-full py-12 text-center text-sm text-slate-400">No medicines found.</div>}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="h-4 w-4 text-teal-650" /> {editingId ? 'Edit Medicine' : 'Add Medicine to Kit'}
            </h3>
            <button type="button" onClick={() => setIsCreating(false)} aria-label="Close" className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <label className="space-y-1.5 sm:col-span-2">
              <span className={labelCls}>Medicine name</span>
              <input value={form.name} onChange={set('name')} placeholder="e.g. Paracetamol 650mg" className={inputCls} required />
            </label>
            <label className="space-y-1.5">
              <span className={labelCls}>Category</span>
              <select value={form.categoryId} onChange={set('categoryId')} className={inputCls} required>
                <option value="" disabled>Choose a category</option>
                {medicineCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <span className="block text-[10px] font-medium text-slate-400">Add or rename categories in Categories → Medicine categories.</span>
            </label>
            <label className="space-y-1.5">
              <span className={labelCls}>Active ingredient</span>
              <input value={form.activeIngredient} onChange={set('activeIngredient')} placeholder="e.g. Paracetamol (Acetaminophen)" className={inputCls} />
            </label>
            <label className="space-y-1.5">
              <span className={labelCls}>Dosage guidance</span>
              <input value={form.dosage} onChange={set('dosage')} placeholder="e.g. 1 tablet every 6 hours" className={inputCls} />
            </label>
            <label className="space-y-1.5">
              <span className={labelCls}>Regulatory status</span>
              <select value={form.fdaStatus} onChange={set('fdaStatus')} className={inputCls}>
                {[...new Set([OTC_STATUS, RX_STATUS, form.fdaStatus])].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className={labelCls}>Pouch compartment</span>
              <select value={form.compartment} onChange={set('compartment')} className={inputCls}>
                {compartments.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className={labelCls}>Symptoms it treats (comma separated)</span>
              <input value={form.symptoms} onChange={set('symptoms')} placeholder="fever, headache" className={inputCls} />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className={labelCls}>Description / indications</span>
              <textarea value={form.description} onChange={set('description')} rows={2} className={inputCls} />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-rose-600 font-bold uppercase tracking-wider flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Warning / contraindications</span>
              <textarea value={form.warning} onChange={set('warning')} rows={2} className={inputCls} />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className={labelCls}>Side effects</span>
              <textarea value={form.sideEffects} onChange={set('sideEffects')} rows={2} className={inputCls} />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className={labelCls + ' flex items-center gap-1'}><Plane className="h-3.5 w-3.5" /> Travel &amp; customs note</span>
              <textarea value={form.travelNote} onChange={set('travelNote')} rows={2} className={inputCls} />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className={labelCls}>Common alternatives</span>
              <input value={form.alternative} onChange={set('alternative')} className={inputCls} />
            </label>
          </div>

          <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 font-bold rounded-xl cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0B4F8C] hover:bg-[#083B69] text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Medicine
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
