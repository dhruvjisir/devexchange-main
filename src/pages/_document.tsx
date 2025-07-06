import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          httpEquiv="Permissions-Policy"
          content="camera=*, publickey-credentials-get=*, clipboard-write=*, web-share=*, otp-credentials=*, publickey-credentials-create=*"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 