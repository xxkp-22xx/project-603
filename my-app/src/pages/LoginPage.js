import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
  // State to handle input values and login status
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Static credentials
  const validUsername = "admin";
  const validPassword = "password123";

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Handle login button click
  const handleLogin = () => {
    if (
      credentials.username === validUsername &&
      credentials.password === validPassword
    ) {
    //   alert("Login successful!");
      setErrorMessage(""); // Clear error message
      navigate("/home")
    } else {
      setErrorMessage("Invalid username or password");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      <div style={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "300px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "5px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
  },
  buttonHover: {
    backgroundColor: "#45a049",
  },
  error: {
    marginTop: "10px",
    color: "red",
    fontSize: "0.9rem",
  },
};

export default LoginPage;
