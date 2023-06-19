import React from "react";
import Navbar from "./Navbar1";
import Head from "next/head";

type Props = {
  children?: React.ReactNode;
};
const name = "Interlinked Defi Escrow Service";
export const siteTitle = "Interlinked Defi Escrow Service";

const Layout = (props: Props) => {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Interlinked Defi Escrow Service" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>Interlinked - Transfers assets securely</title>
      </Head>
      <Navbar />
      <div>{props.children}</div>
    </div>
  );
};

export default Layout;
