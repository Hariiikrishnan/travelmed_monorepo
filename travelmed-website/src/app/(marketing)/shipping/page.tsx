import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { 
  Truck, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  XCircle, 
  Mail, 
  Phone, 
  AlertCircle,
  PackageCheck,
  CreditCard
} from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="flex-1 bg-gradient-to-b from-[#DCEBFF]/40 via-white to-[#EEF6FF]/40 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-16 md:py-24 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="primary" className="px-3.5 py-1 bg-primary/10 text-primary border-primary/20">
            Logistics & Operations
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white leading-tight">
            Shipping & Returns
          </h1>
          <p className="text-sm md:text-base text-neutral-500 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about delivery and our return policy
          </p>
        </div>

        {/* Card 1: Shipping Policy */}
        <Card hoverEffect={false} className="p-6 md:p-8 border-slate-100 bg-white dark:bg-neutral-900/60 dark:border-neutral-800 shadow-[0_8px_30px_rgba(15,23,42,0.02)] rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-neutral-800 pb-4">
            <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
              <Truck className="h-5 w-5" />
            </div>
            <h2 className="text-lg md:text-xl font-bold font-heading text-slate-800 dark:text-neutral-100">
              Shipping Policy
            </h2>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
            <p>
              <strong className="text-slate-850 dark:text-white font-bold">Standard Shipping:</strong> All orders are shipped via reputable courier services across India. Standard shipping is <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md dark:bg-emerald-950/40">FREE</span> on every order, regardless of order value.
            </p>
          </div>

          {/* Delivery Timelines Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Delivery Timelines
            </h3>
            <div className="overflow-hidden border border-slate-100 dark:border-neutral-800 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-neutral-800/80 border-b border-slate-100 dark:border-neutral-800">
                    <th className="p-3.5 text-xs font-bold text-slate-600 dark:text-neutral-350">Location</th>
                    <th className="p-3.5 text-xs font-bold text-slate-600 dark:text-neutral-350">Estimated Delivery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-800 text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-neutral-300">Metro Cities <span className="text-[10px] text-neutral-400 font-normal block">(Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Kolkata)</span></td>
                    <td className="p-3.5 font-bold text-primary">2–3 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-neutral-300">Tier 2 & Tier 3 Cities</td>
                    <td className="p-3.5 font-bold text-slate-700 dark:text-neutral-300">3–5 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-neutral-300">Remote Areas & North-East India</td>
                    <td className="p-3.5 font-bold text-slate-700 dark:text-neutral-300">5–7 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Processing Info */}
          <div className="bg-blue-50/50 dark:bg-neutral-800/30 border border-blue-100/60 dark:border-neutral-850 rounded-2xl p-4 md:p-5 flex gap-3.5 items-start">
            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-neutral-250">Order Processing Time</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold">
                Orders are processed within <strong className="text-slate-800 dark:text-white font-bold">1 business day</strong> of placement. Orders placed after 5:00 PM IST or on weekends/public holidays will be processed the next business day.
              </p>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Shipping Details</h3>
            <ul className="space-y-2.5">
              {[
                "You will receive an email confirmation with your tracking number once your order is dispatched.",
                "We currently ship only within India.",
                "We are not responsible for delays caused by courier partners or circumstances beyond our control (natural disasters, strikes, etc.).",
                "Please ensure your delivery address and PIN code are accurate at the time of ordering."
              ].map((detail, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-xs md:text-sm text-neutral-500 dark:text-neutral-450 leading-relaxed font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Card 2: Returns & Refunds Policy */}
        <Card hoverEffect={false} className="p-6 md:p-8 border-slate-100 bg-white dark:bg-neutral-900/60 dark:border-neutral-800 shadow-[0_8px_30px_rgba(15,23,42,0.02)] rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-neutral-800 pb-4">
            <div className="p-2.5 bg-secondary/15 text-secondary rounded-2xl">
              <PackageCheck className="h-5 w-5" />
            </div>
            <h2 className="text-lg md:text-xl font-bold font-heading text-slate-800 dark:text-neutral-100">
              Returns & Refunds Policy
            </h2>
          </div>

          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
            <strong className="text-slate-850 dark:text-white font-bold">Our Promise:</strong> We stand behind every Travel Med Kit we ship. If you receive a damaged, defective, or incorrect product, we will make it right — no questions asked.
          </p>

          {/* Criteria Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/60 dark:border-emerald-900/40 rounded-2xl p-4 md:p-5 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-350">Eligible for Return / Replacement</h4>
              <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400 font-semibold leading-relaxed">
                <li className="flex gap-2 items-start">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Products received in damaged or broken condition</span>
                </li>
                <li className="flex gap-2 items-start">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Wrong product delivered (different from what was ordered)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Sealed kit delivered with missing items as per the product listing</span>
                </li>
                <li className="flex gap-2 items-start">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Products with manufacturing defects</span>
                </li>
              </ul>
            </div>

            <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100/60 dark:border-rose-900/40 rounded-2xl p-4 md:p-5 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-800 dark:text-rose-350">Not Eligible for Return</h4>
              <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400 font-semibold leading-relaxed">
                <li className="flex gap-2 items-start">
                  <XCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>Opened or used medicine kits (due to hygiene and safety regulations)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <XCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>Returns requested after 7 days of delivery</span>
                </li>
                <li className="flex gap-2 items-start">
                  <XCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>Change of mind after delivery</span>
                </li>
                <li className="flex gap-2 items-start">
                  <XCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>Products damaged due to customer mishandling</span>
                </li>
              </ul>
            </div>
          </div>

          {/* How to Initiate */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">How to Initiate a Return</h3>
            <ol className="space-y-2 text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
              <li className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-neutral-800 text-[11px] font-bold flex items-center justify-center text-slate-800 dark:text-white shrink-0 mt-0.5">1</span>
                <span>Email us at <strong className="text-slate-800 dark:text-white">sales@travelmed.org</strong> or call <strong className="text-slate-800 dark:text-white">+91 81484 93389</strong> within 7 days of delivery.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-neutral-800 text-[11px] font-bold flex items-center justify-center text-slate-800 dark:text-white shrink-0 mt-0.5">2</span>
                <span>Share your Order ID, a description of the issue, and photos/videos of the damaged or incorrect product.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-neutral-800 text-[11px] font-bold flex items-center justify-center text-slate-800 dark:text-white shrink-0 mt-0.5">3</span>
                <span>Our support team will review and respond within 2 business days.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-neutral-800 text-[11px] font-bold flex items-center justify-center text-slate-800 dark:text-white shrink-0 mt-0.5">4</span>
                <span>Upon approval, a replacement will be dispatched or a full refund processed within 5–7 business days.</span>
              </li>
            </ol>
          </div>

          {/* Refund Processing Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-4.5 w-4.5 text-primary" /> Refund Processing
            </h3>
            <div className="overflow-hidden border border-slate-100 dark:border-neutral-800 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-neutral-800/80 border-b border-slate-100 dark:border-neutral-800">
                    <th className="p-3.5 text-xs font-bold text-slate-600 dark:text-neutral-350">Payment Method</th>
                    <th className="p-3.5 text-xs font-bold text-slate-600 dark:text-neutral-350">Refund Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-800 text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-neutral-300">UPI / Wallets</td>
                    <td className="p-3.5 font-bold text-slate-700 dark:text-neutral-300">1–3 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-neutral-300">Debit / Credit Card</td>
                    <td className="p-3.5 font-bold text-slate-700 dark:text-neutral-300">5–7 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-neutral-300">Net Banking</td>
                    <td className="p-3.5 font-bold text-slate-700 dark:text-neutral-300">3–5 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-neutral-300">Cash on Delivery</td>
                    <td className="p-3.5 font-bold text-primary">Bank Transfer within 7 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Card 3: Packaging Standards */}
        <Card hoverEffect={false} className="p-6 md:p-8 border-slate-100 bg-white dark:bg-neutral-900/60 dark:border-neutral-800 shadow-[0_8px_30px_rgba(15,23,42,0.02)] rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-neutral-800 pb-4">
            <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
              <PackageCheck className="h-5 w-5" />
            </div>
            <h2 className="text-lg md:text-xl font-bold font-heading text-slate-800 dark:text-neutral-100">
              Packaging Standards
            </h2>
          </div>

          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
            Every Travel Med Kit is carefully packed to ensure all medicines and essentials arrive in perfect condition:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Temperature Protection",
                desc: "Temperature-resistant outer packaging for medicine integrity during transit."
              },
              {
                title: "Organized Compartments",
                desc: "Individual item compartments to prevent breakage."
              },
              {
                title: "Tamper Seals",
                desc: "Tamper-evident seals on all medicine packets."
              },
              {
                title: "Fragile Safety",
                desc: "Secondary protective layer for fragile items."
              }
            ].map((std, idx) => (
              <div key={idx} className="bg-slate-50/50 dark:bg-neutral-800/20 border border-slate-100/60 dark:border-neutral-800 rounded-2xl p-4 flex gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-neutral-200">{std.title}</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-semibold">{std.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Card 4: Need Help? Contact Info */}
        <Card hoverEffect={false} className="p-6 md:p-8 border-slate-100 bg-white dark:bg-neutral-900/60 dark:border-neutral-800 shadow-[0_8px_30px_rgba(15,23,42,0.02)] rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 text-left">
              <span className="inline-block text-[9px] font-extrabold tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md uppercase">
                Support Helpline
              </span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-neutral-100">
                Need Help with Shipping or Returns?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-semibold">
                Our support team is available <strong className="text-slate-700 dark:text-neutral-350">Mon–Sat, <span className="whitespace-nowrap">9:00 AM – 6:00 PM IST</span></strong>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a 
                href="tel:+918148493389" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 hover:bg-primary hover:text-white dark:bg-neutral-800 dark:hover:bg-primary rounded-2xl transition duration-300 group"
              >
                <Phone className="h-4.5 w-4.5 text-primary group-hover:text-white" />
                <span className="text-xs font-bold text-slate-750 dark:text-neutral-200 group-hover:text-white whitespace-nowrap">+91 81484 93389</span>
              </a>

              <a 
                href="mailto:sales@travelmed.org" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 hover:bg-primary hover:text-white dark:bg-neutral-800 dark:hover:bg-primary rounded-2xl transition duration-300 group"
              >
                <Mail className="h-4.5 w-4.5 text-primary group-hover:text-white" />
                <span className="text-xs font-bold text-slate-755 dark:text-neutral-200 group-hover:text-white whitespace-nowrap">sales@travelmed.org</span>
              </a>
            </div>
          </div>
          
          <div className="border-t border-slate-100 dark:border-neutral-800 pt-5 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary shrink-0" />
            <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed">
              <strong className="text-slate-700 dark:text-neutral-300">Domestic Express Logistics:</strong> Sourced from CDSCO licensed laboratory facilities and delivered straight to your home, office, or hotel receipt desk.
            </p>
          </div>
        </Card>

      </div>
    </div>
  );
}
