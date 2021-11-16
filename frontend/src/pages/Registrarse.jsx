import React from 'react';
import '../styles/pages/auth.css';

import { useForm } from '../hooks/useForm';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { registrarse } from '../actions/auth';

const Registrarse = () => {

  const dispatch = useDispatch();

  const history = useHistory();

  const [formValues, handleInputChange] = useForm({
    nombre: '',
    email: '',
    password: '',
    confPassword: ''
  });

  const { nombre, email, password, confPassword } = formValues;

  const sendToHome = () => {

    history.push( '/' );

  };
  const handleOnSubmit = async ( e ) => {

    e.preventDefault();

    dispatch( registrarse( nombre, email, password, confPassword, sendToHome ) );

  };

  const handleAnchor = () => {

    history.push( '/iniciarSesion' );

  };

  return (
    <div className="auth__container">
      <h1 className="auth__title">
        Registrarse
      </h1>
      <form
        className="auth__form"
        onSubmit={ handleOnSubmit }
      >
        {/* Se podría añadir */}
        {/* <p style={{ alignSelf: 'flex-start', margin: 0 }}>Nombre de usuario: </p> */}
        <input
          className="sigIn__option form-control"
          type="text"
          name="nombre"
          value={ nombre }
          onChange={ handleInputChange}
          placeholder="Nombre de usuario"
        />
        <input
          className="sigIn__option form-control"
          type="email"
          name="email"
          value={ email }
          onChange={ handleInputChange}
          placeholder="Email"
        />
        <input
          className="sigIn__option form-control"
          type="password"
          name="password"
          value={ password }
          onChange={ handleInputChange}
          placeholder="Contraseña"
          autoComplete="off"
        />
        <input
          className="sigIn__option form-control"
          type="password"
          name="confPassword"
          value={ confPassword }
          onChange={ handleInputChange}
          placeholder="Confirmar contraseña"
          autoComplete="off"
        />
        <p style={{ wordWrap: 'break-word' }}>¿Ya tienes una cuenta? <a href="#"
          onClick={ handleAnchor }>Inicia sesión</a> </p>
        <button className="btn btn-primary">
            Registrarse
        </button>
      </form>

    </div>
  );

};

export default Registrarse;
