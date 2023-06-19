import React, { useEffect, useState } from "react";
import { Button, Box, Flex, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useAccount } from "wagmi";
import NoSSR from "@/components/NoSSR";

import Stepper from "../components/Stepper";

type Props = {};

function EscrowFeatures() {
  return (
    <Flex
      textAlign={"left"}
      align="center"
      justify="between"
      marginTop={100}
      marginBottom={20}
      height={"60vh"}
    >
      <Box
        borderWidth="2px"
        borderRadius={20}
        m={5}
        borderColor={"#34d399"}
        borderLeft={"1px"}
        p={10}
        pb={12}
      >
        <Text fontSize={"3xl"} fontWeight="bold">
          Trust and Security
        </Text>
        <Text width={"400px"}>
          An escrow smart contract reduces the risk of fraud by acting as a
          neutral party and ensuring proper escrow logic execution.
        </Text>
      </Box>
      <Box
        borderWidth="2px"
        borderRadius={20}
        borderColor={"#34d399"}
        borderLeft={"1px"}
        p={10}
        m={5}
        pb={12}
      >
        <Text fontSize={"3xl"} fontWeight="bold">
          Transparency
        </Text>
        <Text width={"400px"}>
          Operations happening in the system are transparent as relevant
          transactions are accessible to all blockchain participants.
        </Text>
      </Box>
      <Box
        borderWidth="2px"
        borderRadius={20}
        borderColor={"#34d399"}
        borderLeft={"1px"}
        p={10}
        pb={12}
        m={5}
      >
        <Text fontSize={"3xl"} fontWeight="bold">
          Efficiency
        </Text>
        <Text width={"400px"}>
          Blockchain eliminates the need for third parties, which in turn helps
          to reduce transaction costs and enhance service efficiency.
        </Text>
      </Box>
    </Flex>
  );
}

function Home({}: Props) {
  const { address } = useAccount();

  return (
    <NoSSR>
      <center>
        {" "}
        <div className="flex justify-center items-center pt-20 mx-20 container">
          <div id="popup-parent" className="relative">
            <Flex align={"centers"} marginTop={50} justify={"space-between"}>
              <Box marginTop={10} textAlign={"left"}>
                <Box className="mt-15 mb-10 text-left">
                  <h1 className="text-4xl w-[300px]">
                    Transfer your assets on
                    <span className="font-bold italic text-green-400">
                      {" "}
                      any chain
                    </span>{" "}
                    without ever having to worry about losing them, ever again.
                  </h1>
                </Box>
                {address ? (
                  <Button
                    onClick={() => {
                      window.location.href = "/vault";
                    }}
                    style={{
                      borderTopLeftRadius: 100,
                      borderBottomLeftRadius: 100,
                    }}
                    border={"1px solid #34d399"}
                    borderRadius={500}
                    size="lg"
                  >
                    Open the dApp
                  </Button>
                ) : (
                  <Box
                    borderWidth="1px"
                    style={{
                      borderTopLeftRadius: 100,
                      borderBottomLeftRadius: 100,
                    }}
                    borderRadius={500}
                    className="font-bold p-3"
                    maxWidth={"300px"}
                    color={"white"}
                    borderColor={"#34d399"}
                  >
                    Connect Wallet to get started
                  </Box>
                )}
              </Box>

              <Box
                marginRight={10}
                boxShadow="0 0 1000px 1px #34d399"
                borderWidth="2px"
                borderRadius={20}
                borderColor={"#34d399"}
                height={"450px"}
                borderStyle={"dashed"}
                overflow={"hidden"}
              >
                <Image
                  style={{
                    height: "60vh",
                    marginTop: "-50px",
                  }}
                  rounded="3xl"
                  src="uml.gif"
                />
              </Box>
            </Flex>

            <EscrowFeatures />

            <Flex
              height={"60vh"}
              justify={"center"}
              align={"center"}
              mx={10}
              mr={18}
            >
              <Box
                padding={20}
                width={"100%"}
                marginRight={40}
                height={"fit-content"}
                className="mb-12"
                borderRadius={20}
                borderColor={"#34d399"}
                boxShadow="0 0 1000px 1px #34d399"
                borderWidth="2px"
                borderStyle={"dashed"}
                overflow={"hidden"}
              >
                <Stepper />
              </Box>{" "}
              <Box textAlign={"right"}>
                <Text mb={20} fontWeight={"bold"} lineHeight={1} fontSize={60}>
                  easy <br /> seamless <br /> interlinked
                </Text>
              </Box>
            </Flex>
          </div>
        </div>
      </center>
    </NoSSR>
  );
}

export default Home;
