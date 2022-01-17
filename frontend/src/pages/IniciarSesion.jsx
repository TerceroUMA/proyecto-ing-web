import React from 'react';
import GoogleLogin from 'react-google-login';
import '../styles/pages/auth.css';

import { useForm } from '../hooks/useForm';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { iniciarSesion, login } from '../actions/auth';
import { fetchUrlencoded } from '../helpers/fetch';

const IniciarSesion = () => {

  const history = useHistory();
  const dispatch = useDispatch();

  const [formLoginValues, handleInputChange] = useForm({
    correo: '',
    password: ''
  });

  const { correo, password } = formLoginValues;

  const sendToHome = () => {

    history.push( '/' );

  };

  const handleOnSubmit = async ( e ) => {

    e.preventDefault();

    dispatch( iniciarSesion( correo, password, sendToHome ) );

  };

  const handleLogin = async ( googleData ) => {

    const res = await fetchUrlencoded( 'users/oauth2', { token: googleData.tokenId }, 'POST' );

    const data = await res.json();
    console.log( data );

    if ( !data.ok ) {

      history.push({
        pathname: '/registrarse',
        state: { email: data.email, nombre: data.name, apellido: data.apellido }
      });

    } else {

      dispatch( login( data.usuario ) );
      sendToHome();

    }

  };


  const isAuthenticated = localStorage.getItem( 'usuario' ) !== null;
  if ( isAuthenticated ) {

    history.push( '/' );

  }

  return (
    <div className="auth__container login">
      <h1 className="auth__title">
        Iniciar sesión
      </h1>
      <form
        className="auth__form"
        onSubmit={ handleOnSubmit }
      >

        <input
          className="sigIn__option form-control"
          type="text"
          name="correo"
          value={ correo }
          onChange={ handleInputChange}
          placeholder="Correo electrónico"
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
      <div>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Log in with Google"
          onSuccess={handleLogin}
          onFailure={handleLogin}
          cookiePolicy={'single_host_origin'}
        />
      </div>

    </div>
  );

};

export default IniciarSesion;
