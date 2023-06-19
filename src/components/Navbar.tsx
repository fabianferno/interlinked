import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Image } from "@chakra-ui/react";
import Link from "next/link";
import { ColorModeButton } from "./ColorButton";
import { Heading, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useWalletClient, useAccount } from "wagmi";
import { Masa } from "@masa-finance/masa-sdk";
import { Signer } from "ethers";

type Props = {};

const Navbar = (props: Props) => {
  const { address } = useAccount();
  const [soulNames, setSoulNames] = useState<any>([]);
  const [arweaveURLs, setArweaveURLs] = useState([]);
  const { data: WalletClient } = useWalletClient();
  const signer: any = WalletClient;

  const getSoulNames = async () => {
    const masa = new Masa({
      signer,
      apiUrl: "https://dev.middleware.masa.finance/",
      environment: "dev",
      networkName: "goerli",
    });
    console.log("MASA: ", masa.contracts.instances.SoulNameContract);
    const [soulNames, extension] = await Promise.all([
      // get all soul names by address
      masa.soulName.loadSoulNames((address as string).toLowerCase()),
      // get extension for this contract
      masa.contracts.instances.SoulNameContract.extension(),
    ]);

    if (soulNames.length > 0) {
      console.log("Soul names:", "\n");
      let urls: any = [];
      soulNames.forEach(async (soulName) =>
        urls.push(
          masa.contracts.instances.SoulNameContract["tokenURI(string)"](
            soulName
          )
        )
      );
      urls = await Promise.all(urls);
      setArweaveURLs(urls);
      console.log("URLS: ", urls);
      setSoulNames(soulNames.map((soulName: any) => `${soulName}${extension}`));
    } else {
      console.log(`No soul names for ${address}`);
    }
  };

  useEffect(() => {
    try {
      if (signer) {
        getSoulNames();
      }
    } catch (e) {
      console.log(e);
    }
  }, [signer]);

  return (
    <div className="mx-4 my-2">
      <div className="container mx-auto flex justify-between items-center p-2">
        <Link
          href="/"
          className="rounded-3xl  p-4 flex items-center justify-center"
        >
          <Box bg={"#222222"} borderRadius={15}>
            <Image
              src="/android-chrome-512x512.png"
              height={"80px"}
              width={"70px"}
              alt={"name"}
              className=""
            />
          </Box>
          <Heading marginLeft={5} fontSize={40} fontWeight="normal">
            <div className="font-bold">interlinked</div>
            <div className="text-slate-600 text-[28px]">
              transfer assets <span className="italic">safely</span> to any
              chain.
            </div>
          </Heading>
        </Link>
        <div className="flex items-center">
          <ConnectButton />
          <ColorModeButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
