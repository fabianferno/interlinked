import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Text,
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

const RecievedPaymentsModal = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading, revertPayment, claimPayment } = useEscrowStore();

  console.log("Receieved payments: ", props.payments);

  return (
    <>
      <Button
        borderRadius={15}
        border={"2px solid #34d399"}
        width={{ base: "100%", sm: "100%" }}
        onClick={onOpen}
      >
        Claim payments
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="1000px">
          <ModalHeader>Recieved Payments</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {props.payments.length === 0 ? (
              <Text>No transactions available</Text>
            ) : (
              <TableContainer>
                <Table variant="simple">
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
                      return (
                        <Tr key={index}>
                          <Td>{payment.payment_id}</Td>
                          <Td>{`${payment.receiver.slice(
                            0,
                            5
                          )}...${payment.receiver.slice(-3)}`}</Td>
                          <Td>{payment.amount_in_coins?.amount || "None"}</Td>
                          <Td>{payment.deadline}</Td>
                          <Td>{payment.claimed ? "Yes" : "No"}</Td>
                          <Td>{payment.reverted ? "Yes" : "No"}</Td>
                          <Td>
                            <Button
                              isDisabled={payment.claimed}
                              onClick={() => {
                                claimPayment(payment.payment_id);
                              }}
                            >
                              Claim
                            </Button>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            )}

            {props.children}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RecievedPaymentsModal;
