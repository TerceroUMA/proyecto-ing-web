import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/"
          className="navbar-brand"
        >
            Learn alone
        </Link>
        <button className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded=False
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse"
          id="navbarNavDropdown">
          <ul className="navbar-nav">

            <li className="nav-item">
              <Link to="/"
                className="nav-link"
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/iniciarSesion"
                className="nav-link"
              >
                Iniciar sesión
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/registrarse"
                className="nav-link"
              >
                Registrarse
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );

}
