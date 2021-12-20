import marcador from '../static/map_marker_icon.svg';
import L from 'leaflet';

export const IconLocation = L.icon({
  iconUrl: marcador,
  iconRetinaUrl: marcador,
  iconAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: [35, 35],
  className: 'leaflet-venue-icon'
});
