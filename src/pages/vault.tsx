import { useEscrowStore } from "@/context/EscrowContextProvider";
import React, { useEffect, useState } from "react";
import NoSSR from "@/components/NoSSR";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Flex,
  Stack,
  Select,
  Text,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import RecievedPaymentsModal from "@/components/RecievedPaymentsModal";
import SentPaymentsModal from "@/components/SentPaymentsModal";
import { useNetwork } from "wagmi";

type Props = {};

function Vault({}: Props) {
  const { chain, chains } = useNetwork();
  const { colorMode } = useColorMode();

  const [recievingAddress, setRecievingAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [denom, setUnit] = useState("eth");
  const [timeAhead, setTimeAhead] = useState("");

  const {
    sentPayments,
    receivedPayments,
    isLoading,
    getSentPayments,
    getReceivedPayments,
    sendPayment,
    revertPayment,
    claimPayment,
  } = useEscrowStore();

  useEffect(() => {
    //
    getSentPayments();
    getReceivedPayments();
  }, []);

  function handleSendPayment() {
    console.log(recievingAddress, timeAhead, denom, amount);
    sendPayment(recievingAddress, timeAhead, denom, amount);
  }

  return (
    <NoSSR>
      <div className="flex justify-center mt-14">
        <Box textAlign="center" minW={"500px"} maxW="500px" mx="auto">
          <Box
            boxShadow="0 0 1000px 1px #34d399"
            borderWidth="2px"
            marginTop={30}
            p={10}
            pt={8}
            borderRadius={20}
          >
            <Heading mb={10} textAlign={"left"} fontWeight={"normal"} size="lg">
              Send <strong style={{ color: "#34d399" }}>assets</strong> to any
              chain
              <hr className="mt-5" />
            </Heading>

            <Stack spacing={3} mb={4}>
              <FormControl>
                <div className="mb-4">
                  <FormLabel>Receiving Address</FormLabel>
                  <Input
                    type="text"
                    placeholder="0x1234..."
                    value={recievingAddress}
                    onChange={(e) => setRecievingAddress(e.target.value)}
                  />
                </div>{" "}
                <Flex align="center" justify="space-between">
                  <div className="mb-4 mr-2">
                    <FormLabel>Amount to be sent</FormLabel>
                    <Input
                      type="number"
                      placeholder="100"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <FormLabel>Currency</FormLabel>
                    <Input
                      type="text"
                      placeholder="eth"
                      value={denom}
                      isDisabled={true}
                      onChange={(e) => setUnit(e.target.value)}
                    />
                  </div>
                </Flex>
                <Flex align="center" justify="space-between">
                  <div className="mb-4 mr-3">
                    <FormLabel>Source Chain</FormLabel>
                    {/* Dropdown with networks */}
                    <Input
                      isDisabled={true}
                      value={chain ? chain.name : "Loading..."}
                    />
                  </div>

                  <div className="mb-4">
                    <FormLabel>Destination Chain</FormLabel>
                    {/* Dropdown with networks */}
                    <Select placeholder="Select the chain/network">
                      {/* <option value="bnb">Binance Smart Chain</option>
                  <option value="eth">Ethereum</option>
                  <option value="sol">Solana</option>
                  <option value="terra">Terra</option> */}
                      {chains ? (
                        chains.map((chain) => (
                          <option value={chain.name}>{chain.name}</option>
                        ))
                      ) : (
                        <option value="null">Loading Chains...</option>
                      )}
                    </Select>
                  </div>
                </Flex>
              </FormControl>
            </Stack>
            <Button
              bg={"#34d399"}
              color={colorMode === "dark" ? "black" : "black"}
              width={{ base: "100%" }}
              size="lg"
              borderRadius={15}
              onClick={handleSendPayment}
            >
              Send Assets
            </Button>
            <Flex marginTop={3} justifyContent={"space-between"}>
              <SentPaymentsModal
                onClose={() => {}}
                isOpen={false}
                payments={sentPayments}
              ></SentPaymentsModal>
              <RecievedPaymentsModal
                onClose={() => {}}
                isOpen={false}
                payments={receivedPayments}
              ></RecievedPaymentsModal>
            </Flex>
          </Box>

          <Text my={4}>
            Transaction Status: {isLoading ? "Loading..." : "Ready"}
          </Text>
        </Box>
      </div>
    </NoSSR>
  );
}

export default Vault;
