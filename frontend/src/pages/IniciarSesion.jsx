import React from 'react';
import '../styles/pages/auth.css';

import { useForm } from '../hooks/useForm';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { iniciarSesion } from '../actions/auth';

const IniciarSesion = () => {

  const history = useHistory();
  const dispatch = useDispatch();

  const [formLoginValues, handleInputChange] = useForm({
    nombre: '',
    password: ''
  });

  const { nombre, password } = formLoginValues;

  const sendToHome = () => {

    history.push( '/' );

  };

  const handleOnSubmit = async ( e ) => {

    e.preventDefault();

    dispatch( iniciarSesion( nombre, password, sendToHome ) );

    /* const respuesta = await fetchSinToken( 'auth', { nombre, password }, 'POST' );

    const data = await respuesta.json();

    if ( data.ok ) {

      Swal.fire({
        title: 'Bienvenido',
        text: data.msg,
        icon: 'success',
        willClose: () => {

          sendToHome();

        }
      });

    } else {

      if ( data.msg ) {

        Swal.fire( 'Error', data.msg, 'error' );

      } else {

        Swal.fire( 'Error', data.errorsArray[0], 'error' );

      }

    } */

  };

  return (
    <div className="auth__container">
      <h1 className="auth__title">
        Iniciar sesión
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
          type="password"
          name="password"
          value={ password }
          onChange={ handleInputChange}
          placeholder="Contraseña"
          autoComplete="off"
        />

        <button className="btn btn-primary">
            Iniciar sesión
        </button>
      </form>

    </div>
  );

};

export default IniciarSesion;