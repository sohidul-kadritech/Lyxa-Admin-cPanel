// eslint-disable-next-line import/no-unresolved
import { Wrapper } from '@googlemaps/react-wrapper';
import React, { useEffect, useRef, useState } from 'react';

const render = (status) => <h1>{status}</h1>;

function Directions({ pickupLatLng, dropLatLng }) {
  return (
    <div>
      <div style={{ display: 'flex', height: '100%' }}>
        <Wrapper apiKey="AIzaSyAIs4-oHUknPIC3Aq0fcnKUEB1IhWQD31s" render={render}>
          <MapNew pickupLatLng={pickupLatLng} dropLatLng={dropLatLng}></MapNew>
        </Wrapper>
      </div>
    </div>
  );
}

export default Directions;

/* eslint-disable no-undef */
function MapNew({ pickupLatLng, dropLatLng }) {
  // eslint-disable-next-line no-unused-vars
  const [latlog, setLatlog] = useState({ lat: 22.328127, lng: 91.805502 });
  const mapRef = useRef();
  const startRef = useRef();
  const sidebar = useRef();
  const endRef = useRef();
  const floatingPanel = useRef();
  // eslint-disable-next-line no-unused-vars
  const [map_, setMap] = useState();
  const [directionsRenderer, setdirectionsRenderer] = useState();
  const [directionsService, setdirectionsService] = useState();

  useEffect(() => {
    const directionsRenderer_ = new google.maps.DirectionsRenderer();
    const directionsService_ = new google.maps.DirectionsService();
    setdirectionsRenderer(directionsRenderer_);
    setdirectionsService(directionsService_);

    const map = new google.maps.Map(mapRef.current, {
      center: latlog,
      zoom: 12,
      disableDefaultUI: true,
      // mapTypeId: 'satellite',
      // heading: 90,
      // tilt: 45,
    });

    setMap(map);
    directionsRenderer_.setMap(map);
    directionsRenderer_.setPanel(sidebar.current);

    const control = floatingPanel.current;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
  }, []);

  function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService
      .route({
        origin: pickupLatLng,
        destination: dropLatLng,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        console.log(response);

        const route = response.routes[0];
        console.log('route', route);

        // console.log(route.legs[i].end_address);

        // console.log(route.legs[i].distance.text);

        directionsRenderer.setDirections(response);

        console.log(route.legs[0].distance.text);
        console.log(route.legs[0].duration.text);
        console.log(route.legs[0].start_address);
        console.log(route.legs[0].end_address);
        console.log(route.legs[0].steps);

        // var summaryPanel;
        // for (let i = 0; i < route.legs.length; i++) {
        //     const routeSegment = i + 1;

        //     summaryPanel +=
        //         "<b>Route Segment: " + routeSegment + "</b><br>";
        //         summaryPanel += route.legs[i].start_address + " to ";
        //         summaryPanel += route.legs[i].end_address + "<br>";
        //         summaryPanel += route.legs[i].distance.text + "<br><br>";
        // }

        // console.log(summaryPanel);

        console.log(directionsRenderer.getPanel());
      })
      .catch((e) => window.alert(`Directions request failed due to ${e.message}`));

    // directionsService
    //   .route({
    //     origin: start,
    //     destination: end,
    //     travelMode: google.maps.TravelMode.DRIVING,
    //   })
    //   .then((response) => {

    //     console.log(response);

    //     directionsRenderer.setDirections(response);

    //     console.log(directionsRenderer.getPanel());

    //   })
    //   .catch((e) => window.alert("Directions request failed due to " + e.message));
  }

  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };

  return (
    <div>
      <div style={{ width: '100%', height: '200px', backgroundColor: 'red' }}></div>

      <div className="floating-panel" ref={floatingPanel}>
        <strong>Start:</strong>
        <select className="starts" ref={startRef} onChange={onChangeHandler}>
          <option value="chicago, il">Chicago</option>
          <option value="st louis, mo">St Louis</option>
          <option value="joplin, mo">Joplin, MO</option>
          <option value="oklahoma city, ok">Oklahoma City</option>
          <option value="amarillo, tx">Amarillo</option>
          <option value="gallup, nm">Gallup, NM</option>
          <option value="flagstaff, az">Flagstaff, AZ</option>
          <option value="winona, az">Winona</option>
          <option value="kingman, az">Kingman</option>
          <option value="barstow, ca">Barstow</option>
          <option value="san bernardino, ca">San Bernardino</option>
          <option value="los angeles, ca">Los Angeles</option>
        </select>
        <br />
        <strong>End:</strong>
        <select className="end" ref={endRef} onChange={onChangeHandler}>
          <option value="chicago, il">Chicago</option>
          <option value="st louis, mo">St Louis</option>
          <option value="joplin, mo">Joplin, MO</option>
          <option value="oklahoma city, ok">Oklahoma City</option>
          <option value="amarillo, tx">Amarillo</option>
          <option value="gallup, nm">Gallup, NM</option>
          <option value="flagstaff, az">Flagstaff, AZ</option>
          <option value="winona, az">Winona</option>
          <option value="kingman, az">Kingman</option>
          <option value="barstow, ca">Barstow</option>
          <option value="san bernardino, ca">San Bernardino</option>
        </select>
      </div>
      <div className="container">
        <div ref={mapRef} className="map" style={{ width: '100%', height: '400px' }}></div>
        <div className="sidebar" ref={sidebar}></div>
      </div>
      {/* <div style={{ display: 'none' }}>
                <div className="floating-panel">
                    <strong>Start:</strong>
                    <select className="start">
                        <option value="chicago, il">Chicago</option>
                        <option value="st louis, mo">St Louis</option>
                        <option value="joplin, mo">Joplin, MO</option>
                        <option value="oklahoma city, ok">Oklahoma City</option>
                        <option value="amarillo, tx">Amarillo</option>
                        <option value="gallup, nm">Gallup, NM</option>
                        <option value="flagstaff, az">Flagstaff, AZ</option>
                        <option value="winona, az">Winona</option>
                        <option value="kingman, az">Kingman</option>
                        <option value="barstow, ca">Barstow</option>
                        <option value="san bernardino, ca">San Bernardino</option>
                        <option value="los angeles, ca">Los Angeles</option>
                    </select>
                    <br />
                    <strong>End:</strong>
                    <select className="end">
                        <option value="chicago, il">Chicago</option>
                        <option value="st louis, mo">St Louis</option>
                        <option value="joplin, mo">Joplin, MO</option>
                        <option value="oklahoma city, ok">Oklahoma City</option>
                        <option value="amarillo, tx">Amarillo</option>
                        <option value="gallup, nm">Gallup, NM</option>
                        <option value="flagstaff, az">Flagstaff, AZ</option>
                        <option value="winona, az">Winona</option>
                        <option value="kingman, az">Kingman</option>
                        <option value="barstow, ca">Barstow</option>
                        <option value="san bernardino, ca">San Bernardino</option>
                        <option value="los angeles, ca">Los Angeles</option>
                    </select>
                </div>
            </div> */}
    </div>
  );
}
