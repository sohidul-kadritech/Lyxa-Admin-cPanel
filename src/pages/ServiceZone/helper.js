import { Stack, Typography } from '@mui/material';
import axios from 'axios';
import L from 'leaflet';
import { GOOGLE_API_KEY2 } from '../../assets/staticData';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';

export const validateEditedData = (data) => {
  if (!data?.zoneName) {
    successMsg('Please add a zone name!');
    return false;
  }
  if (!data?.zoneArea) {
    successMsg('Please add a zone area!');
    return false;
  }

  if (data?.zoneGeometry?.coordinates[0].length === 0) {
    successMsg('Please select a polygon!');
    return false;
  }

  return true;
};
export const calculatePolygonArea = (polygon) => {
  const area = L.GeometryUtil.geodesicArea(polygon?.getLatLngs()[0] || [[0, 0]]);
  // console.log('polygon.getLatLngs()[0]', polygon?.getLatLngs()[0]);
  return Math.round(area);
};

export const createdGetLatLngsData = (polygon) => {
  const convertedData = polygon.map(([lat, lng]) => ({ lat, lng }));
  // console.log('converted: ', convertedData);
  return convertedData;
};

export function ConvertArea({ squareMeters }) {
  const squareFeet = squareMeters * 10.7639;
  // eslint-disable-next-line no-unused-vars
  const acres = squareFeet / 43560;
  const squareKilometers = squareMeters / 1000000;
  // eslint-disable-next-line no-unused-vars
  const squareMiles = squareFeet / 27878400;

  return (
    <Stack flexDirection="row" alignContent="center" alignItems="center" gap="4px">
      <Typography variant="body4">
        {squareKilometers.toFixed(2)}km<sup>2</sup>
      </Typography>
      {/* <Typography sx={{ fontSize: '12px' }} variant="span">
        {squareKilometers.toFixed(2)}km<sup>2</sup>
      </Typography> */}
      {/* <Typography sx={{ fontSize: '12px' }} variant="span">
        {squareMiles}miles<sup>2</sup>
      </Typography>
      <Typography sx={{ fontSize: '12px' }} variant="span">
        {acres}acres
      </Typography> */}
    </Stack>
  );
  // squareMeters,
  // acres,
  // squareKilometers,
  // squareMiles,
}

export const colorList = [
  '#FF0000', // Red
  '#FFA500', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Lime
  '#00FFFF', // Cyan
  '#0000FF', // Blue
  '#800080', // Purple
  '#FF00FF', // Magenta
  '#FF1493', // DeepPink
  '#FF4500', // OrangeRed
  '#FF8C00', // DarkOrange
  '#FFD700', // Gold
  '#ADFF2F', // GreenYellow
  '#32CD32', // LimeGreen
  '#00FF7F', // SpringGreen
  '#00CED1', // DarkTurquoise
  '#1E90FF', // DodgerBlue
  '#8A2BE2', // BlueViolet
  '#9932CC', // DarkOrchid
  '#FF69B4', // HotPink
  '#FF7F50', // Coral
  '#FFA07A', // LightSalmon
  '#FFDAB9', // PeachPuff
  '#FFE4B5', // Moccasin
  '#FFC0CB', // Pink
  '#FFE4C4', // Bisque
  '#FFFACD', // LemonChiffon
  '#F0E68C', // Khaki
  '#98FB98', // PaleGreen
  '#00FA9A', // MediumSpringGreen
  '#48D1CC', // MediumTurquoise
  '#87CEEB', // SkyBlue
  '#6A5ACD', // SlateBlue
  '#BA55D3', // MediumOrchid
  '#FFB6C1', // LightPink
  '#FFA07A', // LightSalmon
  '#FFDAB9', // PeachPuff
  '#FFE4B5', // Moccasin
  '#FFC0CB', // Pink
  '#FFE4C4', // Bisque
  '#FFFACD', // LemonChiffon
  '#F0E68C', // Khaki
  '#98FB98', // PaleGreen
  '#00FA9A', // MediumSpringGreen
  '#48D1CC', // MediumTurquoise
  '#87CEEB', // SkyBlue
  '#6A5ACD', // SlateBlue
  '#BA55D3', // MediumOrchid
  '#FFB6C1', // LightPink
  '#FFA07A', // LightSalmon
  '#FFDAB9', // PeachPuff
  '#FFE4B5', // Moccasin
  '#FFC0CB', // Pink
  '#FFE4C4', // Bisque
  '#FFFACD', // LemonChiffon
  '#F0E68C', // Khaki
  '#98FB98', // PaleGreen
  '#00FA9A', // MediumSpringGreen
  '#48D1CC', // MediumTurquoise
  '#87CEEB', // SkyBlue
  '#6A5ACD', // SlateBlue
];

const getZoneStatsById = async (id) => {
  // API_URL.GET_STAT_ZONE

  const zoneStatesData = await AXIOS.get(API_URL?.GET_STAT_ZONE, {
    params: {
      zoneId: id,
    },
  });

  const data = await zoneStatesData?.data;
  return data;
};

// Map overViewData generator
export const createDataForTable = async (data) => {
  const col = await Promise.all(
    data.map(async ({ _id, zoneName, zoneGeometry }, index) => {
      const stats = await getZoneStatsById(_id);
      return {
        _id,
        colorId: index + 1,
        zoneName,
        stats,
        zoneGeometry,
      };
      // eslint-disable-next-line prettier/prettier
    }),
  );
  return col;
};

// convert [lon, lat] to [lat,lon]
export const convertedLonLatToLatLon = (polygon) => polygon.map(([lon, lat]) => [lat, lon]);
// convert [lat, lon] to [lon,lat]
export const convertedLatLonToLonLat = (polygon) => polygon.map(([lat, lon]) => [lon, lat]);

export const createZoneInfoData = (data) => {
  const newData = data.map((info) => ({
    ...info,
    name: info?.name || info.shopName,
  }));

  return newData;
};

// gel location form lat lon
export const getLocationFromLatLng = async (lat, lng) => {
  console.log('lat lng; ', lat, lng);
  const location = await axios.get(API_URL.GET_LOCATION_FROM_LATLNG, {
    params: {
      latlng: `${lat},${lng}`,
      key: GOOGLE_API_KEY2,
    },
  });
  return location;
};
