import { Stack, Typography } from '@mui/material';
import L from 'leaflet';
import { successMsg } from '../../helpers/successMsg';

export const validateEditedData = (data) => {
  if (!data?.zoneName) {
    successMsg('Please add a zone name!');
    return false;
  }
  if (!data?.zoneArea) {
    successMsg('Please add a zone area!');
    return false;
  }
  if (!data?.zoneStatus) {
    successMsg('Please select a zone status!');
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
      <Typography variant="span">
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
