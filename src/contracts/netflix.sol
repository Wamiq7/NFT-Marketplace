// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SubscriptionService {
    enum Status {
        Active,
        Cancelled
    }

    struct Subscription {
        address payable owner;
        uint256 price;
        Status status;
    }

    mapping(address => Subscription) public subscriptions;

    event Subscribed(address indexed subscriber);
    event Cancelled(address indexed subscriber);

    uint256 public subscriptionPrice;

    address payable public paymentProcessor;

    constructor(address payable _paymentProcessor, uint256 _subscriptionPrice) {
        paymentProcessor = _paymentProcessor;
        subscriptionPrice = _subscriptionPrice;
    }

    function subscribe() public payable {
        require(
            subscriptions[msg.sender].status == Status.Cancelled ||
                subscriptions[msg.sender].owner == address(0),
            "Already have an active subscription"
        );
        require(
            msg.value >= subscriptionPrice,
            "Insufficient funds to subscribe"
        );
        require(
            msg.value == subscriptionPrice,
            "Error,the Subscription price is 0.1 ETH"
        );

        subscriptions[msg.sender] = Subscription(
            payable(msg.sender),
            subscriptionPrice,
            Status.Active
        );

        if (paymentProcessor != address(0)) {
            paymentProcessor.transfer(msg.value); // Process payment
        }

        emit Subscribed(msg.sender);
    }

    function cancelSubscription() public {
        Subscription storage subscription = subscriptions[msg.sender];
        require(
            subscription.owner != address(0) &&
                subscription.status == Status.Active,
            "No active subscription found"
        );

        subscription.status = Status.Cancelled;

        emit Cancelled(msg.sender);
    }

    function isActive() public view returns (bool) {
        Subscription storage subscription = subscriptions[msg.sender];
        return subscription.status == Status.Active;
    }
}
