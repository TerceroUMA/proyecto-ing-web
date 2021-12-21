import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

export default function MyRouting({ L1, L2, L3, L4 }) {

  console.log( L1, L2, L3, L4 );

  const map = useMap();

  useEffect( () => {

    if ( !map ) return;

    const routingControl = L.routing.control({
      waypoints: [L.latLng( L1, L2 ), L.latLng( L3, L4 )],
      routeWhileDragging: true,
      createMarker: ( i, waypoint, n ) => {

        return L.marker( waypoint.latLng, {
          draggable: true,
          bounceOnAdd: false,
          bounceOnAddOptions: {
            duration: 1000,
            height: 800,
            function() {

              ( bindPopup( myPopup ).openOn( map ) );

            }
          },
          icon: L.icon({
            iconUrl: 'https://res.cloudinary.com/dzjkhaazm/image/upload/v1639854133/map_marker_icon_nzqsoc.png',
            iconSize: [25, 25]
          })
        });

      }
    }).addTo( map );

    return () => map.removeControl( routingControl );

  }, [map]);

  return null;

}
