/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  //fazer o next otimizar imagem de um endereço específico
images:{
  domains:[
    'files.stripe.com'
  ]
}

}


module.exports = nextConfig
