import React, { useState, useEffect } from "react";
import web3 from "../utils/web3"; // Import web3 instance
import contract from "../utils/contract"; // Import contract instance

const BuyProperty = () => {
  const [propertyId, setPropertyId] = useState(""); // State for property ID
  const [propertyPrice, setPropertyPrice] = useState(""); // State for property price
  const [statusMessage, setStatusMessage] = useState(""); // Status messages
  const [properties, setProperties] = useState([]);


  useEffect(() => {
    const loadProperties = async () => {
        const events = await contract.getPastEvents("PropertyListed", { fromBlock: 0 });
        const loadedProperties = events.map((event) => ({
            id: event.returnValues.propertyId.toString(),
            owner: event.returnValues.owner,
            price: web3.utils.fromWei(event.returnValues.price, "ether"),
        }));
        setProperties(loadedProperties);
    };
    loadProperties();
}, []);

  // Handle Buy Property
  const handleBuyProperty = async (e) => {
    e.preventDefault();
    setStatusMessage("Processing transaction...");
  
    try {
      if (!propertyId || !propertyPrice) {
        throw new Error("Property ID and Price are required.");
      }
  
      const priceInWei = web3.utils.toWei(propertyPrice.toString(), "ether");
  
      const accounts = await web3.eth.getAccounts();
  
      // Call the contract's buyProperty function
      console.log(propertyPrice)

      const transaction = await contract.methods
        .buyProperty(propertyId, priceInWei) // Pass ID and price
        .send({
          from: accounts[2],
          value: priceInWei, // Ensure the Ether value is provided
          gas: 6000000, // Adjust if needed
        });
        contract.events.PaymentReceived({}, (error, event) => {
          if (!error) console.log("PaymentReceived event:", event);
        });

      console.log(priceInWei)

      setStatusMessage(`Property purchased successfully! Transaction Hash: ${transaction.transactionHash}`);
      alert(`Property purchased successfully! Transaction Hash: ${transaction.transactionHash}`);

    } catch (error) {
      console.error("Error purchasing property:", error.message || error);
      setStatusMessage(`Error purchasing property: ${error.message || error}`);
    }
  };



  return (
    <div style={styles.container}>
      <h2>Buy Property</h2>
      <form onSubmit={handleBuyProperty} style={styles.form}>
        <label style={styles.label}>Property ID:</label>
        <input
          type="text"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          style={styles.input}
          placeholder="Enter Property ID"
        />

        <label style={styles.label}>Property Price (in ETH):</label>
        <input
          type="text"
          value={propertyPrice}
          onChange={(e) => setPropertyPrice(e.target.value)}
          style={styles.input}
          placeholder="Enter Property Price"
        />

        <button type="submit" style={styles.button}>
          Buy Property
        </button>
      </form>
      {statusMessage && <p style={styles.status}>{statusMessage}</p>}
    </div>
  );
};

// Basic styles for the component
const styles = {
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  status: {
    marginTop: "20px",
    color: "#333",
  },
};

export default BuyProperty;
