/**
 * Supabase Client-Side Helper
 *
 * Used in "use client" components via `createClient()` (browser).
 * This wrapper ensures the Supabase client is instantiated once
 * and respects Next.js App Router boundaries.
 */

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

/**
 * Creates a Supabase client configured for the browser.
 * Safe to call directly inside 'use client' components.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => {
        // Handled by middleware; placeholder for SSR hydration
        return [];
      },
      setAll: () => {
        // Placeholder — browser sets cookies automatically
      },
    },
  });
}
