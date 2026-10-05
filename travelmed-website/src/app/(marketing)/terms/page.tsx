import React from 'react';
import { AlertCircle } from 'lucide-react';
import { LegalDocument, LegalSection } from '@/shared/ui/LegalDocument';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Terms & Conditions',
  description: 'Terms of use for the TravelMed website, travel medical kits, teleconsultation services, pricing, orders, shipping and liability.',
  path: '/terms',
});

const sections: LegalSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: (
      <p>
        By using the Travel Med website (travelmed.org) and/or purchasing our products, you confirm that you are at least
        18 years of age and legally capable of entering into a binding agreement. These terms apply to all visitors,
        users, and customers.
      </p>
    ),
  },
  {
    id: 'medical-disclaimer',
    title: 'Products & Medical Disclaimer',
    content: (
      <>
        <p>
          Travel Med kits are designed as a convenience product for travelers seeking commonly used medicines and
          first-aid essentials for general travel ailments.
        </p>
        <div className="flex items-start gap-3.5 rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">Important medical disclaimer</p>
            <p className="mt-1.5 text-sm text-amber-950/80 leading-relaxed">
              The products in our kit are not substitutes for professional medical advice, diagnosis, or treatment.
              Always consult a qualified healthcare professional before using any medicine. In case of a medical
              emergency, contact emergency services immediately.
            </p>
          </div>
        </div>
        <p>
          All medicines included are CDSCO-regulated and sourced from licensed Indian pharmaceutical brands. Customers are
          responsible for checking individual medicine instructions, contraindications, and suitability for their
          specific health conditions.
        </p>
      </>
    ),
  },
  {
    id: 'teleconsultation',
    title: 'Teleconsultation Services',
    content: (
      <>
        <p>
          Each Travel Med Kit includes 2 complimentary teleconsultations (General Physician &amp; Orthopaedician) valued
          at ₹1,500. These consultations:
        </p>
        <ul className="space-y-2">
          {[
            'Are valid for 12 months from the date of purchase',
            'Must be activated via the instructions included in the kit',
            'Are non-transferable and cannot be exchanged for cash',
            'Are subject to the availability of the respective healthcare provider',
            'Are not emergency medical services',
          ].map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'pricing',
    title: 'Pricing & Payment',
    content: (
      <>
        <p>
          All prices listed on the website are in Indian Rupees (INR) and are inclusive of applicable GST (5%). Travel Med
          reserves the right to change prices at any time without prior notice. The price charged at the time of order
          placement will apply to that transaction.
        </p>
        <p>
          Payments are processed securely through Razorpay. Travel Med does not store any credit/debit card information.
          By completing a payment, you authorize Travel Med to charge the stated amount.
        </p>
      </>
    ),
  },
  {
    id: 'orders',
    title: 'Order Placement & Cancellation',
    content: (
      <p>
        Once an order is confirmed and payment is received, it enters processing within 1 business day. Orders can be
        cancelled by contacting us at +91 81484 93389 or sales@travelmed.org before dispatch. Once dispatched, orders
        cannot be cancelled and must follow the Returns &amp; Refunds policy.
      </p>
    ),
  },
  {
    id: 'shipping',
    title: 'Shipping & Delivery',
    content: (
      <p>
        Shipping timelines are estimates and are not guaranteed. Travel Med is not liable for delays caused by
        third-party courier services, natural events, or government restrictions. Customers must provide accurate
        delivery addresses; Travel Med is not responsible for non-delivery due to incorrect address information.
      </p>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: (
      <p>
        All content on this website — including text, graphics, logos, images, and product designs — is the exclusive
        property of Travel Med and is protected under applicable Indian intellectual property laws. Unauthorized
        reproduction, distribution, or use of any content is strictly prohibited.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: (
      <p>
        To the maximum extent permitted by applicable law, Travel Med shall not be liable for any indirect, incidental,
        special, or consequential damages arising from the use of our products or website. Our total liability in any
        claim shall not exceed the purchase price of the product in question.
      </p>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    content: (
      <p>
        We respect your privacy. Personal information collected during the purchase process (name, email, phone,
        address) is used solely for order processing, delivery, and support. We do not sell or share your personal data
        with third parties except as required for order fulfillment (e.g., courier partners). For questions regarding
        your data, contact sales@travelmed.org.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing Law & Dispute Resolution',
    content: (
      <p>
        These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India. Any
        disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the
        courts of Chennai, Tamil Nadu, India.
      </p>
    ),
  },
  {
    id: 'amendments',
    title: 'Amendments to Terms',
    content: (
      <p>
        Travel Med reserves the right to update or modify these Terms &amp; Conditions at any time. Changes will be
        effective immediately upon posting on the website. Continued use of the website after any changes constitutes
        your acceptance of the revised terms.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: (
      <p>
        For any questions or concerns regarding these Terms &amp; Conditions, please contact Travel Med at{' '}
        <a href="mailto:sales@travelmed.org" className="font-semibold text-primary hover:underline">sales@travelmed.org</a>{' '}
        or <a href="tel:+918148493389" className="font-semibold text-primary hover:underline">+91 81484 93389</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      badge="Legal & Compliance"
      title="Terms & Conditions"
      description="The terms that apply when you use our website or purchase a Travel Med kit."
      path="/terms"
      lastUpdated="June 2025"
      intro="Please read these Terms & Conditions carefully before using the Travel Med website or placing an order. By accessing our website or purchasing our products, you agree to be bound by these terms. If you do not agree with any part of these terms, please discontinue use of our website."
      sections={sections}
    />
  );
}
