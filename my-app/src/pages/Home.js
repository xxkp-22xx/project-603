import React from "react";
import { useNavigate } from "react-router-dom";
import img1 from '../images/img1.jpg'

const HomePage = () => {
  const navigate = useNavigate();

  const goToBuyPage = () => {
    navigate("/buy");
  };

  const goToSellPage = () => {
    navigate("/sell");
  };


  return (
    <div style={styles.container}>
        <img src={img1} alt="Property" style={styles.image} />
      <h1 style={styles.heading}>Welcome to Easy Property Deals</h1>
      <p style={styles.subtitle}>
        Simplifying real estate property transactions on the blockchain.
      </p>

      <div style={styles.buttonContainer}>
        <button onClick={goToBuyPage} style={styles.button}>
          Buy Properties
        </button>
        <button onClick={goToSellPage} style={styles.button}>
          Sell Properties
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "50px 20px",
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    display: "inline-block",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    display: 'flex',
    width: "100%",
    maxWidth: "800px",
    borderRadius: "8px",
  },
 
  heading: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "40px",
    color: "#555",
  },
  buttonContainer: {
    display: "inline-block",
    flexDirection: "column",
    gap: "20px",
    width: "80%",
    maxWidth: "400px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "15px 15px",
    marginBottom: '15px',
    fontSize: "18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width: "100%",
  },
};

export default HomePage;
