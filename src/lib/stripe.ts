import Stripe from "stripe";

//o primiero parâmetro deve ser a api key, appInfo => todas as chamadas no stripe fica um log no dashboard do stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
apiVersion: '2023-08-16',
appInfo:{
    name: 'Ignite Shop'
}
})