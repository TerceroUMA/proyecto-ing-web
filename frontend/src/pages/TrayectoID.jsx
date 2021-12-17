import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUrlencoded } from '../helpers/fetch';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router';
import { useForm } from '../hooks/useForm';

import '../styles/pages/trayectoId.css';

export default function TrayectoID() {

  const { uuid } = useSelector( state => state.auth );
  const history = useHistory();
  const [hayDatos, setHayDatos] = useState( false );
  const [trayecto, setTrayecto] = useState({});
  const [noExiste, setNoExiste] = useState( false );
  const url = history.location.pathname;
  const idTrayecto = url.split( '/' )[2];
  const [pasajeros, setPasajeros] = useState([]);

  const [tweetValue, handleChange] = useForm({
    tweetText: ''
  });

  const tweetText = tweetValue.tweetText;

  useEffect( async () => {

    if ( idTrayecto ) {

      const respuesta = await fetchUrlencoded( `trayectos?uuid=${idTrayecto}` );
      const body = await respuesta.json();
      setHayDatos( true );


      if ( body.ok ) {

        setTrayecto( body.trayecto );
        setPasajeros( body.trayecto.pasajeros );

      } else {

        setNoExiste( true );

      }

    }


  }, [idTrayecto]);

  if ( !hayDatos ) {

    return (
      <div className="trayectos-container" >
        <h1> Cargando... </h1>
      </div> );

  }

  const handleInscribrise = async() => {

    const respuesta = await fetchUrlencoded( 'trayectos/inscribir', { uuid: idTrayecto, idUsuario: uuid }, 'POST' );
    const body = await respuesta.json();

    if ( !body.ok ) {

      Swal.fire( 'Error', body.msg, 'error' );

    }

    history.push( '/trayectosInscritos' );

  };

  const handleDesinscribrise = async() => {

    const respuesta = await fetchUrlencoded( 'trayectos/desinscribir', { uuid: idTrayecto, idUsuario: uuid }, 'POST' );
    const body = await respuesta.json();

    if ( !body.ok ) {

      Swal.fire( 'Error', body.msg, 'error' );

    }

    history.push( '/trayectosInscritos' );

  };

  const handleListarUsuariosTrayectos = ( idTrayecto ) => {

    history.push( `/trayectos/${idTrayecto}/participantes` );

  };

  if ( noExiste ) {

    return (
      <div className="trayectos-container" >
        <h1> No existe este trayecto </h1>
      </div>
    );

  }

  const baseUrlTweet = 'www.youtube.com';

  return (
    <div className="trayecto-id-container">
      <div className="trayectos-container">
        <div className="trayecto">
          <img src={'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages1.autocasion.com%2Funsafe%2F900x600%2Factualidad%2Fwp-content%2Fuploads%2F2013%2F12%2F_main_image_146785_52b30d8a6f62f.jpg&f=1&nofb=1'} />
          <div className="trayecto-info">
            <h2>{trayecto.origen} - {trayecto.destino}</h2>

            <div className="trayecto-info-datos">

              <p><strong>Precio:</strong> {trayecto.precio}€</p>
              <p><strong>Duración:</strong> {trayecto.duracion} minutos</p>
              <p><strong>Plazas disponibles:</strong> {trayecto.plazasDisponibles}</p>
              <p><strong>Fecha de salida:</strong> {moment( trayecto.fechaDeSalida ).format( 'DD/MM/YYYY' )}</p>
              <p><strong>Hora de salida:</strong> {trayecto.horaDeSalida}</p>
              <p><strong>Tipo de vehículo:</strong> {trayecto.tipoDeVehiculo}</p>
              <p><strong>Periodicidad:</strong> {trayecto.periodicidad} días</p>

              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                {
                  pasajeros.filter( p => p === uuid ).length === 0
                    ? (
                      trayecto.plazasDisponibles !== '0'
                        ? (
                          <button
                            className="btn btn-success"
                            onClick={handleInscribrise}
                          >
                      Inscribirse
                          </button>
                        )
                        : (
                          <button
                            className="btn btn-success"
                            disabled
                          >
                      No hay plazas Disponibles
                          </button>
                        )

                    )
                    : (
                      <button
                        className="btn btn-danger"
                        onClick={handleDesinscribrise}
                      >
                    Desinscribirse
                      </button>
                    )
                }
                <button className="btn btn-warning" onClick={() => handleListarUsuariosTrayectos( idTrayecto ) } > Pasajeros </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TODO: Añadir a la url el path base de nuestra página una vez subida */}
      {/* url base: https://twitter.com/intent/tweet */}
      {/* Si no lo pone no aparece el texto: ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Eshare%7Ctwgr%5E */}
      {/* Es el texto que aparecerá: text=Guides%20%7C%20Docs%20%7C%20Twitter%20Developer%20Platform */}
      {/* Enlace que aparecerá en el tweet: url= */}


      <div className="twitter-container">
        <div>
          <h3>Escribe un tweet</h3>
          <textarea
            className=""
            name="tweetText"
            value={tweetText}
            onChange={handleChange}
            placeholder="Escribe un tweet"
            maxLength={317 - baseUrlTweet.length - window.location.pathname.length}
          />
          <div className="datos-container">
            <p className="disabled">{317 - tweetText.length - baseUrlTweet.length - window.location.pathname.length}</p>
            <a
              href={`https://twitter.com/intent/tweet?ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Eshare%7Ctwgr%5E&text=${tweetText}&url=${baseUrlTweet}${window.location.pathname}`}
              target={'_blank'} rel="canonical noreferrer"
            >
              <button className="btn btn-primary">
                Twittear
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

}
