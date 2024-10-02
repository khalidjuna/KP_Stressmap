// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import * as AuthService from "../../../Services/AuthService.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import store from "../../../store.js";

const styles = {
  dashboardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  header: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
    fontFamily: "Playfair Display, serif",
  },
  infoSection: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    marginBottom: "20px",
    width: "100%",
    maxWidth: "800px",
    textAlign: "left",
  },
  actionsSection: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "800px",
  },
  actionButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontFamily: "Poppins, sans-serif",
  },
};

const DashboardComponent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setDefault } = store();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/v1/user"); // Adjust the endpoint
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async (e) => {
    alert("Logged out");
    e.preventDefault();
    const result = await AuthService.logout();
    if (result.success) {
      navigate("/stressmap/login", { replace: true });
      setDefault();
    } else {
      //
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div style={styles.dashboardContainer}>
        <h1 style={styles.header}>User Dashboard</h1>

        {/* User Info Section */}
        {user && (
          <div style={styles.infoSection}>
            <h2>User Information</h2>
            <p>
              <strong>Name:</strong> {user.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "N/A"}
            </p>
            <p>
              <strong>Position:</strong> {user.position || "N/A"}
            </p>
            <p>
              <strong>Institution:</strong> {user.institution || "N/A"}
            </p>
            <p>
              <strong>City:</strong> {user.city || "N/A"}
            </p>
            <p>
              <strong>Country:</strong> {user.country || "N/A"}
            </p>
          </div>
        )}

        <div style={styles.actionsSection}>
          <button
            style={styles.actionButton}
            onClick={() => alert("Edit Profile")}
          >
            Edit Profile
          </button>
          <button style={styles.actionButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
