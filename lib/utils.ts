/**
 * Utility Functions
 *
 * Shared helper functions for the application.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { siteConfig } from '@/config/site';

/**
 * Merges Tailwind CSS classes with proper precedence.
 * Uses clsx for conditional class names and tailwind-merge for removing conflicts.
 *
 * @example
 * cn('p-4', 'p-2', 'bg-blue-500') // => 'p-2 bg-blue-500'
 * cn('p-4', isActive && 'bg-blue-500') // => 'p-4 bg-blue-500' if isActive is true
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price amount with the configured currency.
 * Reads currencySymbol and currencyPosition from siteConfig.
 *
 * @param amount - The amount in cents (or base currency units)
 * @param showCurrency - If true, shows the currency symbol/sign
 * @returns Formatted price string (e.g., '$100.00' or '100.00 $')
 */
export function formatPrice(amountInCents: number, showCurrency: boolean = true): string {
  if (!amountInCents && amountInCents !== 0) return '';

  const dollars = Math.abs(amountInCents) / 100;
  const sign = amountInCents < 0 ? '-' : '';
  const formatted = dollars.toFixed(2);

  if (!showCurrency) {
    return `${sign}${formatted}`;
  }

  const { currencySymbol, currencyPosition } = siteConfig.localization;

  if (currencyPosition === 'prefix') {
    return `${sign}${currencySymbol}${formatted}`;
  }

  return `${sign}${formatted} ${currencySymbol}`;
}

/**
 * Generates a WhatsApp message link from cart items and customer details.
 * Constructs a clean, formatted message with product details and total.
 * Redirects the user to WhatsApp with the message pre-filled.
 *
 * @param cartItems - Array of cart items with IDs, titles, quantities, and prices
 * @param customerDetails - Customer name, phone number, delivery address
 * @param totalAmount - Total order amount (in cents)
 * @returns WhatsApp API URL to open with pre-filled message
 */
export function generateWhatsAppLink(
  cartItems: Array<{
    id: string;
    title: string;
    quantity: number;
    price: number;
  }>,
  customerDetails: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  },
  totalAmount: number
): string {
  const { whatsappNumber } = siteConfig.contact;

  // Format the message
  const message = `🛒 New Order - ${siteConfig.name}

👤 Customer Details:
• Name: ${customerDetails.fullName}
• Phone: ${customerDetails.phone}
• Address: ${customerDetails.address}, ${customerDetails.city}

📦 Order Items:
${cartItems
  .map(
    (item) =>
      `  • ${item.title} (Qty: ${item.quantity}) - ${formatPrice(item.price * item.quantity, false)}`
  )
  .join('\n')}

💰 Total Amount: ${formatPrice(totalAmount, false)}
⏰ Order Time: ${new Date().toLocaleString()}

Please confirm this order.`;

  // Encode the message and append to WhatsApp API URL
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}

/**
 * Validates phone number format (supports E.164 format)
 * @param phone - Phone number to validate
 * @returns Boolean indicating if the phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validates Indian phone number format (10 digits)
 * @param phone - Phone number to validate
 * @returns Boolean indicating if the phone number is valid
 */
export function isValidIndianPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Calculates tax amount based on subtotal and tax rate.
 * Reads taxRatePercentage from siteConfig.localization.
 *
 * @param subtotal - Subtotal amount (in cents)
 * @returns Tax amount (in cents)
 */
export function calculateTax(subtotal: number): number {
  const { taxRatePercentage } = siteConfig.localization;
  return (subtotal * taxRatePercentage) / 100;
}

/**
 * Calculates total with tax and optional discount.
 *
 * @param subtotal - Subtotal amount (in cents)
 * @param discount - Discount amount (in cents)
 * @returns Final total amount (in cents)
 */
export function calculateTotal(subtotal: number, discount: number = 0): number {
  return subtotal - discount;
}

/**
 * Validates email format
 * @param email - Email address to validate
 * @returns Boolean indicating if the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * Replaces potentially dangerous characters with HTML entities.
 *
 * @param input - Raw HTML string
 * @return Sanitized HTML string
 */
export function sanitizeHTML(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}