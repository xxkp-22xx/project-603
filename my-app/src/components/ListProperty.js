import React, { useState, useEffect } from "react";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const ListProperty = () => {
    const [price, setPrice] = useState("");
    const [properties, setProperties] = useState([]);

    // Load existing properties on component mount
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

    const handleListProperty = async () => {
        try {
            const weiPrice = web3.utils.toWei(price, "ether");
            const accounts = await web3.eth.getAccounts();
            const receipt = await contract.methods.listProperty(weiPrice).send({
              from: accounts[0],
              gas: 3000000, // Adjust this value as needed
          });
          
          console.log("Transaction successful! Receipt details:", receipt);
          
            const event = receipt.events.PropertyListed.returnValues;
            const newProperty = {
                id: event.propertyId.toString(),
                owner: event.owner,
                price: web3.utils.fromWei(event.price, "ether"),
            };

            setProperties([...properties, newProperty]); 
            setPrice("");
        } catch (error) {
            console.error("Error listing property:", error);
        }
    };

    return (
        <div style={styles.container}>
            {/* List Property Form */}
            <div style={styles.formContainer}>
                <h2 style={styles.title}>List Your Property</h2>
                <input
                    type="text"
                    placeholder="Enter price in ETH"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleListProperty} style={styles.button}>
                    List Property
                </button>
            </div>

            {/* List of Properties */}
            <div style={styles.listContainer}>
                <h2 style={styles.title}>Listed Properties</h2>
                {properties.length > 0 ? (
                    <ul style={styles.list}>
                        {properties.map((property) => (
                            <li key={property.id} style={styles.listItem}>
                                <strong>ID:</strong> {property.id}, <strong>Owner:</strong> {property.owner},{" "}
                                <strong>Price:</strong> {property.price} ETH
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={styles.noProperties}>No properties listed yet.</p>
                )}
            </div>
        </div>
    );
};

export default ListProperty;

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    },
    formContainer: {
        backgroundColor: "#f5f5f5",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
        width: "400px",
    },
    title: {
        fontSize: "1.5rem",
        marginBottom: "15px",
        textAlign: "center",
        color: "#333",
    },
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "1rem",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "1rem",
    },
    listContainer: {
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        width: "600px",
    },
    list: {
        listStyleType: "none",
        padding: 0,
    },
    listItem: {
        backgroundColor: "#fff",
        padding: "10px",
        borderBottom: "1px solid #eee",
        borderRadius: "4px",
        marginBottom: "10px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    noProperties: {
        textAlign: "center",
        color: "#888",
    },
};
