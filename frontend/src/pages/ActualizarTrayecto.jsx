import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from '../hooks/useForm';
import { useLocation, useHistory } from 'react-router-dom';
import { actualizarTrayecto } from '../actions/trayectos';


const ActualizarTrayecto = () => {

  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const datosTrayecto = location.state;

  const [formValues, handleInputChange] = useForm({
    origen: datosTrayecto.origen,
    destino: datosTrayecto.destino,
    tipoDeVehiculo: datosTrayecto.tipoDeVehiculo,
    duracion: datosTrayecto.duracion,
    precio: datosTrayecto.precio,
    plazasDisponibles: datosTrayecto.plazasDisponibles,
    fechaDeSalida: datosTrayecto.fechaDeSalida,
    horaDeSalida: datosTrayecto.horaDeSalida,
    periodicidad: datosTrayecto.periodicidad
  });

  const { origen, destino, tipoDeVehiculo, duracion, precio, plazasDisponibles, fechaDeSalida, horaDeSalida, periodicidad } = formValues;
  const imagen = datosTrayecto.imagen;
  const conductor = datosTrayecto.conductor;
  const uuidTrayecto = datosTrayecto.uuidTrayecto;

  const sendToTrayectosCreados = () => {

    history.push( '/trayectosCreados' );

  };

  const handleOnSubmit = async ( e ) => {

    e.preventDefault( e );

    dispatch( actualizarTrayecto( uuidTrayecto, origen, destino, tipoDeVehiculo, conductor, duracion, precio, plazasDisponibles, fechaDeSalida, horaDeSalida, periodicidad, sendToTrayectosCreados ) );

  };

  return (
    <div className="auth__container">
      <form
        className="auth__form"
        onSubmit={handleOnSubmit}
      >
        <h1 className="auth__title">
        Editar Trayecto
        </h1>
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
        <img style={{ maxWidth: '100%' }} src={imagen} />
      </div>
    </div>
  );

};

export default ActualizarTrayecto;
