import { useWalletStore } from "@/context/WalletContextProvider";
import React from "react";
import { Button } from "@chakra-ui/react";
import { useRouter } from 'next/router';


type Props = {};

const ConnectWallet = (props: Props) => {
  const router = useRouter();
  const { connectWallet, injectiveAddress } = useWalletStore();
  console.log(injectiveAddress)

  React.useEffect(() => {
    if (!injectiveAddress && router.pathname !== '/') {
      router.push('/');
    }
  }, [injectiveAddress]);

  const btnText = injectiveAddress
    ? `${injectiveAddress.slice(0, 5)}...${injectiveAddress.slice(-3)}`
    : "Connect Wallet";
  return (
    <Button onClick={connectWallet} size="lg" style={{
      borderTopLeftRadius: 100,
      borderBottomLeftRadius: 100,
    }} >
      <span className="text-lg">{btnText}</span>
    </Button>
  );
};

export default ConnectWallet;
