'use client';

import React, { useState } from 'react';
import { QrCode, Copy, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/config/site';

export interface EsewaPaymentQRProps {
  amount: number; // amount in base currency units (e.g., 1250)
  onTransactionRefSubmit: (refId: string) => void;
}

export function EsewaPaymentQR({ amount, onTransactionRefSubmit }: EsewaPaymentQRProps) {
  const [refId, setRefId] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const merchantCode = siteConfig.payments.esewa.merchantCode || 'EPAYTEST';
  const isTestMode = siteConfig.payments.esewa.isTestMode;

  const handleCopy = () => {
    const text = `Merchant Code: ${merchantCode}\nAmount: ${amount.toFixed(2)}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refId.trim()) {
      setError('Transaction Reference ID is required.');
      return;
    }
    setError(null);
    setSubmitted(true);
    onTransactionRefSubmit(refId.trim());
  };

  return (
    <div className="space-y-6" aria-label="eSewa Payment Step">
      <div>
        <h3 className="text-xl font-extrabold text-slate-900">eSewa Payment</h3>
        <p className="mt-1 text-sm text-slate-500">Complete payment via your eSewa wallet. Reference code after payment.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          {/* QR Placeholder */}
          <div className="relative flex h-48 w-48 items-center justify-center rounded-2xl bg-white shadow-inner ring-1 ring-slate-200">
            <div className="text-center">
              <QrCode className="mx-auto h-24 w-24 text-blue-600" aria-hidden="true" />
              <span className="mt-2 block text-xs font-medium text-slate-500">Scan to Pay</span>
            </div>
          </div>

          <div className="w-full space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-blue-600 px-4 py-3 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">Merchant Code</span>
              <span className="font-mono text-lg font-bold">{merchantCode}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Amount</span>
              <span className="font-mono text-xl font-extrabold">${amount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
            aria-label="Copy payment details"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Details'}
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            {isTestMode
              ? 'Test Mode: Use merchant code EPAYTEST for testing.'
              : 'Production Mode: Confirm merchant details before paying.'}
          </span>
        </div>
      </div>

      {/* Transaction Reference Input */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="mb-1 text-base font-bold text-slate-900">Confirm Payment</h4>
        <p className="mb-4 text-sm text-slate-500">Enter your eSewa Transaction Reference ID after completing the payment.</p>

        <label htmlFor="esewa-ref" className="mb-1.5 block text-sm font-medium text-slate-700">
          Transaction Reference ID <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          <input
            id="esewa-ref"
            name="esewa-ref"
            type="text"
            placeholder="e.g., ESETX123456789"
            value={refId}
            onChange={(e) => {
              setRefId(e.target.value);
              if (error) setError(null);
              if (submitted) setSubmitted(false);
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            aria-invalid={!!error}
            aria-describedby={error ? 'esewa-ref-error' : undefined}
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-blue-700 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-100"
            aria-label="Submit eSewa reference"
          >
            Confirm
          </button>
        </div>
        {error && <p id="esewa-ref-error" className="mt-2 text-xs text-red-600">{error}</p>}
        {submitted && (
          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4" /> Reference submitted successfully.
          </p>
        )}
      </form>

      <a
        href={`https://${isTestMode ? 'test' : 'www'}.esewa.com.np`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
      >
        <ExternalLink className="h-4 w-4" /> Open eSewa Portal
      </a>
    </div>
  );
}
