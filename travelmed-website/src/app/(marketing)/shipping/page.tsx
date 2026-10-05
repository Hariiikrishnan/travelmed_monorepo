import React from 'react';
import {
  Truck,
  Clock,
  MapPin,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  Mail,
  Phone,
  PackageCheck,
  Thermometer,
  LayoutGrid,
  Lock,
  Layers,
} from 'lucide-react';
import { PageHero, Eyebrow } from '@/shared/ui/PageHero';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Shipping & Returns – Free Delivery Across India',
  description: 'Free express shipping across India: 2–3 days to metros, 3–5 days to Tier 2 & 3 cities. Returns and replacements for damaged or incorrect items.',
  path: '/shipping',
});

const highlights = [
  { icon: Truck, value: 'FREE', label: 'Shipping on every order' },
  { icon: Clock, value: '1 day', label: 'Order processing' },
  { icon: MapPin, value: '2–7 days', label: 'Delivery across India' },
];

const timelines = [
  { location: 'Metro Cities', note: 'Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Kolkata', eta: '2–3', featured: true },
  { location: 'Tier 2 & Tier 3 Cities', note: 'Most of India', eta: '3–5', featured: false },
  { location: 'Remote Areas & North-East India', note: 'Extended courier routes', eta: '5–7', featured: false },
];

const shippingDetails = [
  'You will receive an email confirmation with your tracking number once your order is dispatched.',
  'We currently ship only within India.',
  'We are not responsible for delays caused by courier partners or circumstances beyond our control (natural disasters, strikes, etc.).',
  'Please ensure your delivery address and PIN code are accurate at the time of ordering.',
];

const eligible = [
  'Products received in damaged or broken condition',
  'Wrong product delivered (different from what was ordered)',
  'Sealed kit delivered with missing items as per the product listing',
  'Products with manufacturing defects',
];

const notEligible = [
  'Opened or used medicine kits (due to hygiene and safety regulations)',
  'Returns requested after 7 days of delivery',
  'Change of mind after delivery',
  'Products damaged due to customer mishandling',
];

const returnSteps = [
  {
    title: 'Contact us',
    desc: (
      <>
        Email <strong className="font-semibold text-heading">sales@travelmed.org</strong> or call{' '}
        <strong className="font-semibold text-heading">+91 81484 93389</strong> within 7 days of delivery.
      </>
    ),
  },
  { title: 'Share details', desc: 'Send your Order ID, a description of the issue, and photos/videos of the product.' },
  { title: 'Quick review', desc: 'Our support team will review and respond within 2 business days.' },
  { title: 'Resolution', desc: 'A replacement is dispatched or a full refund processed within 5–7 business days.' },
];

const packaging = [
  { icon: Thermometer, title: 'Temperature Protection', desc: 'Temperature-resistant outer packaging for medicine integrity during transit.' },
  { icon: LayoutGrid, title: 'Organized Compartments', desc: 'Individual item compartments to prevent breakage.' },
  { icon: Lock, title: 'Tamper Seals', desc: 'Tamper-evident seals on all medicine packets.' },
  { icon: Layers, title: 'Fragile Safety', desc: 'Secondary protective layer for fragile items.' },
];

export default function ShippingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-background">
      <PageHero
        badge="Logistics & Operations"
        badgeIcon={<Truck className="h-3.5 w-3.5 text-secondary" />}
        title="Shipping &"
        highlight="Returns"
        description="Everything you need to know about delivery and our return policy."
        overlap
      />

      {/* Highlights */}
      <section className="relative z-20 -mt-16 md:-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-[24px] border border-border bg-border shadow-[0_20px_50px_rgba(11,79,140,0.10)]">
              {highlights.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-4 bg-white px-6 py-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-extrabold font-heading text-primary tracking-tight">{value}</div>
                    <div className="text-xs md:text-sm font-medium text-slate-500">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Shipping policy */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="max-w-2xl">
            <Eyebrow>Shipping policy</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1]">
              Delivery timelines
            </h2>
            <p className="mt-5 text-base sm:text-lg text-slate-500 leading-relaxed">
              All orders are shipped via reputable courier services across India. Standard shipping is{' '}
              <span className="font-semibold text-emerald-700">FREE</span> on every order, regardless of order value.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {timelines.map((t, idx) => (
              <ScrollReveal key={t.location} direction="up" delay={idx * 0.08} className="h-full">
                <div
                  className={`relative h-full overflow-hidden rounded-[24px] border p-7 ${
                    t.featured
                      ? 'border-transparent bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] text-white shadow-[0_30px_80px_rgba(11,79,140,0.25)]'
                      : 'border-border bg-white'
                  }`}
                >
                  {t.featured && <div aria-hidden className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-secondary/30 blur-[70px]" />}
                  <div className="relative">
                    <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${t.featured ? 'text-secondary' : 'text-secondary-dark'}`}>
                      {t.location}
                    </p>
                    <p className={`mt-5 font-heading text-5xl font-extrabold tracking-tight ${t.featured ? 'text-white' : 'text-heading'}`}>
                      {t.eta}
                    </p>
                    <p className={`mt-1 text-sm font-semibold ${t.featured ? 'text-white/80' : 'text-slate-600'}`}>business days</p>
                    <p className={`mt-5 text-sm leading-relaxed ${t.featured ? 'text-white/65' : 'text-slate-500'}`}>{t.note}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-5">
            <ScrollReveal direction="up" className="lg:col-span-2 h-full">
              <div className="h-full rounded-[24px] border border-secondary/20 bg-secondary/5 p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-white shadow-md shadow-secondary/20">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold font-heading">Order processing time</h3>
                <p className="mt-2 text-[15px] text-slate-600 leading-relaxed">
                  Orders are processed within <strong className="font-semibold text-heading">1 business day</strong> of
                  placement. Orders placed after 5:00 PM IST or on weekends/public holidays will be processed the next
                  business day.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.08} className="lg:col-span-3 h-full">
              <div className="h-full rounded-[24px] border border-border bg-white p-7">
                <h3 className="text-lg font-bold font-heading">Shipping details</h3>
                <ul className="mt-4 space-y-3.5">
                  {shippingDetails.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-[15px] text-slate-600 leading-relaxed">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Returns */}
      <section className="py-20 md:py-28 bg-white border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="max-w-2xl">
            <Eyebrow>Returns &amp; refunds</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1]">
              We&apos;ll make it right.
            </h2>
            <p className="mt-5 text-base sm:text-lg text-slate-500 leading-relaxed">
              We stand behind every Travel Med Kit we ship. If you receive a damaged, defective, or incorrect product,
              we will make it right — no questions asked.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
            <ScrollReveal direction="up" className="h-full">
              <div className="h-full rounded-[24px] border border-emerald-100 bg-emerald-50/50 p-7">
                <h3 className="flex items-center gap-2.5 text-lg font-bold font-heading">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" /> Eligible for return / replacement
                </h3>
                <ul className="mt-5 space-y-3">
                  {eligible.map((e) => (
                    <li key={e} className="flex items-start gap-3 text-[15px] text-slate-600 leading-relaxed">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.08} className="h-full">
              <div className="h-full rounded-[24px] border border-rose-100 bg-rose-50/50 p-7">
                <h3 className="flex items-center gap-2.5 text-lg font-bold font-heading">
                  <XCircle className="h-5 w-5 text-rose-600" /> Not eligible for return
                </h3>
                <ul className="mt-5 space-y-3">
                  {notEligible.map((e) => (
                    <li key={e} className="flex items-start gap-3 text-[15px] text-slate-600 leading-relaxed">
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>

          {/* How to initiate */}
          <ScrollReveal direction="up" className="mt-16">
            <h3 className="text-2xl font-bold font-heading tracking-tight">How to initiate a return</h3>
          </ScrollReveal>
          <ol className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {returnSteps.map((step, idx) => (
              <li key={step.title}>
                <ScrollReveal direction="up" delay={idx * 0.08} className="h-full">
                  <div className="relative h-full rounded-[24px] border border-border bg-background/60 p-6">
                    <span className="font-heading text-4xl font-extrabold tracking-tight text-transparent bg-gradient-to-br from-primary to-secondary bg-clip-text">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h4 className="mt-4 text-base font-bold font-heading">{step.title}</h4>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Packaging */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="max-w-2xl mx-auto text-center">
            <Eyebrow>Packaging standards</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1]">
              Arrives in perfect condition
            </h2>
            <p className="mt-5 text-base sm:text-lg text-slate-500 leading-relaxed">
              Every Travel Med Kit is carefully packed to ensure all medicines and essentials arrive safely.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {packaging.map(({ icon: Icon, title, desc }, idx) => (
              <ScrollReveal key={title} direction="up" delay={idx * 0.08} className="h-full">
                <div className="h-full rounded-[24px] border border-border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-base font-bold font-heading">{title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Help CTA */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] p-8 sm:p-12 text-white shadow-[0_40px_100px_rgba(11,79,140,0.25)]">
              <div aria-hidden className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary/30 blur-[100px]" />
              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                  <Eyebrow light>Support helpline</Eyebrow>
                  <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight !text-white leading-tight">
                    Need help with shipping or returns?
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-white/70">
                    Our support team is available Mon–Sat, 9:00 AM – 6:00 PM IST.
                  </p>
                  <p className="mt-5 flex items-start gap-2.5 text-sm text-white/60">
                    <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    Sourced from CDSCO licensed facilities and delivered straight to your home, office, or hotel desk.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <a
                    href="tel:+918148493389"
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-white px-6 py-3.5 text-sm font-bold text-primary transition hover:bg-slate-100"
                  >
                    <Phone className="h-4 w-4" /> +91 81484 93389
                  </a>
                  <a
                    href="mailto:sales@travelmed.org"
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    <Mail className="h-4 w-4" /> sales@travelmed.org
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
