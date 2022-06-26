import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Col, Row } from "reactstrap";

const Map = () => {
  // const mapRef = useRef();
  // const sidebar = useRef();
  // const floatingPanel = useRef();

  // const [directionsRenderer, setdirectionsRenderer] = useState(null);
  // const [directionsService, setdirectionsService] = useState(null);
  // const [distance, setDistance] = useState("");
  // const [duration, setDuration] = useState("");
  // const google = window.google;

  // useEffect(() => {
  //   const directionsRenderer_ = new google.maps.DirectionsRenderer();
  //   const directionsService_ = new google.maps.DirectionsService();
  //   setdirectionsRenderer(directionsRenderer_);
  //   setdirectionsService(directionsService_);

  //   const map = new google.maps.Map(mapRef.current, {
  //     center: { lat: 22.328127, lng: 91.805502 },
  //     zoom: 12,
  //     disableDefaultUI: true,
  //     //   mapTypeId: "satellite",
  //     heading: 90,
  //     tilt: 45,
  //   });

  //   directionsRenderer_.setMap(map);
  //   directionsRenderer_.setPanel(sidebar.current);

  //   const control = floatingPanel.current;
  //   map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  //   calculateAndDisplayRoute(directionsService_, directionsRenderer_);
  // }, []);

  // function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  //   directionsService
  //     .route({
  //       origin: { lat: 23.8103, lng: 90.4125 },
  //       destination: { lat: 22.3569, lng: 91.7832 },
  //       travelMode: google.maps.TravelMode.DRIVING,
  //     })
  //     .then((response) => {
  //       const route = response.routes[0];

  //       directionsRenderer.setDirections(response);

  //       setDistance(route.legs[0].distance.value.toString());
  //       setDuration(route.legs[0].duration.value.toString());
  //     })
  //     .catch((e) =>
  //       window.alert("Directions request failed due to " + e.message)
  //     );
  // }

  return <div></div>;
};

export default Map;
