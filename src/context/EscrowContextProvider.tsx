import { ESCROW_CONTRACT_ADDRESS } from "@/services/constants";
import { useAccount } from "wagmi";

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
      // get_sent_payments: {
      //     sender: address,
      //   },
      // TODO: Call contract
      const response: any = [];

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
      const response: any = [];

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
