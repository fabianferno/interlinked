import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head   >
        <meta charSet="utf-8" />
        <meta name="description" content="Interlinked is a tool which can be used to make ethereum based transactions safely." />
        <meta name="keywords" content="Interlinked, Ethereum, Transactions, Safe, Secure, Fast, Easy" />
        <meta name="author" content="Interlinked" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          Interlinked
        </title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
