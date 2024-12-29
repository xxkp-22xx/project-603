import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SellPage = () => {
  const navigate = useNavigate();

  const [listPropertyData, setListPropertyData] = useState({ price: "" });
  const [changePriceData, setChangePriceData] = useState({
    propertyId: "",
    newPrice: "",
  });

  // Navigate to different pages
  const handleListProperty = () => {
    navigate("/listproperty");
  };

  const handleChangePrice = () => {
    navigate("/changePrice");
  };

  const goToAuctionPage = () => {
    navigate("/auction");
  };

  const goToPropertyDetailsPage = () => {
    navigate("/properties");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Sell Your Property</h1>

      <div style={styles.buttonContainer}>
        {/* List Property Button */}
        <button onClick={handleListProperty} style={styles.button}>
          List Property
        </button>

        {/* Change Price Button */}
        <button onClick={handleChangePrice} style={styles.button}>
          Change Price
        </button>

        {/* Auction Management Button */}
        <button onClick={goToAuctionPage} style={styles.button}>
          Manage Auctions
        </button>

        {/* Property Details Button */}
        <button onClick={goToPropertyDetailsPage} style={styles.button}>
          Property Details
        </button>
      </div>
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
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "30px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "4px",
    cursor: "pointer",
    width: "80%",
    margin: "10px auto",
  },
  section: {
    marginBottom: "30px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  subHeading: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "80%",
    margin: "10px auto",
  },
};

export default SellPage;
