import React, { useState } from 'react';
import { 
  Video, User, FileText, Plus, Edit2, Trash2, Clock, CheckCircle2, Save, X, Award
} from 'lucide-react';

interface TeleconsultationViewProps {
  bookings: any[];
  setBookings: React.Dispatch<React.SetStateAction<any[]>>;
  doctors: any[];
  setDoctors: React.Dispatch<React.SetStateAction<any[]>>;
  addActivityLog: (action: string, changes: string) => void;
}

export default function TeleconsultationView({
  bookings,
  setBookings,
  doctors,
  setDoctors,
  addActivityLog,
}: TeleconsultationViewProps) {
  
  const [teleTab, setTeleTab] = useState<'bookings' | 'doctors'>('bookings');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'Today' | 'Upcoming' | 'Completed' | 'Cancelled'>('all');
  
  // Prescription editing
  const [writingPrescriptionId, setWritingPrescriptionId] = useState<string | null>(null);
  const [prescriptionText, setPrescriptionText] = useState('');

  // Doctor editing / creation modal
  const [isEditingDoctor, setIsEditingDoctor] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [docName, setDocName] = useState('');
  const [docQual, setDocQual] = useState('');
  const [docSpec, setDocSpec] = useState('');
  const [docFees, setDocFees] = useState(500);
  const [docLangs, setDocLangs] = useState('English, Hindi');
  const [docDays, setDocDays] = useState('Mon, Tue, Wed, Thu, Fri');
  const [docSlots, setDocSlots] = useState('09:00 AM - 01:00 PM');
  const [docStatus, setDocStatus] = useState<'Active' | 'Inactive'>('Active');
  const [docPhoto, setDocPhoto] = useState('');

  const filteredBookings = bookings.filter(b => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  const handleToggleDoctorStatus = (id: string, current: string) => {
    const next = current === 'Active' ? 'Inactive' : 'Active';
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: next } : d));
    addActivityLog('Doctor Status Toggled', `Changed Doctor ID ${id} status to ${next}`);
  };

  const handleOpenPrescriptionModal = (booking: any) => {
    setWritingPrescriptionId(booking.id);
    setPrescriptionText(booking.prescription || 'Rx:\n1. Paracetamol 500mg - 1 tab thrice daily for 3 days.\n2. ORS sachet - 1 in 1L water, sip throughout day.');
  };

  const handleSavePrescription = () => {
    if (!writingPrescriptionId) return;
    setBookings(prev => prev.map(b => b.id === writingPrescriptionId ? { 
      ...b, 
      prescription: prescriptionText,
      status: 'Completed'
    } : b));
    addActivityLog('Prescription Issued', `Issued digital prescription for booking #${writingPrescriptionId}`);
    setWritingPrescriptionId(null);
    alert('Prescription submitted successfully. Patient notified.');
  };

  const handleGenerateMeetingLink = (id: string) => {
    const link = `https://meet.jit.si/travelmed-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookings(prev => prev.map(b => b.id === id ? { ...b, meetingLink: link } : b));
    addActivityLog('Meeting Link Generated', `Generated virtual consult link for booking #${id}`);
  };

  const handleCreateDoctorClick = () => {
    setEditingDoctorId(null);
    setDocName('');
    setDocQual('MBBS, MD (General Medicine)');
    setDocSpec('General Physician');
    setDocFees(1200);
    setDocLangs('English, Hindi, Spanish');
    setDocDays('Mon, Tue, Wed, Thu, Fri');
    setDocSlots('02:00 PM - 06:00 PM');
    setDocStatus('Active');
    setDocPhoto('https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150');
    setIsEditingDoctor(true);
  };

  const handleEditDoctor = (d: any) => {
    setEditingDoctorId(d.id);
    setDocName(d.name);
    setDocQual(d.qualification);
    setDocSpec(d.speciality);
    setDocFees(d.fees);
    setDocLangs(d.languages.join(', '));
    setDocDays(d.days.join(', '));
    setDocSlots(d.slots.join(', '));
    setDocStatus(d.status);
    setDocPhoto(d.photo);
    setIsEditingDoctor(true);
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const langsArr = docLangs.split(',').map(l => l.trim()).filter(Boolean);
    const daysArr = docDays.split(',').map(d => d.trim()).filter(Boolean);
    const slotsArr = docSlots.split(',').map(s => s.trim()).filter(Boolean);

    if (editingDoctorId) {
      setDoctors(prev => prev.map(d => d.id === editingDoctorId ? {
        ...d,
        name: docName, qualification: docQual, speciality: docSpec, fees: docFees,
        languages: langsArr, days: daysArr, slots: slotsArr, status: docStatus, photo: docPhoto
      } : d));
      addActivityLog('Doctor Updated', `Updated profile of Dr. ${docName}`);
    } else {
      const newDoc = {
        id: 'doc-' + Math.floor(100 + Math.random() * 900),
        name: docName, qualification: docQual, speciality: docSpec, fees: docFees,
        languages: langsArr, days: daysArr, slots: slotsArr, status: docStatus,
        photo: docPhoto || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150'
      };
      setDoctors(prev => [...prev, newDoc]);
      addActivityLog('Doctor Profile Created', `Registered profile for Dr. ${docName}`);
    }

    setIsEditingDoctor(false);
    setEditingDoctorId(null);
  };

  return (
    <div className="space-y-6 text-slate-650">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="text-left">
          <h2 className="text-xl font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
            <Video className="h-5 w-5 text-teal-650" /> Virtual Telehealth Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">Moderate doctor-patient consultations, manage slots, and view electronic prescriptions.</p>
        </div>
        
        {/* Toggle buttons */}
        <div className="flex gap-2 font-bold text-xs">
          <button 
            onClick={() => setTeleTab('bookings')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              teleTab === 'bookings' 
                ? 'bg-[#0B4F8C] text-white font-black' 
                : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900'
            }`}
          >
            Consultation Bookings
          </button>
          <button 
            onClick={() => setTeleTab('doctors')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              teleTab === 'doctors' 
                ? 'bg-[#0B4F8C] text-white font-black' 
                : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900'
            }`}
          >
            Doctor Profiles
          </button>
        </div>
      </div>

      {teleTab === 'bookings' ? (
        
        /* ── BOOKINGS MANAGER VIEW ── */
        <div className="space-y-4">
          
          {/* Booking filter tab row */}
          <div className="flex flex-wrap gap-2 justify-start border-b border-slate-100 pb-2 font-bold">
            {[
              { id: 'all', label: 'All Appointments' },
              { id: 'Today', label: 'Today\'s Consultations' },
              { id: 'Upcoming', label: 'Upcoming Slots' },
              { id: 'Completed', label: 'Completed Appointments' },
              { id: 'Cancelled', label: 'Cancelled Slots' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setBookingFilter(filter.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                  bookingFilter === filter.id 
                    ? 'bg-blue-50 text-[#0B4F8C] border border-blue-100' 
                    : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Bookings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBookings.map(book => (
              <div key={book.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-350 hover:shadow-sm transition space-y-4">
                
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div className="text-left space-y-0.5">
                    <span className="text-[9px] font-mono text-[#0B4F8C] font-bold">Slot ID: #{book.id}</span>
                    <h4 className="font-extrabold text-sm text-[#172B4D] flex items-center gap-1.5">
                      Patient: {book.patient}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                    book.status === 'Completed' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : book.status === 'Today'
                      ? 'bg-blue-50 text-[#0B4F8C] border border-blue-100 animate-pulse'
                      : book.status === 'Upcoming'
                      ? 'bg-sky-50 text-sky-600 border-sky-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {book.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-left">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">CONSULTING DOCTOR</span>
                    <span className="text-slate-700 font-bold">Dr. {book.doctor}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">DATE & SLOT TIME</span>
                    <span className="text-slate-700 font-bold">{book.date} | {book.time}</span>
                  </div>
                </div>

                <div className="text-left bg-slate-50 rounded-xl p-3 border border-slate-150 space-y-1">
                  <span className="font-bold text-[9px] text-slate-450 uppercase">Symptoms Reported</span>
                  <p className="text-slate-750 font-bold italic">"{book.symptoms}"</p>
                </div>

                {book.prescription && (
                  <div className="text-left bg-teal-50 border border-teal-100 rounded-xl p-3 space-y-1">
                    <span className="font-bold text-[9px] text-teal-650 uppercase flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> Prescription Issued</span>
                    <p className="text-slate-750 font-bold font-mono whitespace-pre-line leading-relaxed">{book.prescription}</p>
                  </div>
                )}

                {/* Booking actions */}
                <div className="bg-slate-50/50 border border-slate-150 rounded-xl px-4 py-2.5 flex flex-wrap gap-2 items-center justify-between font-bold">
                  <div className="flex gap-2">
                    {book.meetingLink ? (
                      <a 
                        href={book.meetingLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B4F8C] hover:bg-[#083B69] text-white rounded-lg text-[10px] font-bold transition"
                      >
                        Start Call
                      </a>
                    ) : (
                      book.status !== 'Completed' && book.status !== 'Cancelled' && (
                        <button 
                          onClick={() => handleGenerateMeetingLink(book.id)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] text-indigo-650 font-bold rounded-lg transition cursor-pointer"
                        >
                          Generate Meet Link
                        </button>
                      )
                    )}
                  </div>

                  {book.status !== 'Cancelled' && (
                    <button 
                      onClick={() => handleOpenPrescriptionModal(book)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-55 text-[10px] text-teal-650 font-bold rounded-lg transition cursor-pointer"
                    >
                      {book.prescription ? 'Edit Rx' : 'Write Prescription'}
                    </button>
                  )}
                </div>

              </div>
            ))}
            {filteredBookings.length === 0 && (
              <div className="col-span-1 md:col-span-2 py-12 text-center text-slate-400 font-medium">
                No consultations matching selected filter.
              </div>
            )}
          </div>

        </div>

      ) : (
        
        /* ── DOCTORS DIRECTORY VIEW ── */
        <div className="space-y-6">
          
          {/* Header add doctor button */}
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
            
            /* DOCTORS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map(doc => (
                <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-350 hover:shadow-sm transition">
                  
                  {/* Photo & Basic details */}
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="h-16 w-16 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center shrink-0">
                        <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left space-y-1 min-w-0">
                        <h4 className="font-extrabold text-sm text-[#172B4D] truncate leading-tight flex items-center gap-1.5">
                          Dr. {doc.name} <Award className="h-3.5 w-3.5 text-teal-650 shrink-0" />
                        </h4>
                        <p className="text-[9px] text-[#14B8A6] font-bold truncate uppercase">{doc.speciality}</p>
                        <p className="text-[9px] text-slate-450 font-bold truncate leading-none">{doc.qualification}</p>
                      </div>
                    </div>

                    {/* Meta information */}
                    <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-left font-semibold">
                      <div className="flex justify-between">
                        <span className="text-slate-455 text-[9px] uppercase tracking-wider">CONSULTATION FEES</span>
                        <span className="text-slate-750 font-bold font-mono">₹{(doc.fees || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-455 text-[9px] uppercase tracking-wider">LANGUAGES</span>
                        <span className="text-slate-700 font-bold truncate max-w-[150px]">{(doc.languages || []).join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-455 text-[9px] uppercase tracking-wider">AVAILABLE DAYS</span>
                        <span className="text-slate-700 font-bold truncate max-w-[150px]">{(doc.days || []).join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-455 text-[9px] uppercase tracking-wider">TIME SLOTS</span>
                        <span className="text-slate-700 font-bold truncate max-w-[150px]">{(doc.slots || []).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Doctor state toggles */}
                  <div className="bg-slate-50/50 border border-slate-150 rounded-xl px-4 py-2.5 mt-5 flex justify-between items-center font-bold">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleToggleDoctorStatus(doc.id, doc.status)}
                        className={`px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-wider transition ${
                          doc.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {doc.status}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditDoctor(doc)}
                        className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-lg transition"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          ) : (
            
            /* DOCTOR PROFILE EDIT FORM */
            <form onSubmit={handleSaveDoctor} className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-6 max-w-xl mx-auto">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-1.5">
                  Dr. {editingDoctorId ? 'Edit Doctor Profile' : 'Register New Specialist'}
                </h3>
                <button 
                  type="button" 
                  onClick={() => setIsEditingDoctor(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                
                {/* Name */}
                <div className="space-y-1.5 col-span-1 sm:col-span-2">
                  <label className="text-slate-550 font-bold uppercase tracking-wider">Doctor Full Name (Without 'Dr.')</label>
                  <input 
                    type="text" 
                    value={docName}
                    onChange={e => setDocName(e.target.value)}
                    placeholder="e.g. Sarah Carter"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                    required
                  />
                </div>

                {/* Qualification */}
                <div className="space-y-1.5">
                  <label className="text-slate-550 font-bold uppercase tracking-wider">Qualification details</label>
                  <input 
                    type="text" 
                    value={docQual}
                    onChange={e => setDocQual(e.target.value)}
                    placeholder="e.g. MD, FACP"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                  />
                </div>

                {/* Speciality */}
                <div className="space-y-1.5">
                  <label className="text-slate-550 font-bold uppercase tracking-wider">Medical Speciality</label>
                  <input 
                    type="text" 
                    value={docSpec}
                    onChange={e => setDocSpec(e.target.value)}
                    placeholder="e.g. Travel Medicine"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                  />
                </div>

                {/* Consultation Fees */}
                <div className="space-y-1.5">
                  <label className="text-slate-550 font-bold uppercase tracking-wider">Consultation Fees (INR)</label>
                  <input 
                    type="number" 
                    value={docFees || ''}
                    onChange={e => setDocFees(e.target.value ? parseInt(e.target.value) : ('' as any))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-805 focus:outline-none focus:border-[#0B4F8C] font-mono"
                  />
                </div>

                {/* Photo Link */}
                <div className="space-y-1.5">
                  <label className="text-slate-550 font-bold uppercase tracking-wider">Photo URL</label>
                  <input 
                    type="text" 
                    value={docPhoto}
                    onChange={e => setDocPhoto(e.target.value)}
                    placeholder="Doctor profile image link..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                  />
                </div>

                {/* Languages */}
                <div className="space-y-1.5 col-span-1 sm:col-span-2">
                  <label className="text-slate-550 font-bold uppercase tracking-wider">Languages (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={docLangs}
                    onChange={e => setDocLangs(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                  />
                </div>

                {/* Available Days */}
                <div className="space-y-1.5 col-span-1 sm:col-span-2">
                  <label className="text-slate-550 font-bold uppercase tracking-wider">Available Days (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={docDays}
                    onChange={e => setDocDays(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                  />
                </div>

                {/* Available Slots */}
                <div className="space-y-1.5 col-span-1 sm:col-span-2">
                  <label className="text-slate-550 font-bold uppercase tracking-wider">Available Time Slots (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={docSlots}
                    onChange={e => setDocSlots(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
                  />
                </div>

                {/* Doctor active status */}
                <div className="space-y-1.5">
                  <label className="text-slate-555 font-bold uppercase tracking-wider">Duty Status</label>
                  <select 
                    value={docStatus} 
                    onChange={e => setDocStatus(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-805 focus:outline-none focus:border-[#0B4F8C]"
                  >
                    <option value="Active">Active Duty</option>
                    <option value="Inactive">Inactive / On Leave</option>
                  </select>
                </div>

              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditingDoctor(false)}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0B4F8C] hover:bg-[#083B69] text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  <Save className="h-4 w-4" /> Save Doctor Profile
                </button>
              </div>

            </form>
          )}

        </div>
      )}

      {/* ── WRITING PRESCRIPTION POPUP / FORM OVERLAY ── */}
      {writingPrescriptionId && (
        <div className="fixed inset-0 z-50 overflow-hidden text-xs">
          <div 
            onClick={() => setWritingPrescriptionId(null)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" 
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-6 text-left">
              
              <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                <h4 className="font-extrabold text-sm text-[#172B4D] flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-teal-650" /> Write Digital Prescription (Booking #{writingPrescriptionId})
                </h4>
                <button onClick={() => setWritingPrescriptionId(null)} className="text-slate-400 hover:text-slate-900">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 font-bold">
                <label className="text-slate-500 font-bold uppercase tracking-wider block">Electronic RX Content</label>
                <textarea 
                  value={prescriptionText}
                  onChange={e => setPrescriptionText(e.target.value)}
                  rows={8}
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-800 font-mono focus:outline-none focus:border-[#0B4F8C] leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-150 pt-4 font-bold">
                <button 
                  type="button" 
                  onClick={() => setWritingPrescriptionId(null)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-500 hover:border-slate-350 text-xs font-bold rounded-xl"
                >
                  Discard
                </button>
                <button 
                  type="button" 
                  onClick={handleSavePrescription}
                  className="px-5 py-2 bg-[#0B4F8C] hover:bg-[#083B69] text-white text-xs font-bold rounded-xl"
                >
                  Submit & Email Patient
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
