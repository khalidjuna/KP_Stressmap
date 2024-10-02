// import React from 'react';
import { useNavigate } from "react-router-dom"; // Impor useNavigate

const headerStyles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#fff",
    color: "white",
    zIndex: 1000,
  },
  logo: {
    height: "40px",
    marginRight: "1rem",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold, 400",
    color: "black",
    fontFamily: "Poppins, serif",
    // fontWeight: '400',
  },
  nav: {
    listStyle: "none",
    display: "flex",
    gap: "1rem",
  },
  navItem: {
    color: "black",
    textDecoration: "none",
    fontFamily: "Poppins, serif",
    fontWeight: "500",
    marginLeft: "2rem",
  },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#2161BD",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    color: "white",
    transition: "background-color 0.3s",
  },
};

const Header = () => {
  const navigate = useNavigate(); // Inisialisasi navigate

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const headerOffset = 50; // Sesuaikan dengan tinggi header Anda
      const sectionOffset = section.offsetTop - headerOffset;
      window.scrollTo({
        top: sectionOffset,
        behavior: "smooth",
      });
    }
  };

  const handleLoginClick = () => {
    navigate("/stressmap/login"); // Mengarahkan navigasi ke rute '/login'
  };

  return (
    <header style={headerStyles.header}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src="/logo.png" alt="Logo" style={headerStyles.logo} />
        <div style={headerStyles.title}>Stress Map</div>
      </div>
      <nav>
        <ul style={headerStyles.nav}>
          <li>
            <a
              href="#home"
              style={headerStyles.navItem}
              onClick={() => scrollToSection("home")}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              style={headerStyles.navItem}
              onClick={() => scrollToSection("about")}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#why-java"
              style={headerStyles.navItem}
              onClick={() => scrollToSection("why-java")}
            >
              Java Island
            </a>
          </li>
          <li>
            <a
              href="#collaboration"
              style={headerStyles.navItem}
              onClick={() => scrollToSection("collaboration")}
            >
              Collaboration
            </a>
          </li>
          <li>
            <a
              href="#team"
              style={headerStyles.navItem}
              onClick={() => scrollToSection("team")}
            >
              Team
            </a>
          </li>
          <li>
            <a
              href="#contact"
              style={headerStyles.navItem}
              onClick={() => scrollToSection("contact")}
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
      <button style={headerStyles.button} onClick={handleLoginClick}>
        Login
      </button>
    </header>
  );
};

export default Header;
