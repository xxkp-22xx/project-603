import React, { useState } from "react";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const ChangePrice = () => {
  const [propertyId, setPropertyId] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChangePrice = async (e) => {
    e.preventDefault();
    setStatusMessage("Processing transaction...");

    try {
      if (!propertyId || !newPrice) {
        throw new Error("Both Property ID and New Price are required.");
      }

      const accounts = await web3.eth.getAccounts();

      // Convert the new price to Wei (from Ether)
      const newPriceInWei = web3.utils.toWei(newPrice.toString(), "ether");

      // Call the changePrice function in the smart contract
      const transaction = await contract.methods
        .changePrice(propertyId, newPriceInWei)
        .send({
          from: accounts[0],
          gas: 3000000, // Adjust if necessary
        });

      setStatusMessage(`Price updated successfully! Transaction Hash: ${transaction.transactionHash}`);
    } catch (error) {
      console.error("Error changing property price:", error.message || error);
      setStatusMessage(`Error changing property price: ${error.message || error}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Change Property Price</h2>
      <form onSubmit={handleChangePrice} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Property ID:</label>
          <input
            type="text"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            placeholder="Enter Property ID"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>New Price (in ETH):</label>
          <input
            type="text"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Enter New Price"
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>
          Change Price
        </button>
      </form>
      {statusMessage && <p style={styles.statusMessage}>{statusMessage}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
  },
  submitButton: {
    padding: "12px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  submitButtonHover: {
    backgroundColor: "#0056b3",
  },
  statusMessage: {
    marginTop: "20px",
    fontSize: "16px",
    color: "#333",
    textAlign: "center",
  },
};

export default ChangePrice;
