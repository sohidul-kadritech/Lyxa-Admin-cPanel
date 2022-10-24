import React from "react";
import GoogleMapReact from "google-map-react";
import { GOOGLE_API_KEY, logoSvg } from "../assets/staticData";
// import GoogleMap from "google-map-react";

const AnyReactComponent = ({ text }) => (
  <div>
    <span>{text}</span>
  </div>
);

const Map = ({ lat = 0, lng = 0 }) => {

  const defaultProps = {
    center: {
      lat: lat,
      lng: lng,
    },
    zoom: 5,
  };

  //   setTimeout(() => {
  //     map?.current?.fitToCoordinates([origin, destination], {
  //       edgePadding: {
  //         top: 80,
  //         right: 50,
  //         bottom: 80,
  //         left: 50,
  //       },
  //       animated: true,
  //     });
  //   }, 1500);

  // const origin = {
  // latitude: orderData?.orderDeliveryCharge?.shopLocation[1],
  // longitude: orderData?.orderDeliveryCharge?.shopLocation[0],
  // };

  return (
    <div style={{ height: "640px", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: GOOGLE_API_KEY,
          language: "en",
          region: "US",
          libraries: ["places"],

        }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      // onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        <AnyReactComponent lat={lat} lng={lng} text={logoSvg} />
      </GoogleMapReact>
    </div>
  );
};

export default Map;
