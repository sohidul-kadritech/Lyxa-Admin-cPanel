import React from "react";
import GoogleMapReact from "google-map-react";
import { logoSvg } from "../assets/staticData";
// import GoogleMap from "google-map-react";

const AnyReactComponent = () => (
  <div>
    <span>{logoSvg}</span>
  </div>
);

const Map = () => {
  const defaultProps = {
    center: {
      lat: 23.8103,
      lng: 90.4125,
    },
    zoom: 10,
  };

  return (
    <div style={{ height: "250px", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyA_ciMsx74Ck21Firr3yS0xwvL7M7gonf8",
          language: "en",
          region: "US",
          libraries: ["places"],
        }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent lat={23.8479} lng={90.2576} />
      </GoogleMapReact>
    </div>
  );
};

export default Map;
