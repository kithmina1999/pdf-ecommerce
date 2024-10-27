import { db } from '@/db/db'
import { notFound } from 'next/navigation'
import React from 'react'
import Stripe from 'stripe'
import { CheckoutForm } from './_components/CheckoutForm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

interface Params {
    id: string;
}

interface PageProps {
    params: Params; // Ensure that params is typed correctly
}

export const PurchasePage: React.FC<PageProps> = async ({ params }) => {
    const { id } = params
    const product = await db.product.findUnique({ where: { id } })
    if (product == null) return notFound()

    const paymentIntent = await stripe.paymentIntents.create({
        amount: product.priceInCents,
        currency: "USD",
        metadata: { productId: product.id }
    })
    if (paymentIntent.client_secret === null) {
        throw new Error("Stripe failed to create payment intent")
    }

    return (
        <CheckoutForm product={product} clientSecret={paymentIntent.client_secret} />
    )
}
