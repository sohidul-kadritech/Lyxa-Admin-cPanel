export const getCenterOfTheZone = (coordinates) => {
  const { google } = window;
  const path = coordinates.map((coord) => new google.maps.LatLng(coord.lat, coord.lng));

  // initialize boundary
  const bounds = new google.maps.LatLngBounds();

  for (let i = 0; i < path.length; i++) {
    bounds.extend(path[i]);
  }

  if (bounds) {
    return {
      center: bounds.getCenter(),
    };
  }

  return {
    center: undefined,
  };
};

export const formateZoneCoordinates = (zones) => {
  const tempZones = zones || [];

  const allZones = tempZones.map((item) => {
    const coordinates = item?.zoneGeometry?.coordinates[0]?.map((coord) => ({ lat: coord[1], lng: coord[0] }));

    return { ...item, zoneGeometry: { ...item?.zoneGeometry, coordinates: [...coordinates] } };
  });

  return allZones;
};
