import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home } from '../components/Home';
import Navbar from '../components/Navbar';
import Gasolinera from '../pages/Gasolinera';
import Coches from '../pages/Coches';
import IniciarSesion from '../pages/IniciarSesion';
import Registrarse from '../pages/Registrarse';
import TrayectoID from '../pages/TrayectoID';
import TrayectosCreados from '../pages/TrayectosCreados';
import UsuarioID from '../pages/UsuarioID';
import { types } from '../types/types';
import ListaParticipantes from '../pages/ListaParticipantes';
import TrayectosInscritos from '../pages/TrayectoInscritos';
import CrearTrayecto from '../pages/CrearTrayecto';
import ActualizarTrayecto from '../pages/ActualizarTrayecto';
import CrearMensaje from '../pages/CrearMensaje';
import BandejaEntrada from '../pages/BandejaEntrada';
import BandejaSalida from '../pages/BandejaSalida';
import VerMensajes from '../pages/VerMensajes';
import Paypal from '../pages/Paypal';

export const AppRouter = () => {

  const dispatch = useDispatch();

  useEffect( () => {

    if ( localStorage.getItem( 'usuario' ) !== null ) {

      dispatch({
        type: types.login,
        payload: JSON.parse( localStorage.getItem( 'usuario' ) )
      });

    }

  }, []);

  return (
    <Router>
      <div>
        <Navbar />

        {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}

        {/* TODO: Cambiar a rutas privadas */}
        <Switch>
          <Route path="/paypal">
            <Paypal />
          </Route>
          <Route path="/mensajes/nuevo">
            <CrearMensaje />
          </Route>
          <Route path="/mensajes/:idConversacion">
            <VerMensajes />
          </Route>
          <Route path="/bandejaSalida/:idUsuario">
            <BandejaSalida />
          </Route>
          <Route path="/bandejaEntrada/:idUsuario">
            <BandejaEntrada />
          </Route>
          <Route path="/users">
            <UsuarioID />
          </Route>
          <Route path="/trayectos/:idTrayecto/participantes">
            <ListaParticipantes />
          </Route>
          <Route path="/trayectos/:idTrayecto">
            <TrayectoID />
          </Route>
          <Route path="/trayectosInscritos">
            <TrayectosInscritos />
          </Route>
          <Route path="/trayectosCreados">
            <TrayectosCreados />
          </Route>
          <Route path="/crearTrayecto">
            <CrearTrayecto />
          </Route>
          <Route path="/editarTrayecto">
            <ActualizarTrayecto />
          </Route>
          <Route path="/datosAbiertos/gasolineras">
            <Gasolinera />
          </Route>
          <Route path="/datosAbiertos/coches">
            <Coches />
          </Route>
          <Route path="/iniciarSesion">
            <IniciarSesion />
          </Route>
          <Route path="/registrarse">
            <Registrarse />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );

};
