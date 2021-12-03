<<<<<<< HEAD
import React, { useRef, useState } from 'react';
import { useForm } from '../hooks/useForm';

import PropTypes from 'prop-types';

export default function CochesFilter({ previous, next, refrescarDatos }) {

  const [formValues, handleInputChange] = useForm({
    anyo: '',
    marca: '',
    tipo: ''
  });

  const { anyo, marca, tipo } = formValues;
  const [show, setShow] = useState( false );
  const botonFiltrar = useRef();

  const handleShow = () => {

    setShow( s => !s );

  };

  const handleSearch = ( e ) => {

    e.preventDefault();
    botonFiltrar.current.click();
    refrescarDatos( anyo, marca, tipo );

  };

  return (
    <>
      <div className="paginas-container">
        <button className="btn btn-success" onClick={previous} > Página anterior </button>
        <button className="btn btn-success" onClick={next} > Página siguiente </button>
      </div>
      <button
        className="btn btn-primary btn-filter"
        onClick={handleShow}
        ref={botonFiltrar}
      >
        Filtrar
      </button>
      <div className={'trayectos-filter ' + ( show ? '' : 'not-show' )}>
        <form>
          <label htmlFor="origen">Año:</label>
          <input
            className="form-control"
            type="text"
            name="anyo"
            onChange={handleInputChange}
            value={anyo}
          />

          <label htmlFor="origen">Marca:</label>
          <input
            className="form-control"
            type="text"
            name="marca"
            onChange={handleInputChange}
            value={marca}
          />

          <label htmlFor="origen">Tipo:</label>
          <input
            className="form-control"
            type="text"
            name="tipo"
            onChange={handleInputChange}
            value={tipo}
          />

          <button
            className="btn btn-primary form-control"
            onClick={handleSearch}
          >
            Buscar
          </button>

        </form>
      </div>
    </>
  );

};
CochesFilter.propTypes = {

  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  refrescarDatos: PropTypes.func.isRequired

};
=======
import React, { useRef, useState } from 'react';
import { useForm } from '../hooks/useForm';

import PropTypes from 'prop-types';

export default function CochesFilter({ previous, next, refrescarDatos }) {

  const [formValues, handleInputChange] = useForm({
    anyo: '',
    marca: '',
    tipo: ''
  });

  const { anyo, marca, tipo } = formValues;
  const [show, setShow] = useState( false );
  const botonFiltrar = useRef();

  const handleShow = () => {

    setShow( s => !s );

  };

  const handleSearch = ( e ) => {

    e.preventDefault();
    botonFiltrar.current.click();
    refrescarDatos( anyo, marca, tipo );

  };

  return (
    <>
      <div className="paginas-container">
        <button className="btn btn-success" onClick={previous} > Página anterior </button>
        <button className="btn btn-success" onClick={next} > Página siguiente </button>
      </div>
      <button
        className="btn btn-primary btn-filter"
        onClick={handleShow}
        ref={botonFiltrar}
      >
        Filtrar
      </button>
      <div className={'trayectos-filter ' + ( show ? '' : 'not-show' )}>
        <form>
          <label htmlFor="origen">Año:</label>
          <input
            className="form-control"
            type="text"
            name="anyo"
            onChange={handleInputChange}
            value={anyo}
          />

          <label htmlFor="origen">Marca:</label>
          <input
            className="form-control"
            type="text"
            name="marca"
            onChange={handleInputChange}
            value={marca}
          />

          <label htmlFor="origen">Tipo:</label>
          <input
            className="form-control"
            type="text"
            name="tipo"
            onChange={handleInputChange}
            value={tipo}
          />

          <button
            className="btn btn-primary form-control"
            onClick={handleSearch}
          >
            Buscar
          </button>

        </form>
      </div>
    </>
  );

};
CochesFilter.propTypes = {

  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  refrescarDatos: PropTypes.func.isRequired

};
>>>>>>> Alex
