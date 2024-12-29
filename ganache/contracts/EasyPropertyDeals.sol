// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EasyPropertyDeals {
    // Property struct, full details of property that we throtughoutly fetch in all the functions in contract, 
    // and mappings in frontend

    struct Property {
        uint256 id;
        address owner;
        uint256 price;
        bool isListed;
        bool isAuctionStarted;
        uint256 auctionEndTime;
        address highestBidder;
        uint256 highestBid;
    }

    uint256 public propertyCounter = 0;

    mapping(uint256 => Property) public properties;

    //these events are emitted after proper execution of function
    event PropertyListed(uint256 propertyId, address owner, uint256 price);
    event PaymentReceived(uint256 propertyId, address buyer, uint256 amount);
    event OwnershipTransferred(uint256 propertyId, address from, address to);
    event PriceChanged(uint256 propertyId, uint256 newPrice);
    event AuctionStarted(
        uint256 propertyId,
        uint256 startingPrice,
        uint256 auctionEndTime
    );
    event NewHighestBid(uint256 propertyId, address bidder, uint256 amount);
    event AuctionStopped(uint256 propertyId, address winner);

    // modifiers that are used in granting and restricting access, or validating inputs 
    modifier onlyOwner(uint256 _propertyId) {
        require(
            properties[_propertyId].owner == msg.sender,
            "Not the property owner"
        );
        _;
    }

    modifier isListed(uint256 _propertyId) {
        require(properties[_propertyId].isListed, "Property is not listed");
        _;
    }

    modifier validPayment(uint256 _propertyId) {
        uint256 price = properties[_propertyId].price;

        require(msg.value >= price, "Insufficient payment amount ");
        require(msg.value <= price, "Overpayment not allowed");
        _;
    }

    modifier isAuctionStarted(uint256 _propertyId) {
        require(
            properties[_propertyId].isAuctionStarted,
            "Property is not in auction mode"
        );
        _;
    }

    modifier auctionActive(uint256 _propertyId) {
        require(
            block.timestamp <= properties[_propertyId].auctionEndTime,
            "Auction has ended"
        );
        _;
    }

    modifier auctionEnded(uint256 _propertyId) {
        require(
            block.timestamp > properties[_propertyId].auctionEndTime,
            "Auction is still active"
        );
        _;
    }

    /// @dev Function to list a property for sale, that takes property price and add one property in properties mapping 
    function listProperty(uint256 _price) public {
        require(_price > 0, "Price must be greater than zero");

        propertyCounter++;
        properties[propertyCounter] = Property({
            id: propertyCounter,
            owner: msg.sender,
            price: _price,
            isListed: true,
            isAuctionStarted: false,
            auctionEndTime: 0,
            highestBidder: address(0),
            highestBid: 0
        });

        emit PropertyListed(propertyCounter, msg.sender, _price);
    }

    /// @dev Function to buy a listed property
    function buyProperty(
        uint256 _propertyId,
        uint256 _propertyPrice
    ) public payable isListed(_propertyId) {
        Property storage property = properties[_propertyId];
        require(
            msg.sender != property.owner,
            "Owner cannot buy their own property"
        );
        require(
            _propertyPrice == _propertyPrice,
            "Sent value does not match the property price"
        );
        require(
            _propertyPrice == property.price,
            "Incorrect property price provided"
        );
        // Transfer funds to the property owner
        payable(property.owner).transfer(msg.value);

        // Transfer ownership to the buyer and delist the property
        address previousOwner = property.owner;
        property.owner = msg.sender;
        property.isListed = false;

        // Emit necessary events
        emit PaymentReceived(_propertyId, msg.sender, msg.value);
        emit OwnershipTransferred(_propertyId, previousOwner, msg.sender);
    }

    function getPropertyCount() public view returns (uint256) {
        return propertyCounter;
    }

    //getter function to get property details fetch by ID
    function getProperty(uint256 _id) public view returns (Property memory) {
    return properties[_id];
}


    event DebugInfo(uint256 propertyPrice, uint256 msgValue, address owner);

    /// @dev Function to change the price of a listed property (By the owner only)
    function changePrice(
        uint256 _propertyId,
        uint256 _newPrice
    ) public onlyOwner(_propertyId) isListed(_propertyId) {
        require(_newPrice > 0, "Price must be greater than zero");

        properties[_propertyId].price = _newPrice;

        emit PriceChanged(_propertyId, _newPrice);
    }

    /// @dev Function to start an auction
    function startAuction(
        uint256 _propertyId,
        uint256 _startingPrice,
        uint256 _duration
    ) public onlyOwner(_propertyId) isListed(_propertyId) {
        require(_startingPrice > 0, "Starting price must be greater than zero");
        require(_duration > 0, "Auction duration must be greater than zero");

        Property storage property = properties[_propertyId];
        property.isAuctionStarted = true;
        property.price = _startingPrice;
        property.auctionEndTime = block.timestamp + _duration;

        emit AuctionStarted(
            _propertyId,
            _startingPrice,
            property.auctionEndTime
        );
    }

    // some mappings that will help us to fetch auction related data of a property
    mapping(uint256 => uint256[]) public propertyBids; // Mapping to store all bid amounts for each property
mapping(uint256 => address) public highestBidder;  // Mapping to store the highest bidder for each property
mapping(uint256 => uint256) public highestBid;     // Mapping to store the highest bid for each property
    event BidRefunded(uint256 propertyId, address bidder, uint256 refundedAmount);
        event BidError(uint256 propertyId, address bidder, string errorMessage);

// Main bidding function that takes bid price and property ID
function bid(uint256 _propertyId, uint256 _bidPrice) public payable 
    isAuctionStarted(_propertyId) auctionActive(_propertyId) {
        Property storage property = properties[_propertyId];

        try this.validateBid(_propertyId, _bidPrice) {
            // Refund the previous highest bidder if applicable
            if (highestBidder[_propertyId] != address(0)) {
                try this.refundPreviousBid(_propertyId) {
                    // Refund successful
                } catch {
                    emit BidError(_propertyId, highestBidder[_propertyId], "Refund failed");
                    revert("Failed to refund previous bidder");
                }
            }

            // Store the new bid in the mapping for this property
            propertyBids[_propertyId].push(_bidPrice);

            // Then update the highest bidder and highest bid for this property
            highestBidder[_propertyId] = msg.sender;
            highestBid[_propertyId] = _bidPrice;
            property.isListed = false;

            emit NewHighestBid(_propertyId, msg.sender, _bidPrice);
        } catch Error(string memory reason) {
            emit BidError(_propertyId, msg.sender, reason);
            revert(reason);
        } catch {
            emit BidError(_propertyId, msg.sender, "Unknown error occurred during bid validation");
            revert("Unknown error");
        }
    }

    function validateBid(uint256 _propertyId, uint256 _bidPrice) external view {
        Property storage property = properties[_propertyId];

        // Ensure the sender is not the owner
        require(msg.sender != property.owner, "Owner cannot place a bid");

        // Ensure the bid is higher than the current highest bid
        require(
            _bidPrice > highestBid[_propertyId],
            "Bid must be higher than the current highest bid"
        );

    }

    // Refund logic as a separate function
function refundPreviousBid(uint256 _propertyId) external {
    address previousBidder = highestBidder[_propertyId];
    uint256 previousBid = highestBid[_propertyId];

    // Ensure there was a previous bidder
    require(previousBidder != address(0), "No previous bidder to refund");

    // Emit the refund event
    emit BidRefunded(_propertyId, previousBidder, previousBid);
}

    /// @dev Function to end an auction
    function stopAuction(uint256 _propertyId) public {
    Property storage property = properties[_propertyId];

    // Ensure only the current owner or the highest bidder can stop the auction
    require(msg.sender == property.owner || msg.sender == highestBidder[_propertyId], "Only owner or highest bidder can stop the auction");

    // Transfer the property to the highest bidder
    address highestBidderAddress = highestBidder[_propertyId];
    property.owner = highestBidderAddress;

    // Set auction started flag to false
    property.isAuctionStarted = false;

    emit AuctionStopped(_propertyId, highestBidderAddress); // Emit event to notify about auction stop
    }
}
