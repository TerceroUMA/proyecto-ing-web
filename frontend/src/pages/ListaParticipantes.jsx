import React, { useEffect, useState } from 'react';

import { fetchUrlencoded } from '../helpers/fetch';

import { useHistory } from 'react-router';

import '../styles/pages/usuarios.css';
import { Link } from 'react-router-dom';

import '../styles/pages/lista-participantes.css';
import { useForm } from '../hooks/useForm';


export default function ListaParticipantes() {

  const history = useHistory();
  const [hayDatos, setHayDatos] = useState( false );
  const [trayecto, setTrayecto] = useState({});
  const [noExiste, setNoExiste] = useState( false );
  const url = history.location.pathname;
  const idTrayecto = url.split( '/' )[2];
  const [pasajeros, setPasajeros] = useState([{}]);
  const [cambio, setCambio] = useState( false );
  const [estrellas, setEstrellas] = useState([]);

  const [formValues, handleChange] = useForm({
    comentario: ''
  });

  const { comentario } = formValues;

  useEffect( async () => {

    if ( idTrayecto ) {

      const respuesta = await fetchUrlencoded( `trayectos?uuid=${idTrayecto}` );
      const body = await respuesta.json();
      setHayDatos( true );


      if ( body.ok ) {

        const r = await fetchUrlencoded( `users?uuid=${body.trayecto.idConductor}` );
        const a = await r.json();

        const ax = body.trayecto;
        ax.conductorObject = a.usuario;
        setTrayecto( ax );

        const arr = [];
        for ( let p = 0; p < body.trayecto.pasajeros.length; p++ ) {

          const respuesta = await fetchUrlencoded( `users?uuid=${body.trayecto.pasajeros[p]}` );
          const aux = await respuesta.json();

          arr.push({
            id: body.trayecto.pasajeros[p],
            nombre: aux.usuario.nombre + ' ' + aux.usuario.apellidos,
            imagen: aux.usuario.imagen
          });

        };

        setPasajeros( arr );
        setCambio( true );


      } else {

        setNoExiste( true );

      }

    }


  }, [idTrayecto]);

  if ( !hayDatos || !cambio ) {

    return (
      <div className="trayectos-container" >
        <h1> Cargando... </h1>
      </div> );

  }

  if ( noExiste ) {

    return (
      <div className="trayectos-container" >
        <h1> No existe este trayecto </h1>
      </div>
    );

  }

  const handleVolver = ( idTrayecto ) => {

    history.push( `/trayectos/${idTrayecto}` );

  };

  const estrellaVacia = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
  </svg>;

  const estrellaLlena = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
  </svg>;


  return (
    <div className="lista-participantes-page-container">
      <div className="lista-participantes-container">
        <h1 style={{ width: 100 + '%' }}> Lista de Participantes </h1>
        <br></br>
        <h3> Conductor: </h3>
        <div className="usuario-container">
          <div className="usuario-foto">
            <img src={trayecto.conductorObject.imagen}/>
          </div>

          <div className="usuario-info">
            <Link replace to={{ pathname: '/users', search: `?uuid=${trayecto.idConductor}` }}> {trayecto.conductor} </Link>
          </div>

        </div>
        <br></br>

        <h3> Participantes: </h3>
        {
          pasajeros.map( k => (

            <div key={k} className="usuario-container">
              <div className="usuario-foto">
                <img src={k.imagen}/>
              </div>
              <div className="usuario-info">
                <Link replace to={{ pathname: '/users', search: `?uuid=${k.id}` }}> {k.nombre} </Link>
                <br></br>
              </div>

            </div>


          ) )
        }
        <button className="btn btn-success" onClick={() => handleVolver( idTrayecto ) }> Volver </button>
      </div>

      <div className="derecha-container">
        <form className="form-comentario">
          <textarea
            placeholder="Escribe un comentario..."
            value={comentario}
            onChange={handleChange}
            name="comentario"
          />
          <button className="btn btn-primary">Nuevo comentario</button>
        </form>

        <div className="comentarios-container">
          <div className="comentario">
            <div className="contenido-container">
            Javier: Holas
            </div>
            <div className="nota-container">
              {
                estrellas.map( e => estrellaLlena )
              }
              {
                new Array( 5 - estrellas.length ).fill( estrellaVacia )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
