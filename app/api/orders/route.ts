import { createServerClient } from '@/lib/supabase/server';
import { InsertOrders, InsertOrderItems } from '@/types/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, paymentMethod, total, voucherCode, esewaRefId, codNotes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required.' }, { status: 400 });
    }
    if (!customer || !customer.fullName || !customer.phone || !customer.address || !customer.city) {
      return NextResponse.json({ error: 'Customer details are required.' }, { status: 400 });
    }
    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method is required.' }, { status: 400 });
    }

    const supabase = await createServerClient();

    // Insert order
    const orderPayload: InsertOrders = {
      status: 'pending',
      payment_method: paymentMethod as InsertOrders['payment_method'],
      total_amount: Math.round(total),
      shipping_address: `${customer.address}, ${customer.city}`,
      billing_address: `${customer.address}, ${customer.city}`,
      notes: codNotes || (esewaRefId ? `eSewa Ref: ${esewaRefId}` : undefined),
    };

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select('id')
      .single();

    if (orderError || !orderData) {
      console.error('Order insert error:', orderError);
      return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
    }

    const orderId = orderData.id;

    // Insert order items
    const orderItemsPayload: InsertOrderItems[] = items.map((item: any) => ({
      order_id: orderId,
      product_id: item.productId || item.id,
      variant_id: item.variant_id || undefined,
      quantity: item.quantity,
      unit_price: Math.round(item.price),
      total_price: Math.round(item.price * item.quantity),
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);

    if (itemsError) {
      console.error('Order items insert error:', itemsError);
      // Attempt rollback: delete order if items failed
      await supabase.from('orders').delete().eq('id', orderId);
      return NextResponse.json({ error: 'Failed to create order items.' }, { status: 500 });
    }

    return NextResponse.json({ orderId, status: 'pending', message: 'Order created successfully.' }, { status: 201 });
  } catch (err: any) {
    console.error('API /orders error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error.' }, { status: 500 });
  }
}
