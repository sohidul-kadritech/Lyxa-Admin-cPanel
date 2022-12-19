import React from "react";
import GoogleMapReact from "google-map-react";
import { GOOGLE_API_KEY, logoSvg } from "../assets/staticData";
import LocationOnIcon from "@mui/icons-material/LocationOn";
// import GoogleMap from "google-map-react";

// const AnyReactComponent = ({ pointer }) => <div></div>;

const Map = ({ lat = 0, lng = 0 }) => {
  const defaultProps = {
    center: {
      lat: lat,
      lng: lng,
    },
    zoom: 12,
  };

  return (
    <div style={{ height: "600px", width: "100%" }}>
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
        {/* <AnyReactComponent /> */}
        <LocationOnIcon className="text-danger fs-2" />
      </GoogleMapReact>
    </div>
  );
};

export default Map;
