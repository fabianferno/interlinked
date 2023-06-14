import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure, Table,
    Thead,
    Tbody,
    Tr,
    Th, Text,
    Td,
    TableContainer,
} from "@chakra-ui/react";
import { useEscrowStore } from "@/context/EscrowContextProvider";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    payments: any[];
};

const SentPaymentsModal = (props: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isLoading,
        revertPayment,
        claimPayment } = useEscrowStore();

    // let data = {
    //     sender: "inj1mvc7aerqquucgaxvum4k783qkdtwusxeglczw4",
    //     receiver: "inj1ql844rspzklj9wrna5v40ld5zklxxtxlgf0575",
    //     amount: 1000000,
    //     amount_in_coins: { denom: "inj", amount: "1000000" },
    //     deadline: 1685398098,
    //     claimed: false,
    //     reverted: false,
    //     payment_id: 1,
    // };

    // let payments = [data]

    console.log("Sent payments: ", props.payments)
    return (
        <>
            <Button bg={"#4f46e5"} marginRight={3} width={{ base: '100%', sm: '100%' }} onClick={onOpen}>Revert Payments</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="1000px">
                    <ModalHeader>Sent Payments</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {props.payments.length === 0 ? <Text>No transactions available</Text> : <TableContainer>
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th>Payment ID</Th>
                                        <Th>Recipient</Th>
                                        <Th>Amount</Th>
                                        <Th>Deadline</Th>
                                        <Th>Claimed</Th>
                                        <Th>Reverted</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {props.payments.map((payment: any, index) => {
                                        return <Tr key={index}>
                                            <Td>{payment.payment_id}</Td>
                                            <Td>{`${payment.receiver.slice(0, 5)}...${payment.receiver.slice(-3)}`}</Td>
                                            <Td>{payment.amount_in_coins?.amount || "None"}</Td>
                                            <Td>{payment.deadline}</Td>
                                            <Td>{payment.claimed ? "Yes" : "No"}</Td>
                                            <Td>{payment.reverted ? "Yes" : "No"}</Td>
                                            <Td><Button isDisabled={payment.reverted} onClick={() => {
                                                revertPayment(payment.payment_id)
                                            }}>Revert</Button></Td>
                                        </Tr>
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>}
                        {props.children}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    );
};

export default SentPaymentsModal;
