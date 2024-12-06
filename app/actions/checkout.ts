'use server'

import { redirect } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
})

export async function handleCheckout(pkg: { name: string; price: number }) {
  console.log('Entering handleCheckout function')
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set')
    throw new Error('Stripe secret key is not set')
  }

  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    console.error('NEXT_PUBLIC_BASE_URL is not set')
    throw new Error('Base URL is not set')
  }

  try {
    console.log('Creating Stripe checkout session')
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${pkg.name} Video Package`,
            },
            unit_amount: pkg.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    })

    console.log('Checkout session created successfully')

    if (session.url) {
      console.log('Redirecting to Stripe checkout')
      return { success: true, url: session.url }
    } else {
      console.error('Session URL is undefined')
      throw new Error('Failed to create checkout session URL')
    }
  } catch (error) {
    console.error('Error in handleCheckout:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'An unknown error occurred' }
  }
}

