'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, CreditCard, ShoppingBag, Smartphone, MessageCircle, Landmark, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

export interface CheckoutStep {
  id: 'customer' | 'payment';
  title: string;
  icon: React.ElementType;
  description: string;
}

interface CustomerData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  email: string;
}

interface OrderData {
  customer: CustomerData;
  paymentMethod: string;
  esewaRefId?: string;
  codNotes?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  voucherCode?: string | null;
  getSubtotal: () => number;
  getTaxAmount: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  voucherCode,
  getSubtotal,
  getTaxAmount,
  getDiscountAmount,
  getTotal,
}: CheckoutModalProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep['id']>('customer');
  const [formData, setFormData] = useState<CustomerData>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    email: '',
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [esewaRefId, setEsewaRefId] = useState('');
  const [codNotes, setCodNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const tax = getTaxAmount();
  const discount = getDiscountAmount();
  const total = getTotal();

  const { payments } = siteConfig;
  const availableGateways: Array<{ key: string; name: string; icon: React.ElementType; enabled: boolean }> = [];

  if (payments.stripe?.enabled) {
    availableGateways.push({ key: 'stripe', name: 'Stripe', icon: CreditCard, enabled: true });
  }
  if (payments.paypal?.enabled) {
    availableGateways.push({ key: 'paypal', name: 'PayPal', icon: CreditCard, enabled: true });
  }
  if (payments.esewa?.enabled) {
    availableGateways.push({ key: 'esewa', name: 'eSewa', icon: Smartphone, enabled: true });
  }
  if (payments.khalti?.enabled) {
    availableGateways.push({ key: 'khalti', name: 'Khalti', icon: Smartphone, enabled: true });
  }
  if (payments.cashOnDelivery?.enabled) {
    availableGateways.push({ key: 'cod', name: 'Cash on Delivery', icon: ShoppingBag, enabled: true });
  }
  if (payments.whatsappOrder?.enabled) {
    availableGateways.push({ key: 'whatsapp', name: 'WhatsApp Order', icon: MessageCircle, enabled: true });
  }
  if (payments.bankTransfer?.enabled) {
    availableGateways.push({ key: 'bank_transfer', name: 'Bank Transfer', icon: Landmark, enabled: true });
  }

  const steps: CheckoutStep[] = [
    {
      id: 'customer',
      title: 'Customer Details',
      icon: User,
      description: 'Enter your shipping information securely.',
    },
    {
      id: 'payment',
      title: 'Payment Method',
      icon: CreditCard,
      description: 'Choose how you would like to pay.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate customer data
    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.email.trim()
    ) {
      setSubmitError('All customer details are required.');
      return;
    }

    // Validate payment method is selected
    if (!selectedPaymentMethod) {
      setSubmitError('Please select a payment method.');
      return;
    }

    // If selected payment is WhatsApp, redirect immediately
    if (selectedPaymentMethod === 'whatsapp') {
      const { generateWhatsAppLink } = await import('@/lib/utils');
      const { formatCurrency } = await import('@/lib/store/useCart');
      const whaatsappLink = generateWhatsAppLink(
        items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        total
      );
      window.open(whaatsappLink, '_blank', 'noopener,noreferrer');
      onClose();
      return;
    }

    // Submit to API
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: formData,
          paymentMethod: selectedPaymentMethod,
          total: total,
          voucherCode,
          esewaRefId: selectedPaymentMethod === 'esewa' ? esewaRefId : undefined,
          codNotes: selectedPaymentMethod === 'cod' ? codNotes : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Redirect or show success
      // For this implementation, we'll close the modal and show a success message
      onClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerSubmit = () => {
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim()) {
      setSubmitError('Please fill in all required fields.');
      return;
    }
    setCurrentStep('payment');
    setSubmitError(null);
  };

  const handlePaymentSubmit = () => {
    if (!selectedPaymentMethod) {
      setSubmitError('Please select a payment method.');
      return;
    }
    handleSubmit(new Event('submit') as any);
  };

  const handleBack = () => {
    if (currentStep === 'payment') setCurrentStep('customer');
    else onClose();
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6',
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      )}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        aria-label="Close checkout"
      />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl transition-all duration-300',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Checkout</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close checkout modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isComplete = steps[1].id === 'payment' && currentStep !== step.id;

            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                    isActive && 'bg-blue-600 text-white',
                    isComplete && 'bg-green-500 text-white'
                  )}
                >
                  {isComplete ? (
                    <span className="flex h-5 w-5 items-center justify-center">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  ) : (
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium',
                    isActive && 'text-blue-600',
                    !isActive && 'text-slate-500'
                  )}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Body */}
        <div className="flex h-[600px] flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Customer Step */}
            {currentStep === 'customer' && (
              <form onSubmit={handleCustomerSubmit} className="space-y-4" aria-labelledby="customer-step-title">
                <h3 id="customer-step-title" className="text-xl font-bold text-slate-900">Customer Details</h3>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <textarea
                  placeholder="Delivery Address *"
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                />
                <input
                  type="text"
                  placeholder="City *"
                  value={formData.city}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                {submitError && currentStep === 'customer' && (
                  <p className="mt-2 text-sm text-red-600">{submitError}</p>
                )}
              </form>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6" aria-labelledby="payment-step-title">
                <h3 id="payment-step-title" className="text-xl font-bold text-slate-900">Select Payment Method</h3>

                {/* Payment Methods Grid */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {availableGateways.map((gateway) => {
                    const Icon = gateway.icon;
                    const isSelected = selectedPaymentMethod === gateway.key;

                    return (
                      <button
                        key={gateway.key}
                        type="button"
                        onClick={() => setSelectedPaymentMethod(gateway.key)}
                        className={cn(
                          'flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition',
                          isSelected
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={cn('h-6 w-6', isSelected ? 'text-blue-600' : 'text-slate-600')}
                            aria-hidden="true"
                          />
                          <span className="font-semibold text-slate-900">{gateway.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Payment Details Fields (conditional) */}
                {(selectedPaymentMethod === 'esewa' || selectedPaymentMethod === 'bank_transfer') && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
                      {selectedPaymentMethod === 'esewa' ? 'eSewa Details' : 'Bank Transfer Details'}
                    </h4>
                    {selectedPaymentMethod === 'esewa' ? (
                      <input
                        type="text"
                        value={esewaRefId}
                        onChange={(e) => setEsewaRefId(e.target.value)}
                        placeholder="Enter eSewa Transaction Reference ID"
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
                      />
                    ) : (
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-slate-700">{siteConfig.payments.bankTransfer?.bankName || 'Bank Name'}</p>
                        <p className="font-mono text-gray-800">{siteConfig.payments.bankTransfer?.accountNumber || 'Account Number'}</p>
                        <p className="font-medium text-slate-700">{siteConfig.payments.bankTransfer?.accountName || 'Account Holder'}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedPaymentMethod === 'cod' && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                      Cash on Delivery Info
                    </h4>
                    <textarea
                      placeholder="Any special delivery instructions..."
                      rows={2}
                      value={codNotes}
                      onChange={(e) => setCodNotes(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm resize-none"
                    />
                  </div>
                )}

                {submitError && currentStep === 'payment' && <p className="text-sm text-red-600">{submitError}</p>}
              </form>
            )}
          </div>

          {/* Order Summary Footer (always visible) */}
          <div className="border-t border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 text-base font-bold text-slate-900">Order Summary</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">
                  ${(subtotal / 100).toFixed(2)}
                </span>
              </div>
              {voucherCode && (
                <div className="flex justify-between text-green-600">
                  <span>Voucher ({voucherCode})</span>
                  <span className="font-medium">-${(discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600">Tax ({siteConfig.localization.taxRatePercentage}%)</span>
                <span className="font-medium text-slate-900">${(tax / 100).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 my-2 pt-2 flex items-center justify-between text-lg font-bold text-slate-900">
                <span>Total</span>
                <span className="ml-auto">${(total / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 'customer'}
                className={cn(
                  'flex-1 rounded-lg border px-4 py-3 text-sm font-bold transition hover:bg-slate-100 disabled:opacity-50',
                  currentStep === 'customer' ? 'cursor-default border-slate-200 bg-slate-100 text-slate-700' : 'border-amber-600 text-amber-700 hover:bg-amber-50'
                )}
              >
                <ChevronLeft className="mr-2 h-4 w-4 inline" />
                Back
              </button>
              <button
                type={currentStep === 'customer' ? 'button' : 'submit'}
                disabled={isSubmitting}
                onClick={currentStep === 'customer' ? handleCustomerSubmit : undefined}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
              >
                {isSubmitting ? 'Processing...' : currentStep === 'customer' ? 'Proceed to Payment' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}