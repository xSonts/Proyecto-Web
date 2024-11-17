import React from "react";
import "../Css/Footer.css"; // Archivo de estilos para el footer

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        © 2024 - Todos los derechos reservados. <span>Recetas Deliciosas</span>
      </p>
      <div className="social-icons">
        <a href="#" aria-label="Facebook">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="#" aria-label="Twitter">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
