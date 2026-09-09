import React, { useState, useMemo } from 'react';
import { 
  Pill, Plus, Search, Edit2, Trash2, Eye, EyeOff, Save, X, AlertTriangle 
} from 'lucide-react';

interface MedicinesViewProps {
  medicines: any[];
  setMedicines: React.Dispatch<React.SetStateAction<any[]>>;
  addActivityLog: (action: string, changes: string) => void;
}

export default function MedicinesView({
  medicines,
  setMedicines,
  addActivityLog,
}: MedicinesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Digestive Care');
  const [manufacturer, setManufacturer] = useState('');
  const [dosage, setDosage] = useState('');
  const [qty, setQty] = useState(1);
  const [expiry, setExpiry] = useState('');
  const [usage, setUsage] = useState('');
  const [warning, setWarning] = useState('');
  const [rxRequired, setRxRequired] = useState(false);
  const [stock, setStock] = useState(100);
  const [visibility, setVisibility] = useState<'Visible' | 'Hidden'>('Visible');
  const [image, setImage] = useState('');

  const categoriesList = ['Digestive Care', 'Pain Relief', 'Travel Sickness', 'First Aid', 'Cold & Fever', 'Doctor Support'];

  const filteredMedicines = useMemo(() => {
    return medicines.filter(med => {
      const matchesSearch = (med.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (med.manufacturer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (med.dosage || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [medicines, searchTerm, selectedCategory]);

  const handleCreateNewClick = () => {
    setName('');
    setCategory('Digestive Care');
    setManufacturer('Cipla Ltd.');
    setDosage('150mg');
    setQty(10);
    setExpiry('2028-06-30');
    setUsage('Take 1 capsule before food if feeling bloated.');
    setWarning('Do not exceed 3 capsules in a single 24-hour interval.');
    setRxRequired(false);
    setStock(150);
    setVisibility('Visible');
    setImage('https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=150&h=150');
    setEditingId(null);
    setIsCreating(true);
  };

  const handleEdit = (med: any) => {
    setEditingId(med.id);
    setName(med.name);
    setCategory(med.category);
    setManufacturer(med.manufacturer);
    setDosage(med.dosage);
    setQty(med.qty);
    setExpiry(med.expiry);
    setUsage(med.usage);
    setWarning(med.warning);
    setRxRequired(med.rxRequired);
    setStock(med.stock);
    setVisibility(med.visibility);
    setImage(med.image);
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedExpiry = expiry || new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const token = localStorage.getItem('travelmed_admin_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const medicineId = editingId || ('med-' + Math.random().toString(36).substring(2, 9));
    const medicineData = {
      id: medicineId,
      name,
      category,
      description: usage || 'No description provided.',
      activeIngredient: name,
      dosage: dosage || 'As directed by physician.',
      warning: warning || 'No warning provided.',
      sideEffects: 'None reported.',
      fdaStatus: rxRequired ? 'CDSCO Regulated / Prescription' : 'CDSCO Regulated / OTC',
      travelNote: 'Stable in standard climates.',
      compartment: 'A',
      alternative: 'None',
      symptoms: []
    };

    try {
      if (editingId) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/medicines/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(medicineData)
        });
        if (!response.ok) throw new Error('Failed to update medicine in database.');

        setMedicines(prev => prev.map(m => m.id === editingId ? { ...m, ...medicineData, stock, image } : m));
        addActivityLog('Medicine Edited', `Updated medicine registry: ${name} (${dosage})`);
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/medicines`, {
          method: 'POST',
          headers,
          body: JSON.stringify(medicineData)
        });
        if (!response.ok) throw new Error('Failed to save new medicine in database.');

        setMedicines(prev => [...prev, { ...medicineData, stock, image }]);
        addActivityLog('Medicine Created', `Registered new medicine item: ${name} (${dosage})`);
      }

      setIsCreating(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save medicine: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDelete = async (id: string, medName: string) => {
    if (confirm(`Remove ${medName} from the registered catalog?`)) {
      const token = localStorage.getItem('travelmed_admin_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/medicines/${id}`, {
          method: 'DELETE',
          headers
        });
        if (!response.ok) throw new Error('Failed to delete medicine from database.');

        setMedicines(prev => prev.filter(m => m.id !== id));
        addActivityLog('Medicine Deleted', `Deleted medicine item: ${medName}`);
      } catch (err) {
        console.error(err);
        alert('Failed to delete medicine: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    }
  };

  const toggleVisibility = (med: any) => {
    const nextVis = med.visibility === 'Visible' ? 'Hidden' : 'Visible';
    setMedicines(prev => prev.map(m => m.id === med.id ? { ...m, visibility: nextVis } : m));
    addActivityLog('Medicine Visibility Toggled', `Changed ${med.name} visibility to ${nextVis}`);
  };

  return (
    <div className="space-y-6 text-slate-650">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="text-left">
          <h2 className="text-xl font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
            <Pill className="h-5 w-5 text-teal-650" /> Medicine Inventory Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configure individual components stored inside the Travel Med pouch.</p>
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
        
        /* ── CATALOG CONTAINER ── */
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="flex-1 max-w-md relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search name, manufacturer, dosage..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0B4F8C] focus:ring-1 focus:ring-[#0B4F8C]"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === 'all' 
                    ? 'bg-[#0B4F8C] text-white font-black' 
                    : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                All
              </button>
              {categoriesList.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-[#0B4F8C] text-white font-black' 
                      : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredMedicines.map(med => (
              <div key={med.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition relative">
                
                {med.rxRequired && (
                  <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 text-[9px] font-black uppercase rounded">
                    Rx Req
                  </span>
                )}

                <div className="p-4 space-y-4">
                  {/* Avatar name header */}
                  <div className="flex gap-3.5 items-start">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      <img src={med.image} alt={med.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left space-y-0.5 min-w-0">
                      <h4 className="font-extrabold text-sm text-[#172B4D] truncate leading-tight">{med.name}</h4>
                      <p className="text-[9px] text-slate-400 font-bold truncate uppercase">{med.category}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-left border-t border-slate-100 pt-3 font-semibold">
                    <div className="flex justify-between">
                      <span className="text-slate-450 text-[9px] uppercase tracking-wider">DOSAGE</span>
                      <span className="text-slate-700 font-bold">{med.dosage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-450 text-[9px] uppercase tracking-wider">PACK QTY</span>
                      <span className="text-slate-700 font-bold">{med.qty} tabs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-455 text-[9px] uppercase tracking-wider">MOCK STOCK</span>
                      <span className={`font-extrabold ${med.stock < 10 ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`}>{med.stock} packs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-455 text-[9px] uppercase tracking-wider">EXPIRY DATE</span>
                      <span className="text-slate-500 font-mono font-bold">{med.expiry}</span>
                    </div>
                  </div>

                  <div className="text-left bg-slate-50 rounded-xl p-2.5 text-[10px] leading-relaxed border border-slate-150">
                    <span className="font-bold text-slate-400 block uppercase mb-0.5">Indication</span>
                    <span className="text-slate-600 font-medium italic line-clamp-2">"{med.usage}"</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="bg-slate-50/50 border-t border-slate-100 px-4 py-2.5 flex justify-between items-center">
                  <button 
                    onClick={() => toggleVisibility(med)}
                    className="p-1.5 bg-white border border-slate-200 text-slate-450 hover:text-slate-800 rounded-lg transition cursor-pointer animate-none"
                  >
                    {med.visibility === 'Visible' ? <Eye className="h-4.5 w-4.5" /> : <EyeOff className="h-4.5 w-4.5 text-rose-500" />}
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(med)}
                      className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-lg transition cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(med.id, med.name)}
                      className="p-1.5 bg-rose-50 border border-rose-200 text-rose-650 hover:bg-rose-500 hover:text-white rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      ) : (

        /* ── ADD / EDIT MEDICINE FORM MODAL ── */
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-6 max-w-2xl mx-auto">
          
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="h-4.5 w-4.5 text-teal-650" /> {editingId ? 'Edit Medicine Setup' : 'Add Pouch Medicine Component'}
            </h3>
            <button 
              type="button" 
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            
            {/* Name */}
            <div className="space-y-1.5 col-span-1 sm:col-span-2">
              <label className="text-slate-550 font-bold uppercase tracking-wider">Medicine Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Paracetamol"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-slate-550 font-bold uppercase tracking-wider">Category Classification</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-855 focus:outline-none focus:border-[#0B4F8C]"
              >
                {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Manufacturer */}
            <div className="space-y-1.5">
              <label className="text-slate-550 font-bold uppercase tracking-wider">Manufacturer / Brand</label>
              <input 
                type="text" 
                value={manufacturer}
                onChange={e => setManufacturer(e.target.value)}
                placeholder="e.g. Abbott Labs"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
              />
            </div>

            {/* Dosage */}
            <div className="space-y-1.5">
              <label className="text-slate-550 font-bold uppercase tracking-wider">Dosage Spec</label>
              <input 
                type="text" 
                value={dosage}
                onChange={e => setDosage(e.target.value)}
                placeholder="e.g. 500mg"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-805 focus:outline-none focus:border-[#0B4F8C]"
              />
            </div>

            {/* Quantity per Pouch */}
            <div className="space-y-1.5">
              <label className="text-slate-550 font-bold uppercase tracking-wider">Quantity per Kit (Strip Count / Pills)</label>
              <input 
                type="number" 
                value={qty}
                onChange={e => setQty(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-805 focus:outline-none focus:border-[#0B4F8C]"
              />
            </div>

            {/* Expiry */}
            <div className="space-y-1.5">
              <label className="text-slate-550 font-bold uppercase tracking-wider">Expiry Date</label>
              <input 
                type="date" 
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-805 focus:outline-none focus:border-[#0B4F8C] font-mono"
              />
            </div>

            {/* Mock Stock */}
            <div className="space-y-1.5">
              <label className="text-slate-550 font-bold uppercase tracking-wider">Warehouse Stock (Packs)</label>
              <input 
                type="number" 
                value={stock}
                onChange={e => setStock(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-805 focus:outline-none focus:border-[#0B4F8C]"
              />
            </div>

            {/* Prescription Requirement */}
            <div className="space-y-1.5">
              <label className="text-slate-550 font-bold uppercase tracking-wider block">Prescription Requirement</label>
              <select 
                value={rxRequired ? 'yes' : 'no'}
                onChange={e => setRxRequired(e.target.value === 'yes')}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-805 focus:outline-none focus:border-[#0B4F8C]"
              >
                <option value="no">OTC (No Rx Required)</option>
                <option value="yes">Rx Prescription Required</option>
              </select>
            </div>

            {/* Image link */}
            <div className="space-y-1.5">
              <label className="text-slate-550 font-bold uppercase tracking-wider">Asset URL</label>
              <input 
                type="text" 
                value={image}
                onChange={e => setImage(e.target.value)}
                placeholder="Image file link..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
              />
            </div>

            {/* Usage indications */}
            <div className="space-y-1.5 col-span-1 sm:col-span-2">
              <label className="text-slate-550 font-bold uppercase tracking-wider">Usage Details / Indications</label>
              <textarea 
                value={usage}
                onChange={e => setUsage(e.target.value)}
                rows={2}
                placeholder="How to take this medicine..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-805 focus:outline-none focus:border-[#0B4F8C] leading-relaxed"
              />
            </div>

            {/* Warning Notes */}
            <div className="space-y-1.5 col-span-1 sm:col-span-2">
              <label className="text-rose-600 font-bold uppercase tracking-wider flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Warning / Contraindications</label>
              <textarea 
                value={warning}
                onChange={e => setWarning(e.target.value)}
                rows={2}
                placeholder="Side effects, safety limits, warnings..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-805 focus:outline-none focus:border-[#0B4F8C] leading-relaxed"
              />
            </div>

          </div>

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
              <Save className="h-4 w-4" /> Save Medicine Item
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
