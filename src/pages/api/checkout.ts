import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stype";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const priceId = 'price_1M6Z5YC9O7WXolWLWpmdwT9R'

  const success_url = `${process.env.NEXT_URL}/success`
  const cancel_url = `${process.env.NEXT_URL}/cancel`

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url,
    cancel_url,
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  })

  return res.status(201).json({
    checkoutUrl: checkoutSession.url,
  })
}