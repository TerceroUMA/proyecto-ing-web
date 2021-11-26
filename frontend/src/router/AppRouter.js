import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home } from '../components/Home';
import Navbar from '../components/Navbar';
import Gasolinera from '../pages/Gasolinera';
import IniciarSesion from '../pages/IniciarSesion';
import Registrarse from '../pages/Registrarse';

export const AppRouter = () => {

  /* const auth = useSelector( state => state.auth ); */

  return (
    <Router>
      <div>
        <Navbar />

        {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}

        {/* TODO: Cambiar a rutas privadas */}
        <Switch>
          <Route path="/datosAbiertos/gasolineras">
            <Gasolinera />
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
