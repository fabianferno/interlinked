//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import {IERC20} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

contract ERC20SenderEscrow {
    IAxelarGasService immutable gasService;
    IAxelarGateway immutable gateway;

    constructor(address _gateway, address _gasReceiver) {
        gateway = IAxelarGateway(_gateway);
        gasService = IAxelarGasService(_gasReceiver);
    }

    struct Payment {
        address sender;
        address receiver;
        address erc20Token;
        uint256 amount;
        uint256 deadline;
        bool claimed;
        bool reverted;
        uint256 paymentId;
    }

    mapping(address => mapping(uint256 => Payment)) public sentPayments;
    mapping(address => mapping(uint256 => Payment)) public receivedPayments;
    
    Payment[] public payments;
    uint256 public currPaymentId = 0;

    event PaymentInitiated(uint256 payId, address sender, address receiver, address erc20Token, uint256 amount, uint256 deadline);
    event PaymentClaimed(uint256 payId, address sender, address receiver, address erc20Token, uint256 amount);
    event PaymentReverted(uint256 payId, address sender, address receiver, address erc20Token, uint256 amount);

    function sendPayment(address _receiver, address _erc20Token, uint256 _amount, uint256 _timeAhead) external {
        require(msg.sender != _receiver, "Sender and receiver cannot be the same");
        uint256 deadline = block.timestamp + _timeAhead;
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(_amount > 0, "Payment amount must be greater than zero");

        currPaymentId++;
        Payment memory payment = Payment(msg.sender, _receiver, _erc20Token, _amount, deadline, false, false, currPaymentId);
        sentPayments[msg.sender][currPaymentId] = payment;
        receivedPayments[_receiver][currPaymentId] = payment;

        IERC20 token = IERC20(payment.erc20Token);
        //sender will have to first give allowance to contract
        token.transferFrom(msg.sender, address(this), _amount);

        payments.push(payment);
        emit PaymentInitiated(currPaymentId, msg.sender, _receiver, _erc20Token, _amount, deadline);
    }

    function claimPayment(uint256 _paymentId,
        string calldata destinationChain,
        string calldata destinationAddress,
        string calldata symbol) external payable 
        {
            Payment storage payment = receivedPayments[msg.sender][_paymentId];
            Payment storage payment_sender = sentPayments[payment.sender][_paymentId];
            require(payment.receiver == msg.sender, "Receiver can only claim the payment");
            require(!payment.claimed, "Payment has already been claimed");
            require(!payment.reverted, "Payment has been reverted by the sender");
            require(block.timestamp <= payment.deadline, "Payment deadline has passed");

            uint256 amount = payment.amount;
            address tokenAddress = gateway.tokenAddresses(symbol);
            
            IERC20(tokenAddress).approve(address(gateway), amount);
            bytes memory payload = abi.encode(payment.receiver);
            if (msg.value > 0) {
                gasService.payNativeGasForContractCallWithToken{value: msg.value}(
                    address(this),
                    destinationChain,
                    destinationAddress,
                    payload,
                    symbol,
                    amount,
                    msg.sender
                );
            }
            gateway.callContractWithToken(
                destinationChain,
                destinationAddress,
                payload,
                symbol,
                amount
            );

        payment.claimed = true;
        payment_sender.claimed = true;
        payments[_paymentId - 1].claimed = true;
        emit PaymentClaimed(_paymentId, payment.sender, payment.receiver, payment.erc20Token, payment.amount);
    }

    function revertPayment(uint256 _paymentId) external {
        Payment storage payment = sentPayments[msg.sender][_paymentId];
        require(payment.sender == msg.sender, "Sender can only revert their own payments");
        require(!payment.claimed, "Payment has already been claimed");
        require(!payment.reverted, "Payment has already been reverted");

        payment.reverted = true;
        payments[_paymentId - 1].reverted = true;

        IERC20 token = IERC20(payment.erc20Token);
        token.transfer(payment.sender, payment.amount);

        emit PaymentReverted(_paymentId, payment.sender, payment.receiver, payment.erc20Token, payment.amount);
    }

    function getSentPayments(address _sender) external view returns (Payment[] memory) {
        Payment[] memory result = new Payment[](currPaymentId);
        uint256 count = 0;
        for (uint256 i = 1; i <= currPaymentId; i++) {
            if (sentPayments[_sender][i].sender == _sender) {
                result[count] = sentPayments[_sender][i];
                count++;
            }
        }
        return result;
    }

       function getReceivedPayments(address _receiver) external view returns (Payment[] memory) {
        Payment[] memory result = new Payment[](currPaymentId);
        uint256 count = 0;
        for (uint256 i = 1; i <= currPaymentId; i++) {
            if (receivedPayments[_receiver][i].receiver == _receiver) {
                result[count] = receivedPayments[_receiver][i];
                count++;
            }
        }
        return result;
    }
}