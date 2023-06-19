// import { ESCROW_CONTRACT_ADDRESS } from "@/services/constants"; //
import SenderContract_ABI from "../contracts/ERC20Sender.json";
import ReceiverContract_ABI from "../contracts/ERC20Sender.json";
// import {
//   apiUrls,
//   contractAddress,
//   OxReceiverUNO_ABI,
//   OxSenderUNO_ABI,
//   tokenName,
// } from "../contract/constants";
import { useAccount,useContractWrite, usePrepareContractWrite,useContractRead  } from "wagmi";
import { ethers } from "ethers";

import React, { createContext, useContext, useEffect, useState } from "react";

enum Status {
  Idle = "idle",
  Loading = "loading",
}

type StoreState = {
  sentPayments: any[];
  receivedPayments: any[];
  isLoading: boolean;
  getSentPayments: () => void;
  getReceivedPayments: () => void;
  sendPayment: (
    recipient: string,
    time_ahead: string,
    denom: string,
    amount: string
  ) => void;
  revertPayment: (payment_id: string) => void;
  claimPayment: (payment_id: string) => void;
};

const EscrowContext = createContext<StoreState>({
  sentPayments: [],
  receivedPayments: [],
  isLoading: true,
  getSentPayments: () => {},
  getReceivedPayments: () => {},
  sendPayment: (
    recipient: string,
    time_ahead: string,
    denom: string,
    amount: string
  ) => {},
  revertPayment: (payment_id: string) => {},
  claimPayment: (payment_id: string) => {},
});

export const useEscrowStore = () => useContext(EscrowContext);

type Props = {
  children?: React.ReactNode;
};

const EscrowContextProvider = (props: Props) => {
  const senderContractAddress ="0x54c4698a16f8adDFB3c74999AbAdEEdf888EEd88";
  const receiverContractAddress ="0xB604Ae2e459DAEd05F0Fa43104E08AAB85287E2d"; 
  const [sentPayments, setSentPayments] = useState<any[]>([]);
  const [receivedPayments, setReceivedPayments] = useState<any[]>([]);
  const [status, setStatus] = useState<Status>(Status.Idle);
  const isLoading = status == Status.Loading;
  const { address, isConnecting, isDisconnected } = useAccount();

  useEffect(() => {
    fetchSentPayments();
    fetchReceivedPayments();
  }, []);

  async function fetchSentPayments() {
    try {
      const { data, isError, isLoading } = useContractRead({
        address: senderContractAddress,
        abi: SenderContract_ABI,
        functionName: 'getSentPayments',
      })
      
      const response: any = data;
      setSentPayments(response);
    } catch (e) {
      alert((e as any).message);
    }
  }

  async function fetchReceivedPayments() {
    try {
      // get_received_payments: {
      //     receiver: injectiveAddress,
      //   },
      // TODO: Call contract

      const { data, isError, isLoading } = useContractRead({
        address: senderContractAddress,
        abi: SenderContract_ABI,
        functionName: 'getReceivedPayments',
      })
      const response: any = data;
      setReceivedPayments(response);
    } catch (e) {
      alert((e as any).message);
    }
  }

  async function sendPayment(
    receiver: string,
    time_ahead: string,
    denom: string,
    amount: string
  ) {
    if (!address) {
      alert("No Wallet Connected");
      return;
    } else {
      console.log("Ready to send payment");
    }

    setStatus(Status.Loading);

    try {
      // send_payment: {
      //     receiver: receiver,
      //     time_ahead: parseInt(time_ahead, 10),
      //     denom: denom,
      //     amount: amount,
      //   },
      // TODO: Call contract

      const { config } = usePrepareContractWrite({
        address: senderContractAddress,
        abi: SenderContract_ABI,
        functionName: 'sendPayment',
        args:[
          receiver,
          "0x2c852e740B62308c46DD29B982FBb650D063Bd07",//addres of erc20 token aUSDC on ploygon
          amount,
          parseInt(time_ahead, 10)
        ]
      })

      const { data, isLoading, isSuccess, write } = useContractWrite(config)

      fetchSentPayments();
      fetchReceivedPayments();
    } catch (e) {
      alert((e as any).message);
      console.log("Error sending payment: ", e);
    } finally {
      setStatus(Status.Idle);
    }
  }

  async function revertPayment(payment_id: string) {
    if (!address) {
      alert("No Wallet Connected");
      return;
    }

    setStatus(Status.Loading);

    try {
      // revert_payment: {
      //     payment_id: parseInt(payment_id, 10),
      //   },
      // TODO: Call contract

      const { config } = usePrepareContractWrite({
        address: senderContractAddress,
        abi: SenderContract_ABI,
        functionName: 'revertPayment',
        args:[
          payment_id
        ]
      })

      const { data, isLoading, isSuccess, write } = useContractWrite(config)
      fetchSentPayments();
      fetchReceivedPayments();
    } catch (e) {
      alert((e as any).message);
    } finally {
      setStatus(Status.Idle);
    }
  }

  async function claimPayment(payment_id: string) {
    if (!address) {
      alert("No Wallet Connected");
      return;
    }

    setStatus(Status.Loading);

    try {
      // claim_payment: {
      //     payment_id: parseInt(payment_id, 10),
      //   },
      // TODO: Call contract

      const { config } = usePrepareContractWrite({
        address: senderContractAddress,
        abi: SenderContract_ABI,
        functionName: 'claimPayment',
        args:[
          payment_id,
          "ethereum-2",//destChain
          "Polygon",//srcChain
          "aUSDC",//symbol
        ]
      })

      const { data, isLoading, isSuccess, write } = useContractWrite(config)
      
      fetchSentPayments();
      fetchReceivedPayments();
    } catch (e) {
      alert((e as any).message);
    } finally {
      setStatus(Status.Idle);
    }
  }

  return (
    <EscrowContext.Provider
      value={{
        sentPayments,
        receivedPayments,
        isLoading,
        getSentPayments: fetchSentPayments,
        getReceivedPayments: fetchReceivedPayments,
        sendPayment,
        revertPayment,
        claimPayment,
      }}
    >
      {props.children}
    </EscrowContext.Provider>
  );
};

export default EscrowContextProvider;
