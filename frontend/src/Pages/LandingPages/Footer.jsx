// import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  const styles = {
    container: {
      backgroundColor: "#3A6EBB",
      textAlign: "center",
      margin: "0",
      padding: "10px 0",
      boxSizing: "border-box",
      width: "100%",
    },
    text: {
      margin: "0",
      fontSize: "18px",
      color: "#ffffff",
    },
  };

  return (
    <footer className="footer" style={styles.container}>
      <div className="container-fluid">
        <div className="row">
          <div className="col text-center">
            <p style={styles.text}>© 2024</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
