import React, { useState, useEffect } from 'react';
import {
  Video, Plus, Edit2, Save, X, Award, MessageCircle, Stethoscope, MapPin, Link2, Loader2, StickyNote,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const authHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('travelmed_admin_token') : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

export const BOOKING_STATUSES = ['New', 'Contacted', 'Completed', 'Cancelled'] as const;

interface TeleconsultationViewProps {
  bookings: any[];
  setBookings: React.Dispatch<React.SetStateAction<any[]>>;
  doctors: any[];
  setDoctors: React.Dispatch<React.SetStateAction<any[]>>;
  addActivityLog: (action: string, changes: string) => void;
  /** Opens the order in the Orders view */
  onOpenOrder?: (orderId: string) => void;
  /** Reloads bookings/orders so per-order usage counts stay accurate */
  onRefresh?: () => void;
}

const statusStyle: Record<string, string> = {
  New: 'bg-blue-50 text-[#0B4F8C] border-blue-200',
  Contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const waLink = (num: string) => `https://wa.me/${num.replace(/[^\d]/g, '')}`;

export default function TeleconsultationView({
  bookings,
  setBookings,
  doctors,
  setDoctors,
  addActivityLog,
  onOpenOrder,
  onRefresh,
}: TeleconsultationViewProps) {
  const [teleTab, setTeleTab] = useState<'bookings' | 'doctors' | 'pricing'>('bookings');
  const [bookingFilter, setBookingFilter] = useState<'all' | (typeof BOOKING_STATUSES)[number]>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState('');
  const [draft, setDraft] = useState<Record<string, { meetingLink: string; notes: string }>>({});

  // Pricing form
  const [consultationPrice, setConsultationPrice] = useState<number>(0);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [savingPrice, setSavingPrice] = useState(false);
  const [priceError, setPriceError] = useState('');
  
  useEffect(() => {
    if (teleTab === 'pricing') {
      setLoadingPrice(true);
      fetch(`${API_URL}/api/products/paid-consultation`, { headers: authHeaders() })
        .then(res => res.json())
        .then(body => {
          if (body.data?.price) {
            setConsultationPrice(body.data.price);
          }
        })
        .catch(() => setPriceError('Failed to load consultation price'))
        .finally(() => setLoadingPrice(false));
    }
  }, [teleTab]);

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrice(true);
    setPriceError('');
    try {
      const res = await fetch(`${API_URL}/api/products/paid-consultation`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ price: consultationPrice }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Failed to save price');
      addActivityLog('Consultation Price Updated', `New price: ₹${consultationPrice}`);
      alert('Price updated successfully');
    } catch (err) {
      setPriceError(err instanceof Error ? err.message : 'Failed to save price');
    } finally {
      setSavingPrice(false);
    }
  };

  // Doctor form
  const [isEditingDoctor, setIsEditingDoctor] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [doctorError, setDoctorError] = useState('');
  const [savingDoctor, setSavingDoctor] = useState(false);
  const [docName, setDocName] = useState('');
  const [docQual, setDocQual] = useState('');
  const [docSpec, setDocSpec] = useState('');
  const [docExp, setDocExp] = useState('');
  const [docBio, setDocBio] = useState('');
  const [docFees, setDocFees] = useState<number | ''>('');
  const [docLangs, setDocLangs] = useState('English, Hindi');
  const [docDays, setDocDays] = useState('');
  const [docSlots, setDocSlots] = useState('');
  const [docStatus, setDocStatus] = useState<'Active' | 'Inactive'>('Active');
  const [docPhoto, setDocPhoto] = useState('');

  const filteredBookings = bookings.filter((b) => bookingFilter === 'all' || b.status === bookingFilter);
  const countBy = (status: string) => bookings.filter((b) => b.status === status).length;

  // ── Bookings ──
  const updateBooking = async (id: string, data: Record<string, unknown>, logText: string) => {
    setBusyId(id);
    setBookingError('');
    try {
      const res = await fetch(`${API_URL}/api/consultations/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(data) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Failed to update booking.');
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...body.data } : b)));
      addActivityLog('Consultation Updated', logText);
      // Status changes affect per-order usage (a cancelled booking frees a slot)
      if ('status' in data) onRefresh?.();
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Failed to update booking.');
    } finally {
      setBusyId(null);
    }
  };

  const draftFor = (b: any) => draft[b.id] ?? { meetingLink: b.meetingLink ?? '', notes: b.notes ?? '' };

  // ── Doctors ──
  const resetDoctorForm = () => {
    setDocName('');
    setDocQual('');
    setDocSpec('');
    setDocExp('');
    setDocBio('');
    setDocFees('');
    setDocLangs('English, Hindi');
    setDocDays('');
    setDocSlots('');
    setDocStatus('Active');
    setDocPhoto('');
    setDoctorError('');
  };

  const handleCreateDoctorClick = () => {
    setEditingDoctorId(null);
    resetDoctorForm();
    setIsEditingDoctor(true);
  };

  const handleEditDoctor = (d: any) => {
    setEditingDoctorId(d.id);
    setDocName(d.name ?? '');
    setDocQual(d.qualification ?? '');
    setDocSpec(d.specialty ?? '');
    setDocExp(d.experience ?? '');
    setDocBio(d.bio ?? '');
    setDocFees(d.fees ?? '');
    setDocLangs((d.languages ?? []).join(', '));
    setDocDays((d.days ?? []).join(', '));
    setDocSlots((d.slots ?? []).join(', '));
    setDocStatus(d.status === 'Inactive' ? 'Inactive' : 'Active');
    setDocPhoto(d.image ?? '');
    setDoctorError('');
    setIsEditingDoctor(true);
  };

  const doctorPayload = (overrides: Record<string, unknown> = {}) => ({
    name: docName.trim(),
    specialty: docSpec.trim(),
    qualification: docQual.trim(),
    experience: docExp.trim(),
    bio: docBio.trim(),
    image: docPhoto.trim(),
    fees: docFees === '' ? null : Number(docFees),
    languages: docLangs.split(',').map((l) => l.trim()).filter(Boolean),
    days: docDays.split(',').map((d) => d.trim()).filter(Boolean),
    slots: docSlots.split(',').map((s) => s.trim()).filter(Boolean),
    status: docStatus,
    ...overrides,
  });

  const saveDoctor = async (id: string | null, payload: Record<string, unknown>) => {
    const res = await fetch(`${API_URL}/api/doctors${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.message || 'Failed to save doctor.');
    return body.data;
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docSpec.trim()) {
      setDoctorError('Name and speciality are required.');
      return;
    }
    setSavingDoctor(true);
    setDoctorError('');
    try {
      const saved = await saveDoctor(editingDoctorId, doctorPayload());
      setDoctors((prev) => (editingDoctorId ? prev.map((d) => (d.id === editingDoctorId ? saved : d)) : [...prev, saved]));
      addActivityLog(editingDoctorId ? 'Doctor Updated' : 'Doctor Profile Created', `Dr. ${saved.name}`);
      setIsEditingDoctor(false);
      setEditingDoctorId(null);
    } catch (err) {
      setDoctorError(err instanceof Error ? err.message : 'Failed to save doctor.');
    } finally {
      setSavingDoctor(false);
    }
  };

  const handleToggleDoctorStatus = async (d: any) => {
    const next = d.status === 'Inactive' ? 'Active' : 'Inactive';
    try {
      const saved = await saveDoctor(d.id, {
        name: d.name,
        specialty: d.specialty,
        qualification: d.qualification ?? '',
        experience: d.experience ?? '',
        bio: d.bio ?? '',
        image: d.image ?? '',
        fees: d.fees ?? null,
        languages: d.languages ?? [],
        days: d.days ?? [],
        slots: d.slots ?? [],
        status: next,
      });
      setDoctors((prev) => prev.map((x) => (x.id === d.id ? saved : x)));
      addActivityLog('Doctor Status Toggled', `Dr. ${d.name} → ${next}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update doctor.');
    }
  };

  const inputCls = 'w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]';

  return (
    <div className="space-y-6 text-slate-650">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="text-left">
          <h2 className="text-xl font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
            <Video className="h-5 w-5 text-teal-650" /> Telehealth Desk
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Free teleconsultation requests from customers (max 2 per order) and the doctor panel.
          </p>
        </div>
        <div className="flex gap-2 font-bold text-xs">
          {(['bookings', 'doctors', 'pricing'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTeleTab(t)}
              className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                teleTab === t ? 'bg-[#0B4F8C] text-white font-black' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900'
              }`}
            >
              {t === 'bookings' ? `Consultation Requests (${bookings.length})` : t === 'doctors' ? `Doctor Profiles (${doctors.length})` : 'Pricing'}
            </button>
          ))}
        </div>
      </div>

      {teleTab === 'bookings' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2 font-bold">
            {(['all', ...BOOKING_STATUSES] as const).map((f) => (
              <button
                key={f}
                onClick={() => setBookingFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                  bookingFilter === f ? 'bg-blue-50 text-[#0B4F8C] border border-blue-100' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900'
                }`}
              >
                {f === 'all' ? `All (${bookings.length})` : `${f} (${countBy(f)})`}
              </button>
            ))}
          </div>

          {bookingError && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">{bookingError}</div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredBookings.map((b) => {
              const d = draftFor(b);
              const busy = busyId === b.id;
              return (
                <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 text-left hover:shadow-sm transition">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                            b.sequence ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                          title="Which of the order's free consultations this is"
                        >
                          {b.sequence ? `Consult ${b.sequence}/${b.consultationsAllowed ?? 0}` : 'Cancelled'}
                        </span>
                        <button
                          type="button"
                          onClick={() => onOpenOrder?.(b.orderId)}
                          className="font-mono text-xs font-bold text-[#0B4F8C] hover:underline cursor-pointer"
                        >
                          {b.orderId}
                        </button>
                      </div>
                      <p className="text-sm font-extrabold text-[#172B4D]">{b.order?.shippingFullName ?? 'Customer'}</p>
                      <p className="text-[11px] font-semibold text-slate-400">
                        Requested {fmtDate(b.createdAt)} · {b.consultationsRemaining ?? 0} of {b.consultationsAllowed ?? 0} remaining on this order
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusStyle[b.status] ?? statusStyle.New}`}>
                      {b.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                    <div className="flex items-start gap-2">
                      <Stethoscope className="h-4 w-4 shrink-0 text-teal-600" />
                      <span><span className="block text-[9px] uppercase tracking-wider text-slate-400">Symptoms</span>{b.symptom}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-teal-600" />
                      <span><span className="block text-[9px] uppercase tracking-wider text-slate-400">Travelling in</span>{b.destination}</span>
                    </div>
                    <a href={waLink(b.whatsapp)} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-emerald-700 hover:underline">
                      <MessageCircle className="h-4 w-4 shrink-0" />
                      <span><span className="block text-[9px] uppercase tracking-wider text-slate-400">WhatsApp</span>{b.whatsapp}</span>
                    </a>
                    {b.order?.shippingEmail && (
                      <a href={`mailto:${b.order.shippingEmail}`} className="flex items-start gap-2 text-[#0B4F8C] hover:underline truncate">
                        <span><span className="block text-[9px] uppercase tracking-wider text-slate-400">Email</span>{b.order.shippingEmail}</span>
                      </a>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Status</span>
                      <select
                        value={b.status}
                        disabled={busy}
                        onChange={(e) => updateBooking(b.id, { status: e.target.value }, `${b.orderId}: status → ${e.target.value}`)}
                        className={inputCls + ' py-2 font-semibold'}
                      >
                        {BOOKING_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Assigned doctor</span>
                      <select
                        value={b.doctorId ?? ''}
                        disabled={busy}
                        onChange={(e) => {
                          const doc = doctors.find((x) => x.id === e.target.value);
                          updateBooking(b.id, { doctorId: e.target.value || null }, `${b.orderId}: doctor → ${doc ? `Dr. ${doc.name}` : 'unassigned'}`);
                        }}
                        className={inputCls + ' py-2 font-semibold'}
                      >
                        <option value="">Unassigned</option>
                        {doctors.filter((x) => x.status !== 'Inactive' || x.id === b.doctorId).map((doc) => (
                          <option key={doc.id} value={doc.id}>Dr. {doc.name} — {doc.specialty}</option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-1 sm:col-span-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><Link2 className="h-3 w-3" /> Video call link</span>
                      <input
                        value={d.meetingLink}
                        onChange={(e) => setDraft((p) => ({ ...p, [b.id]: { ...d, meetingLink: e.target.value } }))}
                        placeholder="https://meet.google.com/…"
                        className={inputCls + ' py-2'}
                      />
                    </label>
                    <label className="space-y-1 sm:col-span-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><StickyNote className="h-3 w-3" /> Internal notes</span>
                      <textarea
                        value={d.notes}
                        rows={2}
                        onChange={(e) => setDraft((p) => ({ ...p, [b.id]: { ...d, notes: e.target.value } }))}
                        placeholder="Call summary, advice given…"
                        className={inputCls + ' py-2'}
                      />
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    {b.meetingLink ? (
                      <a href={b.meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B4F8C] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#083B69]">
                        <Video className="h-3.5 w-3.5" /> Start call
                      </a>
                    ) : <span />}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        updateBooking(
                          b.id,
                          { meetingLink: d.meetingLink.trim() || null, notes: d.notes.trim() || null },
                          `${b.orderId}: link/notes updated`
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-[#0B4F8C] hover:text-[#0B4F8C] cursor-pointer disabled:opacity-60"
                    >
                      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save link &amp; notes
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredBookings.length === 0 && (
              <div className="col-span-full py-12 text-center text-sm text-slate-400 font-medium">
                No consultation requests {bookingFilter === 'all' ? 'yet' : `with status “${bookingFilter}”`}.
              </div>
            )}
          </div>
        </div>
      ) : teleTab === 'doctors' ? (
        <div className="space-y-6">
          {!isEditingDoctor && (
            <div className="flex justify-end">
              <button
                onClick={handleCreateDoctorClick}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0B4F8C] hover:bg-[#083B69] text-white rounded-xl font-bold text-xs shadow-sm transition cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Doctor Profile
              </button>
            </div>
          )}

          {!isEditingDoctor ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-sm transition text-left">
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="h-16 w-16 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center shrink-0">
                        {doc.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                        ) : (
                          <Stethoscope className="h-6 w-6 text-slate-300" />
                        )}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h4 className="font-extrabold text-sm text-[#172B4D] flex items-center gap-1 truncate">
                          Dr. {doc.name} <Award className="h-3.5 w-3.5 text-teal-650 shrink-0" />
                        </h4>
                        <p className="text-[10px] text-[#14B8A6] font-bold truncate uppercase">{doc.specialty}</p>
                        <p className="text-[10px] text-slate-450 font-bold truncate">{doc.qualification}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs font-semibold">
                      {doc.fees != null && (
                        <p className="flex justify-between"><span className="text-slate-400">Fees</span><span className="font-mono font-bold text-slate-700">₹{Number(doc.fees).toLocaleString('en-IN')}</span></p>
                      )}
                      <p className="flex justify-between gap-2"><span className="text-slate-400">Languages</span><span className="truncate font-bold text-slate-700">{(doc.languages ?? []).join(', ') || '—'}</span></p>
                      <p className="flex justify-between gap-2"><span className="text-slate-400">Days</span><span className="truncate font-bold text-slate-700">{(doc.days ?? []).join(', ') || '—'}</span></p>
                      <p className="flex justify-between gap-2"><span className="text-slate-400">Slots</span><span className="truncate font-bold text-slate-700">{(doc.slots ?? []).join(', ') || '—'}</span></p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <button
                      onClick={() => handleToggleDoctorStatus(doc)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer ${
                        doc.status === 'Inactive' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}
                      title="Inactive doctors are hidden from the website"
                    >
                      {doc.status === 'Inactive' ? 'Inactive' : 'Active'}
                    </button>
                    <button onClick={() => handleEditDoctor(doc)} className="flex items-center gap-1 text-xs font-bold text-[#0B4F8C] hover:underline cursor-pointer">
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                  </div>
                </div>
              ))}
              {doctors.length === 0 && <div className="col-span-full py-12 text-center text-sm text-slate-400">No doctors yet.</div>}
            </div>
          ) : (
            <form onSubmit={handleSaveDoctor} className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-6 max-w-2xl mx-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
                  {editingDoctorId ? 'Edit Doctor Profile' : 'Register New Doctor'}
                </h3>
                <button type="button" onClick={() => setIsEditingDoctor(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full cursor-pointer" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {doctorError && (
                <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">{doctorError}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <label className="space-y-1.5 sm:col-span-2">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Full name (without “Dr.”)</span>
                  <input value={docName} onChange={(e) => setDocName(e.target.value)} className={inputCls} required />
                </label>
                <label className="space-y-1.5">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Speciality</span>
                  <input value={docSpec} onChange={(e) => setDocSpec(e.target.value)} placeholder="e.g. General Physician" className={inputCls} required />
                </label>
                <label className="space-y-1.5">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Qualification</span>
                  <input value={docQual} onChange={(e) => setDocQual(e.target.value)} placeholder="e.g. MBBS, MD" className={inputCls} />
                </label>
                <label className="space-y-1.5">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Experience</span>
                  <input value={docExp} onChange={(e) => setDocExp(e.target.value)} placeholder="e.g. 12 years" className={inputCls} />
                </label>
                <label className="space-y-1.5">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Consultation fees (INR, optional)</span>
                  <input type="number" min={0} value={docFees} onChange={(e) => setDocFees(e.target.value === '' ? '' : Number(e.target.value))} className={inputCls + ' font-mono'} />
                </label>
                <label className="space-y-1.5 sm:col-span-2">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Photo URL</span>
                  <input value={docPhoto} onChange={(e) => setDocPhoto(e.target.value)} placeholder="https://…" className={inputCls} />
                </label>
                <label className="space-y-1.5 sm:col-span-2">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Short bio</span>
                  <textarea value={docBio} onChange={(e) => setDocBio(e.target.value)} rows={3} className={inputCls} />
                </label>
                <label className="space-y-1.5 sm:col-span-2">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Languages (comma separated)</span>
                  <input value={docLangs} onChange={(e) => setDocLangs(e.target.value)} className={inputCls} />
                </label>
                <label className="space-y-1.5">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Available days</span>
                  <input value={docDays} onChange={(e) => setDocDays(e.target.value)} placeholder="Mon, Tue, Wed" className={inputCls} />
                </label>
                <label className="space-y-1.5">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Time slots</span>
                  <input value={docSlots} onChange={(e) => setDocSlots(e.target.value)} placeholder="10:00 AM - 1:00 PM" className={inputCls} />
                </label>
                <label className="space-y-1.5">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Status</span>
                  <select value={docStatus} onChange={(e) => setDocStatus(e.target.value as 'Active' | 'Inactive')} className={inputCls}>
                    <option value="Active">Active (shown on website)</option>
                    <option value="Inactive">Inactive / on leave (hidden)</option>
                  </select>
                </label>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditingDoctor(false)} className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 font-bold rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={savingDoctor} className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0B4F8C] hover:bg-[#083B69] text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-60">
                  {savingDoctor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Doctor Profile
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <form onSubmit={handleSavePrice} className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-6 max-w-lg mx-auto">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
                Paid Consultation Pricing
              </h3>
              <p className="text-xs text-slate-400 mt-1">Set the price for users who buy an extra teleconsultation.</p>
            </div>

            {priceError && (
              <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">{priceError}</div>
            )}

            {loadingPrice ? (
              <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
            ) : (
              <>
                <label className="block space-y-1.5">
                  <span className="font-bold uppercase tracking-wider text-slate-500 text-xs">Price (INR)</span>
                  <input 
                    type="number" 
                    min={0}
                    value={consultationPrice} 
                    onChange={(e) => setConsultationPrice(Number(e.target.value))} 
                    className={inputCls} 
                    required 
                  />
                </label>

                <div className="pt-2">
                  <button type="submit" disabled={savingPrice} className="w-full flex items-center justify-center gap-1.5 px-5 py-3 bg-[#0B4F8C] hover:bg-[#083B69] text-white font-bold text-sm rounded-xl cursor-pointer disabled:opacity-60">
                    {savingPrice ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Price
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
