
import React, { useEffect, useState } from "react";
import { useWalletStore } from "../context/WalletContextProvider";
import { Button, Box } from "@chakra-ui/react";
import Link from "next/link";

import Stepper from "../components/Stepper";

type Props = {};

function Home({ }: Props) {
  const { injectiveAddress } = useWalletStore();



  return (
    <center> <div className='flex justify-center pt-20 mx-20 container'>
      <div id="popup-parent" className="relative">
        <div className="mt-15 mb-10">
          <h1 className="text-5xl w-[440px] ">
            Interlinked helps you transfer your assets on
            <span className="font-bold italic text-green-400"> any chain</span> without ever having to worry about losing them, ever again.
          </h1>
        </div>
        {
          injectiveAddress ? <Link href="/vault">
            <Button size="lg" borderRadius={100}>
              Open the dApp
            </Button>
          </Link>
            : <Box borderRadius={100} className="font-bold p-3" maxWidth={
              "300px"
            } border={5} color={"black"} bg={"#34d399"}>
              Connect Wallet to get started
            </Box>
        }


        <div className="mt-24"><Stepper /></div>
      </div>



    </div>
      {/* <Link href="/temp">
        <Button size="lg">
          Temp
        </Button>
      </Link> */}
    </center>
  );
}

export default Home;
