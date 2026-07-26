import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia' as any,
});

export async function POST(req: NextRequest) {
  try {
    const { bookingId, placeName, amountCents = 5000, userEmail } = await req.json();

    if (!bookingId || !placeName) {
      return NextResponse.json(
        { error: 'Missing required parameters: bookingId and placeName are required.' },
        { status: 400 }
      );
    }

    const origin = req.headers.get('origin') || 'http://localhost:3006';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `TourAssist Deposit: ${placeName}`,
              description: `Reservation deposit for ${placeName}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/?payment=success&booking_id=${bookingId}`,
      cancel_url: `${origin}/?payment=canceled`,
      metadata: {
        booking_id: bookingId,
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Stripe checkout session' },
      { status: 500 }
    );
  }
}
