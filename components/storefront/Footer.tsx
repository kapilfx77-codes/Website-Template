/**
 * Storefront Footer — Read all store info from siteConfig
 */

import { siteConfig } from '@/config/site';

export function Footer() {
  const year = new Date().getFullYear();
  const c = siteConfig.contact;
  const payments = siteConfig.payments;

  const enabledPayments = [
    { key: 'stripe', label: 'Stripe', enabled: payments.stripe.enabled },
    { key: 'paypal', label: 'PayPal', enabled: payments.paypal.enabled },
    { key: 'esewa', label: 'eSewa', enabled: payments.esewa.enabled },
    { key: 'khalti', label: 'Khalti', enabled: payments.khalti.enabled },
    { key: 'cashOnDelivery', label: 'COD', enabled: payments.cashOnDelivery.enabled },
    { key: 'bankTransfer', label: 'Bank Transfer', enabled: payments.bankTransfer.enabled },
  ].filter((p) => p.enabled);

  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand & description */}
          <div>
            <h3 className="mb-2 text-xl font-extrabold text-white">{siteConfig.shortName}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{siteConfig.description}</p>
            <div className="mt-4 flex gap-3 text-sm">
              {Object.entries(c.socials).filter(([, url]) => url).map(([key, url]) => (
                <a key={key} href={url} className="underline hover:text-white" aria-label={key}>{key}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 font-bold text-white">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><span className="text-slate-500">Email:</span> {c.email}</li>
              <li><span className="text-slate-500">Phone:</span> {c.phone}</li>
              <li><span className="text-slate-500">WhatsApp:</span> {c.whatsappNumber}</li>
              <li><span className="text-slate-500">Address:</span> {c.address.street}, {c.address.city}, {c.address.country}</li>
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h4 className="mb-3 font-bold text-white">Payment Methods</h4>
            <div className="flex flex-wrap gap-2">
              {enabledPayments.map((p) => (
                <span key={p.key} className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-blue-300 ring-1 ring-slate-700">{p.label}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-500">
          © {year} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;