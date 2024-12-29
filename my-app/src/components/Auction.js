import React, { useState } from "react";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const Auction = () => {
  const [propertyId, setPropertyId] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle auction start logic
  const handleStartAuction = async () => {
    if (!propertyId || !startingPrice || !duration) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      // Convert ETH to Wei
      const priceInWei = web3.utils.toWei(startingPrice, "ether");

      // Call the startAuction function in the contract
      await contract.methods
        .startAuction(propertyId, priceInWei, duration)
        .send({ from: account });

      console.log(`Auction started for Property ID: ${propertyId}, ${duration} seconds`);
    } catch (err) {
      console.error("Error starting auction:", err);
      setError("Failed to start auction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle auction stop logic and transfer ownership
  const handleStopAuction = async () => {
    if (!propertyId) {
      setError("Please enter a valid property ID");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      // Get the highest bidder for the property
      const highestBidder = await contract.methods.highestBidder(propertyId).call();
      
      // Check if the current account is the owner or the highest bidder
      const property = await contract.methods.properties(propertyId).call();
      if (!(account === property.owner || account === highestBidder)) {
        setError("Only the owner or the highest bidder can stop the auction.");
        return;
      }

      // Call the stopAuction function in the contract to transfer ownership and stop the auction
      await contract.methods.stopAuction(propertyId).send({ from: account });

      alert(`Auction stopped for Property ID: ${propertyId}`);
      alert(`Ownership transferred to the highest bidder: ${highestBidder}`);
    } catch (err) {
      console.error("Error stopping auction:", err);
      setError("Failed to stop auction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Auction Management</h2>

      {/* Display any errors */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={styles.inputContainer}>
        <label style={styles.label}>Property ID:</label>
        <input
          type="number"
          placeholder="Enter property ID"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.inputContainer}>
        <label style={styles.label}>Starting Price (in ETH):</label>
        <input
          type="number"
          placeholder="Enter starting price"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.inputContainer}>
        <label style={styles.label}>Duration (in seconds):</label>
        <input
          type="number"
          placeholder="Enter duration in seconds"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.buttonContainer}>
        <button
          onClick={handleStartAuction}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Starting Auction..." : "Start Auction"}
        </button>
        <button
          onClick={handleStopAuction}
          style={{ ...styles.button, backgroundColor: "#FF5733" }}
          disabled={loading}
        >
          {loading ? "Stopping Auction..." : "Stop Auction"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    margin: "20px auto",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: "15px",
  },
  label: {
    marginBottom: "8px",
    fontSize: "16px",
    fontWeight: "500",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "15px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Auction;
