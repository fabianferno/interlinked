import { ESCROW_CONTRACT_ADDRESS } from "@/services/constants";
import { chainGrpcWasmApi, msgBroadcastClient } from "@/services/services";
import { getAddresses } from "@/services/wallet";
import {
    MsgExecuteContractCompat,
    MsgExecuteContract,
    fromBase64,
    getInjectiveAddress,
    toBase64,
} from "@injectivelabs/sdk-ts";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useWalletStore } from "./WalletContextProvider";
import { parse } from "path";

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
    sendPayment: (recipient: string, time_ahead: string, denom: string, amount: string) => void;
    revertPayment: (payment_id: string) => void;
    claimPayment: (payment_id: string) => void;
}

const EscrowContext = createContext<StoreState>({
    sentPayments: [],
    receivedPayments: [],
    isLoading: true,
    getSentPayments: () => { },
    getReceivedPayments: () => { },
    sendPayment: (recipient: string, time_ahead: string, denom: string, amount: string) => { },
    revertPayment: (payment_id: string) => { },
    claimPayment: (payment_id: string) => { },
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
    const { injectiveAddress } = useWalletStore();

    useEffect(() => {
        fetchSentPayments();
        fetchReceivedPayments();
    }, []);

    async function fetchSentPayments() {
        try {
            const response = (await chainGrpcWasmApi.fetchSmartContractState(
                ESCROW_CONTRACT_ADDRESS,
                toBase64({
                    get_sent_payments: {
                        sender: injectiveAddress,
                    }
                })
            )) as { data: string };
            const payments = fromBase64(response.data) as any[];
            let data: any = Array(payments)[0]


            setSentPayments(data?.Ok);
        } catch (e) {
            alert((e as any).message);
        }
    }

    async function fetchReceivedPayments() {
        try {
            const response = (await chainGrpcWasmApi.fetchSmartContractState(
                ESCROW_CONTRACT_ADDRESS,
                toBase64({
                    get_received_payments: {
                        receiver: injectiveAddress,
                    }
                })
            )) as { data: string };
            const payments = fromBase64(response.data) as any[];
            let data: any = Array(payments)[0]


            setReceivedPayments(data?.Ok);
        } catch (e) {
            alert((e as any).message);
        }
    }


    async function sendPayment(receiver: string, time_ahead: string, denom: string, amount: string) {
        if (!injectiveAddress) {
            alert("No Wallet Connected");
            return;
        } else {
            console.log("Ready to send payment")
        }

        setStatus(Status.Loading);

        try {
            const msg = MsgExecuteContractCompat.fromJSON({
                contractAddress: ESCROW_CONTRACT_ADDRESS,
                sender: injectiveAddress,
                msg: {
                    send_payment: {
                        receiver: receiver,
                        time_ahead: parseInt(time_ahead, 10),
                    },
                },
                funds:
                {
                    denom: denom,
                    amount: amount,
                },
            });

            await msgBroadcastClient.broadcast({
                msgs: msg,
                injectiveAddress: injectiveAddress,
            });
            fetchSentPayments();
            fetchReceivedPayments();
        } catch (e) {
            alert((e as any).message);
            console.log("Error sending payment: ", e)
        } finally {
            setStatus(Status.Idle);
        }
    }

    async function revertPayment(payment_id: string) {
        if (!injectiveAddress) {
            alert("No Wallet Connected");
            return;
        }

        setStatus(Status.Loading);

        try {
            const msg = MsgExecuteContractCompat.fromJSON({
                contractAddress: ESCROW_CONTRACT_ADDRESS,
                sender: injectiveAddress,
                msg: {
                    revert_payment: {
                        payment_id: parseInt(payment_id, 10)
                    },
                },
            });

            await msgBroadcastClient.broadcast({
                msgs: msg,
                injectiveAddress: injectiveAddress,
            });
            fetchSentPayments();
            fetchReceivedPayments();
        } catch (e) {
            alert((e as any).message);
        } finally {
            setStatus(Status.Idle);
        }
    }

    async function claimPayment(payment_id: string) {
        if (!injectiveAddress) {
            alert("No Wallet Connected");
            return;
        }

        setStatus(Status.Loading);

        try {
            const msg = MsgExecuteContractCompat.fromJSON({
                contractAddress: ESCROW_CONTRACT_ADDRESS,
                sender: injectiveAddress,
                msg: {
                    claim_payment: {
                        payment_id: parseInt(payment_id, 10)
                    },
                },
            });

            await msgBroadcastClient.broadcast({
                msgs: msg,
                injectiveAddress: injectiveAddress,
            });
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