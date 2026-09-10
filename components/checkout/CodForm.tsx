'use client';

import React, { useState } from 'react';
import { User, Phone, MapPin, Building2, StickyNote, CheckCircle2 } from 'lucide-react';

export interface CodFormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

export interface CodFormProps {
  onSubmit: (data: CodFormData) => void;
  initial?: Partial<CodFormData>;
}

export function CodForm({ onSubmit, initial = {} }: CodFormProps) {
  const [form, setForm] = useState<CodFormData>({
    fullName: initial.fullName || '',
    phone: initial.phone || '',
    address: initial.address || '',
    city: initial.city || '',
    notes: initial.notes || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CodFormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CodFormData, string>> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(form.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number.';
    }
    if (!form.address.trim()) newErrors.address = 'Delivery address is required.';
    if (!form.city.trim()) newErrors.city = 'City is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CodFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="cod-form-heading">
      <h3 id="cod-form-heading" className="text-lg font-bold text-slate-900">Customer Details</h3>

      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-700">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={form.fullName}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
        </div>
        {errors.fullName && (
          <p id="fullName-error" className="mt-1 text-xs text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 234 567 890"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
        </div>
        {errors.phone && <p id="phone-error" className="mt-1 text-xs text-red-600">{errors.phone}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-slate-700">
            Delivery Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="address"
              name="address"
              type="text"
              placeholder="123 Commerce Way"
              value={form.address}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? 'address-error' : undefined}
            />
          </div>
          {errors.address && (
            <p id="address-error" className="mt-1 text-xs text-red-600">{errors.address}</p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-slate-700">
            City <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="city"
              name="city"
              type="text"
              placeholder="New York"
              value={form.city}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? 'city-error' : undefined}
            />
          </div>
          {errors.city && <p id="city-error" className="mt-1 text-xs text-red-600">{errors.city}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-slate-700">
          Notes (Optional)
        </label>
        <div className="relative">
          <StickyNote className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Any special instructions for delivery..."
            value={form.notes}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
          />
        </div>
      </div>

      {isSubmitted && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          <CheckCircle2 className="h-4 w-4" />
          Details captured. Ready to confirm.
        </div>
      )}

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-100"
        aria-label="Confirm customer details"
      >
        Confirm Details
      </button>
    </form>
  );
}
