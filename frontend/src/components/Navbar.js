import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { cerrarSesion } from '../actions/auth';

export default function Navbar() {

  const { uuid } = useSelector( state => state.auth );
  const dispatch = useDispatch();

  const logout = () => {

    dispatch( cerrarSesion() );

  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/"
          className="navbar-brand"
        >
            Bla bla car
        </Link>
        <button className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
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

            {
              !uuid
                ? ( <>
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
                </> )
                : ( <li className="nav-item">
                  <Link to="/registrarse"
                    className="nav-link"
                    onClick={ logout }
                  >
                      Cerrar sesión
                  </Link>
                </li> )

            }
          </ul>
        </div>
      </div>
    </nav>
  );

}
