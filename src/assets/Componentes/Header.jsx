import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1>NUTRIGENIE</h1>
      <nav>
        <Link to="/">Registro</Link>
        <Link to="/inicio">Inicio</Link>
      </nav>
    </header>
  );
};

export default Header;
