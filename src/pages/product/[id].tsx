import {ImageContainer, ProductContainer, ProductDetails} from '../../styles/pages/product'
import {GetStaticPaths, GetStaticProps} from 'next'
import { stripe } from "../../lib/stripe"
import Stripe from "stripe"
import Image from "next/image"
import axios from 'axios'
import { useState } from 'react'
import Head from 'next/head'

interface ProductProps{
    product:{
        id: string;
        name: string;
        imageUrl: string;
        price: string;
        description: string;
        defaultPriceId: string;
    }
}

export default function Product({product}:ProductProps){
     //estado para criar um carregamento se demorar muito a carregar a tela do stripe
     const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)
async function handleBuyProduct(){
    //é aconselhavel usarmos o try-catch para quando vamos lidar com requisições para apis externas, principalmente para operações que vem através de ações do usuário, para conseguirmos mostrar para o user se deu algum erro ou se está tudo certo:
  try{
    setIsCreatingCheckoutSession(true)
    const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
    })

    const {checkoutUrl} = response.data;

    //para enviar o usuário para uma url externa(nesse caso para o stripe) usamos, assim como fazemos no JS tradicional:
    window.location.href = checkoutUrl

    //se fossemos redirecionar o usuário para uma rota interna na nossa aplicação:
    /*
    *const router = useRouter() 
    ...
    router.push('/checkout')
    */

   //Não é necessario colocar outro setIsCreatingCheckoutSession(false) quando der tudo certo, pois vai ser redirecionado para outra tela, o usuário nem vai ver a aplicação mais.
  } catch(err){
    //Conectar com uma ferramenta de observabilidade (Datadog/Sentry)
  
    setIsCreatingCheckoutSession(false)

    alert('Falha ao direcionar ao checkout!')
  }
}

    //quando usamos o fallback temos que utilizar uma tela de carregamento para o next carregar todas as infos da página:
// const {isFallback} = useRouter()
// if(isFallback){
//     return <p>Loading...</p>
// }
return(
    <>
     <Head>
      <title>{product.name} | Ignite Shop</title>
    </Head>

    <ProductContainer>
        <ImageContainer>
           <Image priority={true} src={product.imageUrl} width={520} height={480} alt=""></Image>
        </ImageContainer>

        <ProductDetails>
            <h1>{product.name}</h1>
            <span>{product.price}</span>

            <p>{product.description}</p>

            <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>Comprar agora</button>
        </ProductDetails>
    </ProductContainer>
    </>
)
}
//para páginas dinâmicas temos que utilizar o getStaticPaths para o programa identificar de onde o id vem:
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        //não é possivel colocar todos os produtos de um e-commerce com milhares de produtos, por exemplo, de forma estática então colocamos os params dos mais acessados por exemplo:
        paths:[
            { params: {id:'prod_OdB19vBukCWbKx'}}
        ],
        //para o restante dos produtos carregarem normalmente e não ocorrer erros, ultilizamos o fallback:
        fallback: true,
    }
}

//GetStaticProps - tipagem

//o método retrieve espera que o primiero parâmetro seja uma string(const product), então temos que passar alguns parâmetros para o GetStaticProps :<primeiro, segundo>, o primeiro se refere ao retorno, qual o tipo das props que vamos passar para o GSP, o segundo se refere a qual será o formato do objeto de params(productId), que no caso deve ser uma string> id: string:
export const getStaticProps: GetStaticProps<any, {id: string} > = async ({params}) => {
//temos que fazer uma página estática POR PRODUTO nessa situação, então, usamos o params para podermos acessar o parametro ID que vem do nome do arquivo:
const productId = params.id;

//buscar o produto dentro do stripe<site de apis teste>
 const product = await stripe.products.retrieve(productId,{
    expand:['default_price']
 });

  //o price tem vários dados como id, etc então para pegar apenas o preço temos que fazer:
 const price  = product.default_price as Stripe.Price

return{
    props:{
        product:{
            id: product.id,
            name: product.name,
            imageUrl: product.images[0], /*[0] apenas a primeira imagem*/
            //formatar data:
            price: new Intl.NumberFormat('pt-Br', {
              style:'currency',
              currency:'BRL',
            }).format(price.unit_amount / 100),
               /* price.unit_amount / 100, unit-amount em centavos dividir por cem para ficar em reais*/
               description: product.description,
               defaultPriceId:price.id,
        }
    },
    revalidate:60 * 60 * 1, //1hora
}
}