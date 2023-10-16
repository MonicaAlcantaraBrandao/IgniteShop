import { AppProps } from "next/app"
import { globalStyles } from "../styles/global"

import logoImg from '../assets/logo.svg'
import { Container, Header } from "../styles/pages/app";

import Image from "next/image";

  //chamando a função global de styles
  //O melhor local para importar o globalStyles é fora da função App pois td vez que mudar de página tudo que está dentro do App executa de novo, e os estilos globais não mudam entre cada página.
  globalStyles();

//AppProps adicionar TypeScript - tipagem do next
export default function App({ Component, pageProps }: AppProps) {


  return (
    <Container>
      <Header>
        <Image src={logoImg} alt="" />

      </Header>
  <Component {...pageProps} />
  </Container>
  )
}

