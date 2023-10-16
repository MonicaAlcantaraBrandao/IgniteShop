//este arquivo (document é o html) é o documento index.html 

import { Html, Head, Main, NextScript } from "next/document"
import { getCssText } from "../styles"

export default function Document(){
    return(
        //html em volta de td, isso é um doc html
        <Html>
            <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous'/>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"/>
            
            {/*Para a estilização não funcionan apenas no RunTime */}
            <style id="stitches" dangerouslySetInnerHTML={{__html:getCssText()}}/>
            </Head>
            <body>
                {/*Main => qual lugar do html vão os conteúdos das páginas 
                *<div id='root'></div>*/}
                <Main/>
                {/*NextScript => qual local do html queremos carregar os scripts JS 
                *<script type="text/javascript" src="main.ts"></script>*/}
                <NextScript/>
            </body>
        </Html>
    )
}