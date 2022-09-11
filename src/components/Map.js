import React from "react";
import GoogleMapReact from "google-map-react";
import { logoSvg } from "../assets/staticData";
// import GoogleMap from "google-map-react";

const AnyReactComponent = ({text}) => (
  <div>
    <span>{text}</span>
  </div>
);

const Map = ({lat = 0, lng= 0 }) => {

  const defaultProps = {
    center: {
      lat: 23.8103,
      lng: 90.4125,
    },
    zoom: 10,
  };

  return (
    <div style={{ height: "640px", width: "100%" }}>
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
        <AnyReactComponent lat={lat}  lng={lng} text={logoSvg} />
      </GoogleMapReact>
    </div>
  );
};

export default Map;
