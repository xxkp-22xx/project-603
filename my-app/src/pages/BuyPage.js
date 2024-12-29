import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const BuyPage = () => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  // Fetch properties and their current details
  useEffect(() => {
    const loadProperties = async () => {
      const events = await contract.getPastEvents("PropertyListed", { fromBlock: 0 });

      const loadedProperties = await Promise.all(
        events.map(async (event) => {
          const propertyId = event.returnValues.propertyId.toString();

          // Fetch additional property details from contract
          const propertyDetails = await contract.methods.properties(propertyId).call();
          const highestBidder = await contract.methods.highestBidder(propertyId).call();
          const highestBid = web3.utils.fromWei(await contract.methods.highestBid(propertyId).call(), "ether");
          
          return {
            id: propertyId,
            owner: propertyDetails.owner,
            price: propertyDetails.price ? web3.utils.fromWei(propertyDetails.price, "ether") : "0",
            isListed: propertyDetails.isListed,
            isAuctionStarted: propertyDetails.isAuctionStarted,
            highestBidder: highestBidder,
            highestBid: highestBid,
          };
        })
      );

      setProperties(loadedProperties);
    };

    loadProperties();
  }, []);

  const handleBuyNow = () => {
    navigate(`/buyproperty`);
  };

  const handleStartBidding = () => {
    navigate(`/bid`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Available Properties</h2>
      {properties.length === 0 ? (
        <p style={styles.message}>No properties available for purchase.</p>
      ) : (
        <div style={styles.propertyList}>
          {properties.map((property) => (
            <div key={property.id} style={styles.propertyCard}>

              <p><strong>Property ID:</strong> {property.id}</p>
              <p><strong>Owner:</strong> {property.owner}</p>
              <p><strong>Price:</strong> {property.price} ETH</p>
              <p><strong>Listed:</strong> {property.isListed ? "Yes" : "No"}</p>
              <p>
                <strong>Auction Started:</strong>{" "}
                {property.isAuctionStarted ? "Yes" : "No"}
              </p>
              {property.isAuctionStarted && (
                <>
                  <p><strong>Highest Bidder:</strong> {property.highestBidder}</p>
                  <p><strong>Highest Bid:</strong> {property.highestBid} ETH</p>
                </>
              )}
              <button
                onClick={() => handleBuyNow()}
                style={styles.buyButton}
                disabled={!property.isListed || property.isAuctionStarted}
              >
                Buy Now
              </button>
                {property.isAuctionStarted && (
                  <button
                    onClick={() => handleStartBidding()}
                    style={styles.startBiddingButton}
                  >
                    Start Bidding
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  message: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#555",
  },
  propertyList: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
    marginTop: "20px",
  },
  propertyCard: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    textAlign: "left",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    position: "relative", // Needed for positioning the Start Bidding button
  },
  cardHeader: {
    // display: "flex",
    justifyContent: "bottom", // Align the button to the top right corner
    // position: "absolute",
    top: "15px",
    right: "15px",
  },
  startBiddingButton: {
    backgroundColor: "#FF5733", // Start Bidding button color
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  buyButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default BuyPage;
