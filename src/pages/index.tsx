import { HomeContainer, Product } from "../styles/pages/home"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

import {useKeenSlider} from 'keen-slider/react'

import 'keen-slider/keen-slider.min.css'
import { stripe } from "../lib/stripe"
import { GetStaticProps } from "next"
import Stripe from "stripe"

interface HomeProps {
  products:{
    map(arg0: (product: any) => import("react").JSX.Element): import("react").ReactNode
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }
}

//props do export getServerSideProps
export default function Home({products}: HomeProps) {
const [sliderRef] = useKeenSlider({
  //3 produtos por slide, espaçamento entre os produtos
  slides:{
    perView: 3,
    spacing:48
  }
})

//é necessário por essas classes para aplicar o css
  return (
    <>
    {/*Editar o nome da guia da página (head) */}
    <Head>
      <title>Home | Ignite Shop</title>
    </Head>


   <HomeContainer ref={sliderRef} 
   className="keen-slider">
   {products.map(product => {
    return(
      //sempre o primeiro elemento do map deve receber a key
      //prefetch false: fazer o next não carregar os links de forma automática sem o usuário clicar nele.
      <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
      <Product className="keen-slider__slide">
        <Image priority={true} src={product.imageUrl} width={520} height={480} alt=""/>

        <footer>
          <strong>{product.name}</strong>
          <span>{product.price}</span>
        </footer>
        
      </Product>
      </Link>
    )
   })}

    </HomeContainer>
    </>
  )
}

//para funções que são renderizadas apenas no RunTime serem renderizadas no ServerSide:
//: fazer tipagem na função
// export const getServerSideProps: GetServerSideProps = async () =>{
// const response = await stripe.products.list({
//   expand: ['data.default_price']
// })

//Para páginas que não são editadas com muita frequencia, para ela ficar armazenada e carregar mais rápido por exemplo utilizamos o getStatic Props
export const getStaticProps: GetStaticProps = async () =>{
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

//função para pegar apenas os dados que queremos da api:
const products = response.data.map(product => {
  //o price tem vários dados como id, etc então para pegar apenas o preço temos que fazer:
const price  = product.default_price as Stripe.Price

return {
  id: product.id,
  name: product.name,
  imageUrl: product.images[0], /*[0] apenas a primeira imagem*/
  //formatar data:
  price: new Intl.NumberFormat('pt-Br', {
    style:'currency',
    currency:'BRL',
  }).format(price.unit_amount / 100),
     /* price.unit_amount / 100, unit-amount em centavos dividir por cem para ficar em reais*/
}
})

return{
  props:{
    products,
  },
  //Para a pagina n ficar estática para sempre, utilizamos o revalidate, que é o número em segundos que eu quero que a página seja revalidada
  revalidate: 60*60*2, //a cada duas horas
}
}