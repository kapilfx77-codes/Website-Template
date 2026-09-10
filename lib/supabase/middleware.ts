/**
 * Supabase Middleware Helper
 *
 * Used by Next.js middleware.ts to update the user's session
 * on every request. The `updateSession()` call ensures that
 * the cookie-based auth session stays fresh as it passes through
 * the edge runtime.
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh auth session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Attach user info to response headers if needed by downstream handlers
  if (user) {
    supabaseResponse.headers.set('x-auth-user-id', user.id);
  }

  return supabaseResponse;
}