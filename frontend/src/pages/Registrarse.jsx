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
    apellidos: '',
    correo: '',
    password: '',
    confirmarPassword: '',
    edad: '',
    telefono: '',
    localidad: ''
  });

  const { nombre, apellidos, correo, password, confirmarPassword, telefono, edad, localidad } = formValues;

  const sendToHome = () => {

    history.push( '/' );

  };

  const handleOnSubmit = async ( e ) => {

    e.preventDefault();

    dispatch( registrarse( nombre, correo, password, confirmarPassword, apellidos, telefono, edad, localidad, sendToHome ) );

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
          type="text"
          name="apellidos"
          value={ apellidos }
          onChange={ handleInputChange}
          placeholder="Apellidos"
        />
        <input
          className="sigIn__option form-control"
          type="email"
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
        <input
          className="sigIn__option form-control"
          type="password"
          name="confirmarPassword"
          value={ confirmarPassword }
          onChange={ handleInputChange}
          placeholder="Confirmar contraseña"
          autoComplete="off"
        />
        <input
          className="sigIn__option form-control"
          type="number"
          name="telefono"
          value={ telefono }
          onChange={ handleInputChange}
          placeholder="Telefono"
        />
        <input
          className="sigIn__option form-control"
          type="number"
          name="edad"
          value={ edad }
          onChange={ handleInputChange}
          placeholder="Edad"
        />

        <input
          className="sigIn__option form-control"
          type="text"
          name="localidad"
          value={ localidad }
          onChange={ handleInputChange}
          placeholder="Ciudad donde vive"
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
