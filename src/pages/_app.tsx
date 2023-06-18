import Layout from "@/components/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai, goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import customTheme from "@/styles/theme";

const { chains, publicClient } = configureChains(
  [polygonMumbai, goerli],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_GOERLI_KEY,
    } as any),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Interlinked",
  projectId: "537f3c398cea791c07619208ee51d9d5",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={customTheme}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          coolMode
          chains={chains}
          theme={darkTheme({
            accentColor: "#30ff4f",
            accentColorForeground: "black",
            borderRadius: "large",
            fontStack: "rounded",
            overlayBlur: "small",
          })}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}
