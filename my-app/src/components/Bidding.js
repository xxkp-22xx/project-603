import React, { useState, useEffect } from "react";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const Bid = () => {
  const [propertyId, setPropertyId] = useState("");
  const [bidValue, setBidValue] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(3);
  const [accounts, setAccounts] = useState([]);
  const [accountBalances, setAccountBalances] = useState({});
  const [highestBid, setHighestBid] = useState(null);
  const [highestBidder, setHighestBidder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch available accounts from Ganache when the component mounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const fetchedAccounts = await web3.eth.getAccounts();
        setAccounts(fetchedAccounts);
        if (fetchedAccounts.length > 0) {
          setSelectedAccount(fetchedAccounts[0]); // Set the first account as default
        }

        // Fetch balances for all accounts
        const balances = {};
        for (const account of fetchedAccounts) {
          const balanceInWei = await web3.eth.getBalance(account);
          balances[account] = web3.utils.fromWei(balanceInWei, "ether");
        }
        setAccountBalances(balances);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setError("Failed to load accounts. Please make sure Ganache is running.");
      }
    };
    fetchAccounts();
  }, []);

  // Fetch current highest bid and bidder
  useEffect(() => {
    const fetchHighestBid = async () => {
      if (propertyId) {
        try {
          const highestBidValue = await contract.methods.highestBid(propertyId).call();
          const highestBidderAddress = await contract.methods.highestBidder(propertyId).call();

          setHighestBid(web3.utils.fromWei(highestBidValue, "ether"));
          setHighestBidder(highestBidderAddress);
        } catch (err) {
          console.error("Error fetching highest bid:", err);
          setError("Failed to fetch highest bid and bidder.");
        }
      }
    };

    fetchHighestBid();
  }, [propertyId]); // Fetch the highest bid when the property ID changes

  // Handle placing a bid
  const handlePlaceBid = async () => {
    if (!propertyId || !bidValue || !selectedAccount) {
      setError("Please fill in all fields and select an account.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Convert bid value to Wei
      const bidInWei = web3.utils.toWei(bidValue, "ether");

      // Call the bid function in the contract
      await contract.methods.bid(propertyId, bidInWei).send({
        from: selectedAccount,
        gas: 3000000,
        value: bidInWei, // Send the bid value along with the transaction
      });

      alert(`Successfully placed a bid of ${bidValue} ETH on Property ID: ${propertyId}`);
    } catch (err) {
      console.error("Error placing bid:", err);
      setError("Failed to place bid. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Place a Bid</h2>

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
        <label style={styles.label}>Bid Value (in ETH):</label>
        <input
          type="number"
          placeholder="Enter your bid value"
          value={bidValue}
          onChange={(e) => setBidValue(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Account selection with balance display */}
      <div style={styles.inputContainer}>
        <label style={styles.label}>Select Account:</label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          style={styles.input}
        >
          {accounts.map((account, index) => (
            <option key={index} value={account}>
              Account {index} ({account}) - Balance: {accountBalances[account]} ETH
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handlePlaceBid}
        style={styles.button}
        disabled={loading}
      >
        {loading ? "Placing Bid..." : "Place Bid"}
      </button>

      {/* Display the current highest bid and highest bidder */}
      {highestBid !== null && highestBidder && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h3>Current Highest Bid</h3>
          <p>
            Highest Bidder: {highestBidder} <br />
            Highest Bid: {highestBid} ETH
          </p>
        </div>
      )}
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
    marginBottom: "20px",
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
  button: {
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

export default Bid;
