import React, { useEffect, useState } from "react";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const PropertiesList = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProperties = async () => {
        try {
            setLoading(true);

            // Fetch total property count
            const propertyCount = parseInt(await contract.methods.getPropertyCount().call(), 10);
            const fetchedProperties = [];

            // Iterate through property IDs and fetch details
            for (let i = 1; i <= propertyCount; i++) { // Assuming property IDs start from 1
                const property = await contract.methods.getProperty(i).call();
                console.log("Raw property data:", property); // Debug log for structure

                // Map property data to readable format
                fetchedProperties.push({
                    id: i,
                    owner: property.owner || "N/A",
                    price: property.price ? web3.utils.fromWei(property.price, "ether") : "0",
                    isListed: property.isListed ?? false,
                    isAuctionStarted: property.isAuctionStarted ?? false,
                    auctionEndTime: property.auctionEndTime || "Not available",
                    highestBidder: property.highestBidder || "N/A",
                    highestBid: property.highestBid ? web3.utils.fromWei(property.highestBid, "ether") : "0",
                });
            }

            // Filter for only listed properties
            const listedProperties = fetchedProperties.filter((prop) => prop.id);
            setProperties(listedProperties);
        } catch (error) {
            console.error("Error fetching properties:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    return (
        <div style={styles.container}>
            <h3 style={styles.header}>All Listed Properties</h3>
            {loading ? (
                <p style={styles.loadingText}>Loading properties...</p>
            ) : properties.length > 0 ? (
                <ul style={styles.propertyList}>
                    {properties.map((property) => (
                        <li key={property.id} style={styles.propertyItem}>
                            <p><strong>ID:</strong> {property.id}</p>
                            <p><strong>Owner:</strong> {property.owner}</p>
                            <p><strong>Price:</strong> {property.price} ETH</p>
                            <p><strong>Is Listed:</strong> {property.isListed.toString()}</p>
                            <p><strong>Auction Started:</strong> {property.isAuctionStarted.toString()}</p>
                            <p><strong>Auction End Time:</strong> {property.auctionEndTime}</p>
                            <p><strong>Highest Bidder:</strong> {property.highestBidder}</p>
                            <p><strong>Highest Bid:</strong> {property.highestBid} ETH</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={styles.noPropertiesText}>No properties listed yet...</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "10px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    header: {
        textAlign: "center",
        fontSize: "24px",
        color: "#333",
        marginBottom: "10px",
    },
    loadingText: {
        textAlign: "center",
        fontSize: "18px",
        color: "#777",
    },
    noPropertiesText: {
        textAlign: "center",
        fontSize: "18px",
        color: "#d9534f",
        padding: '0px'
    },
    propertyList: {
        listStyleType: "none",
        padding: "0",
    },
    propertyItem: {
        marginBottom: "5px",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
};

export default PropertiesList;
