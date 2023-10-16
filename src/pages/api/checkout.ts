//api route no next:
//fazendo um checkout no stripe
import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";

export default async function handler(req: NextApiRequest, res:NextApiResponse){
const {priceId} = req.body;
//se essa rota for chamada por GET, por exeplo 
if(req.method != 'POST'){
    return res.status(405).json({error:'Method not allowed.'})
}

//se essa rota for acessada sem o priceId(sem o id do produto):
if(!priceId){
    return res.status(400).json({error:'Price not found.'})
}

const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`

const cancelUrl = `${process.env.NEXT_URL}/`

const checkoutSession = await stripe.checkout.sessions.create({
    success_url:successUrl,
    cancel_url:cancelUrl,
    mode: 'payment',
    line_items: [
    {
        price: priceId,
        quantity:1,
    }
],
})

return res.status(201).json({
    checkoutUrl: checkoutSession.url,
})
}