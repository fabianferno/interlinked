import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Image } from "@chakra-ui/react";
import Link from "next/link";
import { ColorModeButton } from "./ColorButton";
import { Heading, Box } from "@chakra-ui/react";
type Props = {};

const Navbar = (props: Props) => {
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
