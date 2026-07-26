import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia' as any,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: any;

  try {
    if (stripeWebhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, stripeWebhookSecret);
    } else {
      // In dev mode without webhook secret configured yet, parse body directly
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata?.booking_id;

    if (bookingId) {
      console.log(`💳 Payment confirmed for booking ${bookingId}`);
      
      const { error } = await supabase
        .from('bookings_and_queries')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          stripe_session_id: session.id,
        })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking status in Supabase:', error);
      } else {
        console.log(`✅ Successfully updated booking ${bookingId} to paid & confirmed`);
      }
    }
  }

  return NextResponse.json({ received: true });
}
