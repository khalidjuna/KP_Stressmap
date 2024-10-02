// import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // Import axios for API requests
import Layout from "./Layout";
import { useUser } from "../../Context/UserContext.jsx";

const styles = {
  profileContainer: {
    maxWidth: '800px',
    margin: '20px auto', 
    height: '630px',
    padding: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    borderRadius: '8px',
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: '370px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
},
  h2: {
    color: '#333',
    marginBottom: '20px',
    fontFamily: "Playfair Display, serif",
    fontSize: '25px', 
    fontWeight: 'bold',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  profilePictureContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '20px', 
    borderradius: '10px', 
    width: '300px', 
    height: '400px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    marginLeft: '50px',
  },
  profilePicture: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  uploadButton: {
    marginTop: '100px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: "Poppins, serif",
  },
  uploadButtonHover: {
    backgroundColor: '#0056b3',
  },
  profileInfoContainer: {
    flex: '2',
    padding: '20px',
    borderRadius: '8px',
    marginLeft: '50px',
    fontFamily: "Poppins, serif",
  },
  profileInfo: {
    color: '#333',
    marginBottom: '20px',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    
  },
  profileInfoLabel: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
    marginRight: '10px',
  },
  profileButtonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    marginLeft: '390px',
  },
  profileButton: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'center',
    fontFamily: "Poppins, serif",
  },
  profileButtonHover: {
    backgroundColor: '#0056b3',
  },
};

const ProfileComponent = () => {
  const navigate = useNavigate();
  // const [profile, setProfile] = useState(null); // State to store profile data
  // const [error, setError] = useState(null); // State to store any error
  const {user} = useUser();

  // useEffect(() => {
  //   // Function to fetch user data
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:5002/api/v1/users/profile", {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in local storage
  //         },
  //       });

  //       setProfile(response.data); 
  //     } catch (err) {
  //       setError("Failed to fetch user data.");
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  const handleEditProfile = () => {
    navigate("/stressmap/maps-user/edit-profile");
  };

  const handleLogout = () => {
    // Clear the token and redirect to login
    localStorage.removeItem("token");
    navigate("/stressmap/login");
  };

  // if (error) {
  //   return <div>{error}</div>;
  // }

  // if (!profile) {
  //   return <div>Loading...</div>; // Loading state
  // }

  return (
    <div style={styles.profileContainer}>
      <h2 style={styles.h2}>Account</h2>
      <div style={styles.profileHeader}>
        <div style={styles.profilePictureContainer}>
          {/* <img
            src={profile.profilePicture || "default-profile.jpg"} // Dynamically display profile picture
            alt="User Profile"
            style={styles.profilePicture}
          /> */}
          <input type="file" id="upload" style={{ display: "none" }} />
          <label htmlFor="upload" style={styles.uploadButton}>
            Upload Profile
          </label>
        </div>
        <div style={styles.profileInfoContainer}>
          <div style={styles.profileInfo}>
            <div style={styles.profileInfoLabel}>Name:</div>
            <div>{user.name}</div>
          </div>
          <div style={styles.profileInfo}>
            <div style={styles.profileInfoLabel}>Email:</div>
            <div>{user.email}</div>
          </div>
          <div style={styles.profileInfo}>
            <div style={styles.profileInfoLabel}>Position:</div>
            <div>{user.position}</div>
          </div>
          <div style={styles.profileInfo}>
            <div style={styles.profileInfoLabel}>Institution:</div>
            <div>{user.institution}</div>
          </div>
          <div style={styles.profileInfo}>
            <div style={styles.profileInfoLabel}>City:</div>
            <div>{user.city}</div>
          </div>
          <div style={styles.profileInfo}>
            <div style={styles.profileInfoLabel}>Country:</div>
            <div>{user.country}</div>
          </div>
        </div>
      </div>
      <div style={styles.profileButtonContainer}>
        <button style={styles.profileButton} onClick={handleEditProfile}>
          Edit Profile
        </button>
        <button style={styles.profileButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
      <Layout />
    </div>
  );
};

export default ProfileComponent;
