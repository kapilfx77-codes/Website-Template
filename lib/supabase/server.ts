/**
 * Supabase Server-Side Helper
 *
 * Used in Server Components (`app/` pages) via `createServerClient`.
 * This wrapper reads cookies from the Next.js Headers API,
 * enabling authenticated server-side queries.
 */

import { createServerClient as createSSRSupabaseClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

/**
 * Creates a Supabase client configured for server components.
 * Reads session cookies from the Next.js request headers.
 *
 * Usage:
 * ```ts
 * export default async function Page() {
 *   const supabase = await createServerClient();
 *   const { data: { session } } = await supabase.auth.getSession();
 *   // ...
 * }
 * ```
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSSRSupabaseClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          // The `setAll` method was called from a Server Component.
          // This is expected in some frameworks; ignore the error.
          console.warn('Cannot set cookies in Server Component context:', error);
        }
      },
    },
  });
}
