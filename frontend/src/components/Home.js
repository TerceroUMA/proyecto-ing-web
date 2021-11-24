import React from 'react';
import '../styles/home.css';
import TrayectosFilter from './TrayectosFilter';

export const Home = () => {

  return (
    <div className="home-container">
      <h1>Home Screen</h1>

      <TrayectosFilter />

      <div className="trayectos-container">
        <div className="trayecto">
          <img src={'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages1.autocasion.com%2Funsafe%2F900x600%2Factualidad%2Fwp-content%2Fuploads%2F2013%2F12%2F_main_image_146785_52b30d8a6f62f.jpg&f=1&nofb=1'} />
          <div className="trayecto-info">
            <h2>Málaga - Cádiz</h2>
            <p>usuario</p>
            <p>precio</p>
          </div>
        </div>
      </div>
    </div>
  );

};
