export interface SiteConfig {
  // Store Identity
  name: string;
  shortName: string;
  description: string;
  url: string;
  ogImage: string;
  logo: {
    light: string;
    dark: string;
    width: number;
    height: number;
  };

  // Contact Information
  contact: {
    email: string;
    phone: string;
    whatsappNumber: string; // E.164 format, e.g. "+14155552671" or "+9779800000000"
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    socials: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      tiktok?: string;
    };
  };

  // Localization & Regional Settings
  localization: {
    defaultCurrency: "USD" | "EUR" | "GBP" | "AUD" | "NPR" | "INR" | string;
    currencySymbol: string;
    currencyPosition: "prefix" | "suffix"; // e.g., $100 vs 100 Rs.
    defaultLocale: string; // e.g., 'en-US', 'en-GB', 'ne-NP'
    supportedCurrencies: string[];
    taxRatePercentage: number; // e.g., 13 for 13% VAT or 8.875 for US Sales Tax
  };

  // Shipping Defaults
  shipping: {
    enableShippingCalculator: boolean;
    flatRateFee: number;
    freeShippingThreshold: number; // Set to 0 to disable
    estimatedDeliveryDays: string;
  };

  // Payment Gateways (Global & Regional)
  payments: {
    // International Gateways
    stripe: {
      enabled: boolean;
      publishableKey: string;
      enableApplePayGooglePay: boolean;
    };
    paypal: {
      enabled: boolean;
      clientId: string;
    };

    // Local / Regional Gateways
    esewa: {
      enabled: boolean;
      merchantCode: string;
      isTestMode: boolean;
    };
    khalti: {
      enabled: boolean;
      publicKey: string;
    };

    // Direct / Offline Methods
    cashOnDelivery: {
      enabled: boolean;
      fee: number;
      instructions: string;
    };
    whatsappOrder: {
      enabled: boolean;
      autoRedirect: boolean;
    };
    bankTransfer: {
      enabled: boolean;
      bankName: string;
      accountName: string;
      accountNumber: string;
      swiftCode?: string;
      qrCodeImage?: string;
    };
  };

  // Feature Toggles
  features: {
    enablePOS: boolean; // In-store counter dashboard
    enableMultiCurrency: boolean;
    enableReviews: boolean;
    enableWishlist: boolean;
    enableGuestCheckout: boolean;
    enableStockTracking: boolean;
  };

  // UI Theme Configuration
  theme: {
    primaryColor: string; // Tailwind color or Hex
    accentColor: string;
    borderRadius: "none" | "sm" | "md" | "lg" | "full";
  };
}

export const siteConfig: SiteConfig = {
  // ----------------------------------------------------
  // 1. STORE IDENTITY
  // ----------------------------------------------------
  name: "Apex Store",
  shortName: "Apex",
  description:
    "A modern multi-channel white-label e-commerce storefront & POS platform.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  ogImage: "/images/og-image.jpg",
  logo: {
    light: "/images/logo-light.svg",
    dark: "/images/logo-dark.svg",
    width: 140,
    height: 40,
  },

  // ----------------------------------------------------
  // 2. CONTACT DETAILS
  // ----------------------------------------------------
  contact: {
    email: "support@example.com",
    phone: "+1 (800) 555-0199",
    whatsappNumber: "+18005550199",
    address: {
      street: "123 Commerce Way, Suite 400",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://x.com",
      tiktok: "https://tiktok.com",
    },
  },

  // ----------------------------------------------------
  // 3. CURRENCY & LOCALIZATION
  // Change defaultCurrency to 'USD', 'GBP', 'AUD', 'NPR', etc.
  // ----------------------------------------------------
  localization: {
    defaultCurrency: "USD",
    currencySymbol: "$",
    currencyPosition: "prefix",
    defaultLocale: "en-US",
    supportedCurrencies: ["USD", "GBP", "EUR", "AUD", "NPR"],
    taxRatePercentage: 8.0, // 8% Sales Tax / VAT
  },

  // ----------------------------------------------------
  // 4. SHIPPING SETTINGS
  // ----------------------------------------------------
  shipping: {
    enableShippingCalculator: true,
    flatRateFee: 10.0,
    freeShippingThreshold: 100.0, // Orders over $100 get free shipping
    estimatedDeliveryDays: "3-5 Business Days",
  },

  // ----------------------------------------------------
  // 5. PAYMENT GATEWAYS CONFIGURATION
  // Toggle `enabled: true/false` depending on client location
  // ----------------------------------------------------
  payments: {
    // Global Gateways (US, UK, Australia, Europe, etc.)
    stripe: {
      enabled: true,
      publishableKey:
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_sample",
      enableApplePayGooglePay: true,
    },
    paypal: {
      enabled: true,
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sample_client_id",
    },

    // Regional Gateways (Nepal / South Asia)
    esewa: {
      enabled: false, // Set to true for Nepal deployment
      merchantCode: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE || "EPAYTEST",
      isTestMode: process.env.NODE_ENV !== "production",
    },
    khalti: {
      enabled: false, // Set to true for Nepal deployment
      publicKey:
        process.env.NEXT_PUBLIC_KHALTI_PUBLIC_KEY || "Key_Test_123456",
    },

    // Manual / Direct Checkout Options
    cashOnDelivery: {
      enabled: true,
      fee: 0,
      instructions: "Pay with cash directly upon parcel delivery.",
    },
    whatsappOrder: {
      enabled: true,
      autoRedirect: true,
    },
    bankTransfer: {
      enabled: true,
      bankName: "Global International Bank",
      accountName: "Apex Retailers LLC",
      accountNumber: "01234567890123",
      swiftCode: "GIBNUS33XXX",
      qrCodeImage: "/images/bank-qr.jpg",
    },
  },

  // ----------------------------------------------------
  // 6. FEATURE TOGGLES
  // ----------------------------------------------------
  features: {
    enablePOS: true,
    enableMultiCurrency: true,
    enableReviews: true,
    enableWishlist: true,
    enableGuestCheckout: true,
    enableStockTracking: true,
  },

  // ----------------------------------------------------
  // 7. BRAND THEME & STYLING
  // ----------------------------------------------------
  theme: {
    primaryColor: "#0F172A", // Slate-900 / Modern Dark Accent
    accentColor: "#3B82F6", // Blue-500
    borderRadius: "md",
  },
};