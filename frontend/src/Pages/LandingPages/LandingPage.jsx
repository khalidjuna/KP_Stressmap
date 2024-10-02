// import React from 'react';
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const navigate = useNavigate();

  const handleOpenMap = () => {
    navigate("/stressmap/maps-view");
  };

  return (
    <main style={{ fontFamily: "Poppins, sans-serif" }}>
      <style>
        {`
                .hero {
                    background: linear-gradient(to bottom, #86A9DD, #0A2650);
                    background-size: cover;
                    background-position: center;
                    color: white;
                    text-align: center;
                    padding: 4rem 2rem;
                    position: relative;
                }

                .hero h1 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                    font-family: "Poppins", sans-serif;
                    font-weight: 800;
                    font-style: normal;
                    color: #fff;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }

                .hero h2 {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    font-family: "Poppins", sans-serif;
                    font-weight: 800;
                    font-style: normal;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }

                .hero p {
                    margin: 2rem 0; 
                    font-size: 1rem;
                    margin-top: 2rem; 
                    text-align: left; 
                    font-family: "Poppins", sans-serif;
                    font-weight: 400;
                    font-style: normal;
                    color: "#949494";
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }
                
                .hero .open-map {
                    margin: 1rem 0;
                    padding: 0.75rem 1.5rem;
                    background-color: #547AB2;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 1rem;
                    color: #FFFFFF; 
                    transition: background-color 0.3s;
                    float: left; 
                    margin-top: -1rem;
                    box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
                    font-family: "Poppins", serif;
                    font-weight: 700;
                }

                .open-map:hover {
                    background-color: #547AB2;
                    box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
                }

                section {
                    padding: 2rem 1rem;
                    text-align: center;
                    position: relative;
                }

                section h2 {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }

                section.about h2 {
                    color: #603809; 
                    font-family: "Poppins", sans-serif;
                    font-weight: 700;
                }

                section.why-java h2 {
                    color: #603809; 
                    font-family: "Poppins", sans-serif;
                    font-weight: 700;
                }

                section.collaboration h2 {
                    color: #603809; 
                    font-family: "Poppins", sans-serif;
                    font-weight: 700;
                }

                section.team h2 {
                    color: #fff; 
                    font-family: "Poppins", sans-serif;
                    font-weight: 700;
                }

                section.contact h2 {
                    color: #603809; 
                    font-family: "Poppins", sans-serif;
                    font-weight: 700;
                }
                

                section p {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .collaboration .logos {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    margin-top: 1rem;
                }

                .collaboration .logos img {
                    height: 100px;
                    width: auto;
                }

                .team {
                    display: flex;
                    align-items: center; 
                    background: #3A6EBB;
                }
                
                .team-content {
                    flex: 1; 
                    margin-right: 20px; 
                }
                
                .team-image {
                    max-width: 40%; 
                    height: auto; 
                }

                .contact p {
                    margin: 0.5rem 0;
                    font-size: 1rem;
                }

                .contact a {
                    color: #fcbf49;
                    text-decoration: none;
                }

                .contact a:hover {
                    text-decoration: underline;
                }

                .decorative-image-left, .decorative-image-right {
                    position: absolute;
                    width: 280px;
                    height: auto;
                }

                .decorative-image-left {
                    top: -95px;
                    left: 0;
                }

                .decorative-image-right {
                    top: -40px;
                    right: 0;
                }

                .hero-content {
                    padding-top: 3rem; 
                }
                .hero .intro-text {
                    color: #fff; 
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
                }
                `}
      </style>
      <section className="hero">
        <Header />
        <div id="home" className="hero-content" style={{ paddingTop: "100px" }}>
          <h1>Java Stress Map</h1>
          <h2>A Groundbreaking Initiative in Geophysical Research</h2>
          <p className="intro-text">
            Discover the most comprehensive and high-resolution stress maps of
            Java Island. Our maps provide invaluable insights into geological
            stress patterns. We offer the best data and analyses for our users.
          </p>
          <button className="open-map" onClick={handleOpenMap}>
            Open Map
          </button>
        </div>
      </section>
      <section id="about" className="about" style={{ paddingTop: "100px" }}>
        <h2 style={{ textAlign: "left", marginLeft: "0" }}>About Us</h2>
        <p style={{ textAlign: "left", marginLeft: "0" }}>
          Welcome to our website. Our mission is to provide comprehensive stress
          map ratios and the orientation of maximum horizontal stress for the
          Indonesia region. These insights are crucial for understanding
          geological stress patterns, which can aid in various applications such
          as earthquake risk assessment, resource exploration, and
          infrastructure development.
        </p>
      </section>
      <section
        id="why-java"
        className="why-java"
        style={{ paddingTop: "100px" }}
      >
        <img
          src="style2.png"
          alt="Decorative Left"
          className="decorative-image-left"
        />
        <h2>Why Java Island?</h2>
        <p>
          The tectonic setting of Java Island is complex due to a combination of
          plate rotation and ocean-basement relief. This setting induces complex
          deformation. Tectonic deformation in the upper plate of Java
          redistributes stress along geological faults, increasing strain energy
          accumulation and potentially leading to earthquakes. Therefore, Java
          Island is highly prone to earthquakes and poses significant seismic
          hazards due to its densely populated areas.
        </p>
      </section>

      <section
        id="collaboration"
        className="collaboration"
        style={{ paddingTop: "100px" }}
      >
        <h2>Collaboration</h2>
        <p>
          This collaboration is proudly funded and pioneered by Indonesian
          Collaborative Research 2024, reflecting our commitment to advancing
          scientific research and technological innovation in Indonesia. Our
          team comprises leading experts in geophysics and engineering,
          dedicated to delivering high-quality data and analyses to support both
          academic research and practical applications. Collaborative research
          effort between three esteemed institutions: Institut Teknologi Sepuluh
          Nopember (ITS), Universitas Gadjah Mada (UGM), and Universitas
          Indonesia (UI).
        </p>
        <div className="logos">
          <img src="ITS.png" alt="ITS Logo" />
          <img src="UGM.png" alt="UGM Logo" />
          <img src="UI.png" alt="UI Logo" />
        </div>
        <img
          src="style.png"
          alt="Decorative Right"
          className="decorative-image-right"
        />
      </section>

      <section id="team" className="team" style={{ paddingTop: "100px" }}>
        <div className="team-content" style={{ marginTop: "-20px" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Our Team</h2>
          <p style={{ color: "#fff" }}>
            We are a dedicated group of experts aiming to make significant
            contributions in geophysical sciences in Indonesia. Our research
            aims to provide valuable insights and foster further research and
            development in this field.
          </p>
        </div>
      </section>
      <section
        id="contact"
        className="contact"
        style={{
          paddingTop: "100px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginLeft: "100px",
        }}
      >
        <div style={{ textAlign: "left", flex: "1", padding: "1rem" }}>
          <h3 style={{ color: "#000000" }}>Address</h3>
          <p
            style={{
              fontFamily: "Poppins, serif",
              fontWeight: "400",
              fontSize: "1rem",
            }}
          >
            Departemen Teknik Geofisika; Fakultas Teknik Sipil, Perencanaan, dan
            Kebumian
            <br />
            Teknologi Sepuluh Nopember Sukolilo,
            <br />
            Surabaya, Jawa Timur 60117
          </p>
        </div>
        <div
          style={{
            textAlign: "left",
            flex: "1",
            padding: "1rem",
            paddingLeft: "3rem",
            marginLeft: "300px",
          }}
        >
          <h3>Phone</h3>
          <p
            style={{
              fontFamily: "Poppins, serif",
              fontWeight: "400",
              fontSize: "1rem",
            }}
          >
            (031) 5953476
          </p>
          <h3>Email</h3>
          <p
            style={{
              fontFamily: "Poppins, serif",
              fontWeight: "400",
              fontSize: "1rem",
              textAlign: "left",
            }}
          >
            <a href="mailto:tgeofisika@its.ac.id ">tgeofisika@its.ac.id</a>
          </p>
          <h3>Visit Us</h3>
          <p
            style={{
              fontFamily: "Poppins, serif",
              fontWeight: "400",
              fontSize: "1rem",
              textAlign: "left",
            }}
          >
            <a
              href="https://www.instagram.com/teknik_geofisika_its/"
              style={{ marginRight: "10px", color: "black" }}
            >
              <i className="bi bi-instagram"></i> Instagram
            </a>
            <br />
            <a
              href="https://www.facebook.com/TeknikGeofisikaITS"
              style={{ marginRight: "10px", color: "black", textAlign: "left" }}
            >
              <i className="bi bi-facebook"></i> Facebook
            </a>
            <br />
            <a
              href="https://www.youtube.com/channel/UC78HW-Wv_VUnVM6x1lhHw6Q"
              style={{ marginRight: "10px", color: "black", textAlign: "left" }}
            >
              <i className="bi bi-youtube"></i> YouTube
            </a>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Home;
