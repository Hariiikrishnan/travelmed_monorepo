import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { AlertCircle, Mail, Phone, ShieldCheck } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      num: "01",
      title: "Acceptance of Terms",
      content: "By using the Travel Med website (travelmed.org) and/or purchasing our products, you confirm that you are at least 18 years of age and legally capable of entering into a binding agreement. These terms apply to all visitors, users, and customers."
    },
    {
      num: "02",
      title: "Products & Medical Disclaimer",
      content: (
        <div className="space-y-4">
          <p>
            Travel Med kits are designed as a convenience product for travelers seeking commonly used, over-the-counter medicines and first-aid essentials for general travel ailments.
          </p>
          
          <div className="bg-amber-50/50 dark:bg-amber-950/10 border-l-4 border-amber-500 rounded-r-2xl p-4 md:p-5 flex gap-3.5 items-start">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">Important Medical Disclaimer</h4>
              <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-450 leading-relaxed font-semibold">
                The products in our kit are not substitutes for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before using any medicine. In case of a medical emergency, contact emergency services immediately.
              </p>
            </div>
          </div>

          <p>
            All medicines included are CDSCO-regulated and sourced from licensed Indian pharmaceutical brands. Customers are responsible for checking individual medicine instructions, contraindications, and suitability for their specific health conditions.
          </p>
        </div>
      )
    },
    {
      num: "03",
      title: "Teleconsultation Services",
      content: (
        <div className="space-y-3">
          <p>
            Each Travel Med Kit includes 2 complimentary teleconsultations (General Physician & Orthopaedician) valued at ₹1,500. These consultations:
          </p>
          <ul className="space-y-2 pl-1.5">
            {[
              "Are valid for 12 months from the date of purchase",
              "Must be activated via the instructions included in the kit",
              "Are non-transferable and cannot be exchanged for cash",
              "Are subject to the availability of the respective healthcare provider",
              "Are not emergency medical services"
            ].map((bullet, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-semibold leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-2" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      num: "04",
      title: "Pricing & Payment",
      content: (
        <div className="space-y-3">
          <p>
            All prices listed on the website are in Indian Rupees (INR) and are inclusive of applicable GST (5%). Travel Med reserves the right to change prices at any time without prior notice. The price charged at the time of order placement will apply to that transaction.
          </p>
          <p>
            Payments are processed securely through Razorpay. Travel Med does not store any credit/debit card information. By completing a payment, you authorize Travel Med to charge the stated amount.
          </p>
        </div>
      )
    },
    {
      num: "05",
      title: "Order Placement & Cancellation",
      content: "Once an order is confirmed and payment is received, it enters processing within 1 business day. Orders can be cancelled by contacting us at +91 81484 93389 or sales@travelmed.org before dispatch. Once dispatched, orders cannot be cancelled and must follow the Returns & Refunds policy."
    },
    {
      num: "06",
      title: "Shipping & Delivery",
      content: "Shipping timelines are estimates and are not guaranteed. Travel Med is not liable for delays caused by third-party courier services, natural events, or government restrictions. Customers must provide accurate delivery addresses; Travel Med is not responsible for non-delivery due to incorrect address information."
    },
    {
      num: "07",
      title: "Intellectual Property",
      content: "All content on this website — including text, graphics, logos, images, and product designs — is the exclusive property of Travel Med and is protected under applicable Indian intellectual property laws. Unauthorized reproduction, distribution, or use of any content is strictly prohibited."
    },
    {
      num: "08",
      title: "Limitation of Liability",
      content: "To the maximum extent permitted by applicable law, Travel Med shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or website. Our total liability in any claim shall not exceed the purchase price of the product in question."
    },
    {
      num: "09",
      title: "Privacy Policy",
      content: "We respect your privacy. Personal information collected during the purchase process (name, email, phone, address) is used solely for order processing, delivery, and support. We do not sell or share your personal data with third parties except as required for order fulfillment (e.g., courier partners). For questions regarding your data, contact sales@travelmed.org."
    },
    {
      num: "10",
      title: "Governing Law & Dispute Resolution",
      content: "These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Chennai, Tamil Nadu, India."
    },
    {
      num: "11",
      title: "Amendments to Terms",
      content: "Travel Med reserves the right to update or modify these Terms & Conditions at any time. Changes will be effective immediately upon posting on the website. Continued use of the website after any changes constitutes your acceptance of the revised terms."
    },
    {
      num: "12",
      title: "Contact Us",
      content: (
        <div className="space-y-4">
          <p>
            For any questions or concerns regarding these Terms & Conditions, please contact:
          </p>
          <div className="font-bold text-slate-800 dark:text-neutral-100 text-xs sm:text-sm">
            Travel Med
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a 
              href="mailto:sales@travelmed.org" 
              className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 bg-slate-50 hover:bg-primary hover:text-white dark:bg-neutral-850 dark:hover:bg-primary rounded-xl transition duration-300 group font-bold text-xs"
            >
              <Mail className="h-4 w-4 text-primary group-hover:text-white" />
              <span className="text-slate-750 dark:text-neutral-200 group-hover:text-white whitespace-nowrap">sales@travelmed.org</span>
            </a>

            <a 
              href="tel:+918148493389" 
              className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 bg-slate-50 hover:bg-primary hover:text-white dark:bg-neutral-850 dark:hover:bg-primary rounded-xl transition duration-300 group font-bold text-xs"
            >
              <Phone className="h-4 w-4 text-primary group-hover:text-white" />
              <span className="text-slate-750 dark:text-neutral-200 group-hover:text-white whitespace-nowrap">+91 81484 93389</span>
            </a>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex-1 bg-gradient-to-b from-[#DCEBFF]/40 via-white to-[#EEF6FF]/40 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-16 md:py-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="primary" className="px-3.5 py-1 bg-primary/10 text-primary border-primary/20">
            Legal & Compliance
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-neutral-400">Last updated: June 2025</p>
        </div>

        {/* Introduction Card */}
        <Card hoverEffect={false} className="p-6 md:p-8 border-slate-100 bg-white dark:bg-neutral-900/60 dark:border-neutral-800 shadow-[0_8px_30px_rgba(15,23,42,0.02)] rounded-3xl">
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold">
            Please read these Terms & Conditions carefully before using the Travel Med website or placing an order. By accessing our website or purchasing our products, you agree to be bound by these terms. If you do not agree with any part of these terms, please discontinue use of our website.
          </p>
        </Card>

        {/* Sections Listing */}
        <div className="space-y-6">
          {sections.map((section) => (
            <Card 
              key={section.num} 
              hoverEffect={false} 
              className="p-6 md:p-8 border-slate-100 bg-white dark:bg-neutral-900/60 dark:border-neutral-800 shadow-[0_8px_30px_rgba(15,23,42,0.02)] rounded-3xl flex gap-5"
            >
              <div className="w-10 h-10 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center text-sm font-black shrink-0 font-heading">
                {section.num}
              </div>
              <div className="space-y-3.5 flex-1 text-left">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-heading">
                  {section.title}
                </h2>
                <div className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold">
                  {section.content}
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
