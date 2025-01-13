import { Html, Head, Main, NextScript } from "next/document";
import { DocumentHeadTags, documentGetInitialProps } from "@mui/material-nextjs/v15-pagesRouter";

export default function Document({props}) {
  return (
    <Html lang="en">
      <Head>
        <DocumentHeadTags/>
       </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};