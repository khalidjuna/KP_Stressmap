// import React from 'react';
import logo from "../../Assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";

const Logo = () => {
  return (
    <div className="logo-container">
      <img
        src={logo}
        alt="Logo"
        className="img-fluid"
        style={{
          width: "60px",
          height: "auto",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
    </div>
  );
};

export default Logo;
