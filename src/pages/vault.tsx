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
import RecievedPaymentsModal from "@/components/RecievedPaymentsModal";
import SentPaymentsModal from "@/components/SentPaymentsModal";
import { useNetwork } from "wagmi";

type Props = {};

function Vault({}: Props) {
  const { chain, chains } = useNetwork();

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
      <div className="flex justify-center">
        <Box textAlign="center" p={4} minW={"450px"} maxW="500px" mx="auto">
          <Heading fontWeight={"normal"} size="lg">
            Send <strong>assets</strong> on any chain
          </Heading>
          <Box marginTop={30} borderWidth={1} p={4} rounded="md">
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
                </div>
                <div className="mb-4">
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
                {/* <div className="mb-4">
                <FormLabel>Time ahead in secs</FormLabel>
                <Input
                  type="number"
                  placeholder="100000"
                  value={timeAhead}
                  onChange={(e) => setTimeAhead(e.target.value)}
                />
              </div> */}
                <div className="mb-4">
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
              </FormControl>
            </Stack>
            <Button
              width={{ base: "100%" }}
              size="lg"
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

          <Text mt={4}>
            Transaction Status: {isLoading ? "Loading..." : "Ready"}
          </Text>
        </Box>
      </div>
    </NoSSR>
  );
}

export default Vault;
