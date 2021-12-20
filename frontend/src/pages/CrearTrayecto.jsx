import React, { useState } from 'react';
import { useForm } from '../hooks/useForm';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useDropzone } from 'react-dropzone';
import { crearTrayecto } from '../actions/trayectos';
import Swal from 'sweetalert2';

const CrearTrayecto = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const { uuid } = useSelector( state => state.auth );

  const [formValues, handleInputChange] = useForm({
    origen: '',
    destino: '',
    tipoDeVehiculo: '',
    duracion: '',
    precio: '',
    plazasDisponibles: '',
    fechaDeSalida: '',
    horaDeSalida: '',
    periodicidad: ''
  });

  const { origen, destino, tipoDeVehiculo, duracion, precio, plazasDisponibles, fechaDeSalida, horaDeSalida, periodicidad } = formValues;

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

  const SendToTrayectosCreados = () => {

    history.push( '/trayectosCreados' );

  };

  const handleOnSubmit = async ( e ) => {

    e.preventDefault( e );

    if ( file.length === 0 ) {

      Swal.fire({ icon: 'error', title: 'Error', text: 'Debe seleccionar una imagen' });

    } else {

      dispatch( crearTrayecto( origen, destino, tipoDeVehiculo, uuid, duracion, precio, plazasDisponibles, fechaDeSalida, horaDeSalida, periodicidad, file[0], SendToTrayectosCreados ) );

    }

  };

  return (
    <div className="auth__container">
      <h1 className="auth__title">
        Crear Nuevo Trayecto
      </h1>
      <form
        className="auth__form"
        onSubmit={handleOnSubmit}
      >
        {/* Se podría añadir */}
        {/* <p style={{ alignSelf: 'flex-start', margin: 0 }}>Nombre de usuario: </p> */}
        <input
          className="sigIn__option form-control"
          type="text"
          name="origen"
          value={origen}
          onChange={handleInputChange}
          placeholder="Origen del trayecto"
        />
        <input
          className="sigIn__option form-control"
          type="text"
          name="destino"
          value={destino}
          onChange={handleInputChange}
          placeholder="Destino del trayecto"
        />
        <input
          className="sigIn__option form-control"
          type="text"
          name="tipoDeVehiculo"
          value={tipoDeVehiculo}
          onChange={handleInputChange}
          placeholder="Marca y modelo del vehículo"
        />
        <input
          className="sigIn__option form-control"
          type="number"
          name="duracion"
          value={duracion}
          onChange={handleInputChange}
          placeholder="Duración aprox. en min"
        />
        <input
          className="sigIn__option form-control"
          type="number"
          name="precio"
          value={precio}
          onChange={handleInputChange}
          placeholder="Precio del trayecto por persona"
          autoComplete="off"
        />
        <input
          className="sigIn__option form-control"
          type="number"
          name="plazasDisponibles"
          value={plazasDisponibles}
          onChange={handleInputChange}
          placeholder="Plazas disponibles para el trayecto"
        />
        <input
          className="sigIn__option form-control"
          type="date"
          name="fechaDeSalida"
          value={fechaDeSalida}
          onChange={handleInputChange}
          placeholder="Fecha de salida"
        />

        <input
          className="sigIn__option form-control"
          type="time"
          name="horaDeSalida"
          value={horaDeSalida}
          onChange={handleInputChange}
          placeholder="Hora de salida"
        />

        <input
          className="sigIn__option form-control"
          type="number"
          name="periodicidad"
          value={periodicidad}
          onChange={handleInputChange}
          placeholder="Periodicidad de este trayecto en días"
        />

        <button className="btn btn-primary">
          Guardar trayecto
        </button>
      </form>

      <div className="foto-container">
        <h1 className="auth__title">Foto del vehiculo</h1>
        <div className="drag-and-drop" {...getRootProps()}>
          <input {...getInputProps()} />
          {
            file.length > 0 ? <img style={{ maxWidth: '100%' }} src={file[0].preview} /> : <p>Arrastra una imagen o pinche aquí</p>
          }
        </div>
      </div>
    </div>
  );

};

export default CrearTrayecto;
