import Maps from "../../Maps/Maps.jsx";
import Navbar from "./Navbar.jsx";

const UserPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "250px" }}>
        <Navbar />
      </div>
      <div style={{ flexGrow: 1 }}>
        <Maps />
      </div>
    </div>
  );
};

export default UserPage;
