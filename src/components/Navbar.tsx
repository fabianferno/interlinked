import React from "react";
import ConnectWallet from "./ConnectWallet";
import Image from "next/image";
import Link from "next/link";
import { ColorModeButton } from "./ColorButton";
import { Heading, Box } from "@chakra-ui/react";
type Props = {};

const Navbar = (props: Props) => {
  return (
    <div className='mx-4 my-2'>
      <div className='container mx-auto flex justify-between items-center p-2'>

        <Link href="/" className="rounded-3xl  p-4 flex items-center justify-center">
          <Image
            priority
            src="/android-chrome-512x512.png"
            height={100}
            width={70}
            alt={"name"}
            className=""
          />
          <Heading marginLeft={5} fontSize={40} fontWeight="normal" >
            <strong>interlinked</strong> <span className="text-slate-600"> - transfer assets <span className="italic">safely</span> to any chain.</span>
          </Heading>
        </Link>
        <div className="flex items-center">
          <ConnectWallet />
          <ColorModeButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
