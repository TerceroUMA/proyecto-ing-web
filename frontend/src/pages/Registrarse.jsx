import React, { useState } from 'react';
import '../styles/pages/auth.css';

import { useForm } from '../hooks/useForm';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registrarse } from '../actions/auth';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';

const Registrarse = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [oauth, setOauth] = useState( location.state !== undefined );

  const [formValues, handleInputChange] = useForm({
    nombre: oauth ? location.state.nombre : '',
    apellidos: oauth ? location.state.apellido : '',
    correo: oauth ? location.state.email : '',
    password: '',
    confirmarPassword: '',
    edad: '',
    telefono: '',
    localidad: ''
  });

  const { nombre, apellidos, correo, password, confirmarPassword, telefono, edad, localidad } = formValues;
  console.log( formValues );

  const [file, setFile] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {

      setFile(
        acceptedFiles.map( file =>
          Object.assign( file, {
            preview: URL.createObjectURL( file )
          })
        ) );

    }
  });

  const sendToHome = () => {

    history.push( '/' );

  };

  const handleOnSubmit = async ( e ) => {

    e.preventDefault();

    if ( file.length === 0 ) {

      Swal.fire({ icon: 'error', title: 'Error', text: 'Debe seleccionar una imagen' });

    } else {

      dispatch( registrarse( nombre, correo, password, confirmarPassword, apellidos, telefono, edad, localidad, file[0], sendToHome ) );

    }

  };

  const handleAnchor = () => {

    history.push( '/iniciarSesion' );

  };

  const isAuthenticated = localStorage.getItem( 'usuario' ) !== null;
  if ( isAuthenticated ) {

    history.push( '/' );

  }

  return (
    <div className="auth__container">
      <div className="registro">
        <h1 className="auth__title">
        Registrarse
        </h1>
        <form
          className="auth__form"
          onSubmit={ handleOnSubmit }
        >
          <fieldset>
            <input
              className="sigIn__option form-control"
              type="text"
              name="nombre"
              value={ nombre }
              onChange={ handleInputChange}
              placeholder="Nombre de usuario"
              disabled={oauth}
            />
            <input
              className="sigIn__option form-control"
              type="text"
              name="apellidos"
              value={ apellidos }
              onChange={ handleInputChange}
              placeholder="Apellidos"
              disabled={oauth}
            />
            <input
              className="sigIn__option form-control"
              type="email"
              name="correo"
              value={ correo }
              onChange={ handleInputChange}
              placeholder="Correo electr??nico"
              disabled={oauth}
            />
            <input
              className="sigIn__option form-control"
              type="password"
              name="password"
              value={ password }
              onChange={ handleInputChange}
              placeholder="Contrase??a"
              autoComplete="off"
            />
            <input
              className="sigIn__option form-control"
              type="password"
              name="confirmarPassword"
              value={ confirmarPassword }
              onChange={ handleInputChange}
              placeholder="Confirmar contrase??a"
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
          </fieldset>


          <p style={{ wordWrap: 'break-word' }}>??Ya tienes una cuenta? <a href="#"
            onClick={ handleAnchor }>Inicia sesi??n</a> </p>
          <button className="btn btn-primary">
            Registrarse
          </button>
        </form>
      </div>
      <div className="foto-container">
        <h1 className="auth__title">Foto de perfil</h1>
        <div className="drag-and-drop" {...getRootProps()}>
          <input {...getInputProps()} />
          {
            file.length > 0 ? <img style={{ maxWidth: '100%' }} src={file[0].preview} /> : <p>Arrastra una imagen o pinche aqu??</p>
          }
        </div>
      </div>


    </div>
  );

};

export default Registrarse;
