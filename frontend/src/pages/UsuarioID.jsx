import React, { useEffect, useState } from 'react';
import { useQuery } from '../hooks/useQuery';
import { fetchUrlencoded } from '../helpers/fetch';
import '../styles/home.css';
import { useForm } from '../hooks/useForm';

import '../styles/pages/usuarioId.css';
import { useSelector } from 'react-redux';

export default function UsuarioID() {

  const { uuid: usuarioConectado } = useSelector( state => state.auth );
  const query = useQuery();
  const uuid = query.get( 'uuid' );
  const valoracion = query.get( 'valoracion' );
  const [hayDatos, setHayDatos] = useState( false );
  const [usuario, setUsuario] = useState({});
  const [valoraciones, setValoraciones] = useState([]);

  const [formValues, handleChange] = useForm({
    comentario: ''
  });

  const { comentario } = formValues;

  useEffect( async () => {

    if ( uuid ) {

      const respuesta = await fetchUrlencoded( `users?uuid=${uuid}&valoracion=${valoracion}` );
      const body = await respuesta.json();
      setHayDatos( true );

      if ( body.ok ) {

        setUsuario( body.usuario );
        setValoraciones( body.valoraciones );

      }

    }

  }, [uuid]);

  if ( !hayDatos ) {

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1> Cargando... </h1>
      </div> );

  }


  if ( !usuario ) {

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }} >
        <h1> No existe este Usuario </h1>
      </div>
    );

  }

  const handleVolver = ( ) => {

    history.back();

  };

  const handleSubmit = ( e ) => {

    e.preventDefault();
    fetchUrlencoded( `users?uuid=${usuario.uuid}`, { nota: 3, comentario: comentario, emisor: usuarioConectado }, 'POST' );
    window.location.reload();

  };


  const estrellaVacia = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
  </svg>;

  const estrellaLlena = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
  </svg>;

  return (
    <>
      <div className="lista-participantes-page-container">
        <div className="card" style={{ width: 18 + 'rem', marginTop: '20px' }}>
          <img src={usuario.imagen} className="card-img-top" alt="..."/>
          <div className="card-body">
            <h5 className="card-title"> <strong> Usuario: </strong> {usuario.nombre} {usuario.apellidos} </h5>
            <p className="card-text"><strong>Edad:</strong> {usuario.edad}</p>
            <p className="card-text"><strong>Correo:</strong> {usuario.correo}</p>
            <p className="card-text"><strong>Teléfono</strong> {usuario.telefono}</p>
            <p className="card-text"><strong>Localidad:</strong> {usuario.localidad} </p>
            <button className="btn btn-success" onClick={() => handleVolver( ) }> Volver </button>
          </div>
        </div>

        <div className="derecha-container">
          <form className="form-comentario" onSubmit={handleSubmit}>
            <textarea
              placeholder="Escribe un comentario para este usuario..."
              value={comentario}
              onChange={handleChange}
              name="comentario"
            />

            <div style={{ width: '500px', display: 'flex', marginTop: '10px', justifyContent: 'space-between' }}>
              <select name="nota" className="form-control" style={{ width: '48%' }}>
                <option value="1">⭐</option>
                <option value="2">⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="5">⭐⭐⭐⭐⭐</option>
              </select>
              <button className="btn btn-primary" style={{ width: '50%' }}>Crear comentario</button>
            </div>
          </form>
        </div>
      </div>

      {
        valoraciones.map( v => (
          <div key={v.uuid} className="comentarios-container">
            <div className="comentario">
              <div className="contenido-container">
                <p> {v.nombre} : {v.comentario} </p>
              </div>
              <div className="nota-container">
                {

                  new Array( v.nota ).fill( estrellaLlena )
                }
                {
                  new Array( 5 - v.nota ).fill( estrellaVacia )
                }
              </div>
            </div>
          </div>
        ) )

      }

    </>
  );

}
