import { NextRequest, NextResponse } from 'next/server';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature') || '';
  try {
    const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      await supabase.from('orders').insert({ stripe_session_id: session.id, status: 'paid', total: session.amount_total || 0, customer_email: session.customer_email || '', created_at: new Date().toISOString() });
      return NextResponse.json({ received: true });
    }
    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 400 });
  }
}
