import Layout from "@/components/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import EscrowContextProvider from "@/context/EscrowContextProvider";
import WalletContextProvider from "@/context/WalletContextProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WalletContextProvider>
        <EscrowContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </EscrowContextProvider>
      </WalletContextProvider>
    </ChakraProvider>
  );
}
