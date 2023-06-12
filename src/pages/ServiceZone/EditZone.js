import { LocationOnOutlined } from '@mui/icons-material';
import { Box, Button, CircularProgress, Stack, Typography, useTheme } from '@mui/material';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import React, { useState } from 'react';
import StyledFormField from '../../components/Form/StyledFormField';
import ModalContainer from './ModalContainer';
import ZoneMap from './ZoneMap';
import {
  ConvertArea,
  convertedLatLonToLonLat,
  convertedLonLatToLatLon,
  createdGetLatLngsData,
  validateEditedData,
} from './helper';
// eslint-disable-next-line prettier/prettier, no-unused-vars
const fieldContainerSx = {
  padding: '14px 0px 23px 0',
  flex: '1',
};

const calculateCurrentPolygonArea = (polygon) => {
  const convetedData = createdGetLatLngsData(convertedLonLatToLatLon(polygon));
  const area = L.GeometryUtil.geodesicArea(convetedData);
  return Math.round(area);
};

// eslint-disable-next-line no-unused-vars
function EditZone({ onClose, editZone, allZones, rowData, currentLocation }) {
  const theme = useTheme();
  console.log('current location in edited section: ', currentLocation);
  // eslint-disable-next-line no-unused-vars
  const [searchLoading, setSearchLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [createdZoneGeometry, setCreatedZoneGeometry] = useState(
    convertedLonLatToLatLon(rowData?.zoneGeometry?.coordinates[0]).slice(0, -1) || [
      [0, 0],
      [0, 0],
      [0, 0],
      // eslint-disable-next-line prettier/prettier
    ],
  );

  // eslint-disable-next-line no-unused-vars
  const [createdZoneStatus, setCreatedZoneStatus] = useState('active');

  const [createdZoneName, setCreatedZoneName] = useState(rowData?.zoneName || '');

  const [createdZoneArea, setCreatedZoneArea] = useState(rowData?.zoneArea || '');

  const [searchResult, setSearchResult] = useState([]);

  const [selectedLocation, setSelectedLoaction] = useState({ lat: null, lon: null });

  console.log(createdGetLatLngsData(rowData?.zoneGeometry?.coordinates[0]), 'funciton call here');
  // eslint-disable-next-line no-unused-vars
  const [polygonArea, setPolygonArea] = useState(
    // eslint-disable-next-line prettier/prettier
    calculateCurrentPolygonArea(rowData?.zoneGeometry?.coordinates[0]) || 0,
  );

  const updateZone = () => {
    // const convertedLatLonToLonLat = createdZoneGeometry.map(([lat, lon]) => [lon, lat]);
    const polygon = convertedLatLonToLonLat(createdZoneGeometry);
    const data = {
      zoneId: rowData?._id,
      zoneName: createdZoneName,
      zoneArea: createdZoneArea,
      zoneGeometry: {
        type: 'Polygon',
        coordinates: [...polygon, polygon[0]],
      },
      zoneStatus: createdZoneStatus,
    };
    if (validateEditedData(data)) {
      editZone.mutate(data);
    }
  };

  // searching place api here
  const mapSearchResult = async (e) => {
    setSearchLoading(true);
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: e.target.value });
    setSearchLoading(false);
    setSearchResult(e.target.value ? results : []);
  };

  // eslint-disable-next-line no-unused-vars
  const populateData = () => {
    setCreatedZoneGeometry(
      rowData?.zoneGeometry?.coordinates[0] || [
        [0, 0],
        [0, 0],
        [0, 0],
        // eslint-disable-next-line prettier/prettier
      ],
    );
    setCreatedZoneName(rowData?.zoneName || '');
    setCreatedZoneArea(rowData?.zoneArea || '');
  };

  return (
    <ModalContainer
      onClose={onClose}
      title="Edit zone"
      sx={{
        width: '96vw',
        height: '96vh',
        margin: '2vh 2vw',
        padding: '36px',
        overflow: 'auto',
        backgroundColor: theme.palette.primary.contrastText,
        borderRadius: '10px',
      }}
    >
      <Box>
        <Stack flexDirection="row" gap="36px">
          <StyledFormField
            label={
              <Typography sx={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }} variant="h4">
                Zone name
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    marginLeft: '8px',
                    color: theme.palette.danger.main,
                  }}
                  variant="span"
                >
                  Required
                </Typography>
              </Typography>
            }
            intputType="text"
            containerProps={{
              sx: fieldContainerSx,
            }}
            inputProps={{
              value: createdZoneName,
              type: 'text',
              name: 'zoneName',
              onChange: (e) => {
                setCreatedZoneName(e.target.value);
              },
            }}
          />

          <Box sx={{ flex: '1', position: 'relative' }}>
            <StyledFormField
              label={
                <Typography sx={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }} variant="h4">
                  Search Area
                  <Typography
                    sx={{
                      fontSize: '11px',
                      fontWeight: 500,
                      lineHeight: '20px',
                      marginLeft: '8px',
                      color: theme.palette.danger.main,
                    }}
                    variant="span"
                  >
                    Required
                  </Typography>
                </Typography>
              }
              intputType="text"
              containerProps={{
                sx: fieldContainerSx,
              }}
              inputProps={{
                value: createdZoneArea,
                type: 'text',
                name: 'zoneArea',
                onChange: (e) => {
                  setCreatedZoneArea(e.target.value);
                  mapSearchResult(e);
                },
              }}
            />
            {searchResult?.length > 0 && (
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.contrastText,
                  width: '100%',
                  maxHeight: '300px',
                  position: 'absolute',
                  overflow: 'auto',
                  padding: '16px',
                  zIndex: '99999',
                  left: 0,
                  borderRadius: '7px',
                  transform: 'translateY(-8%)',
                }}
              >
                {!searchLoading ? (
                  <>
                    {searchResult.map((loc, i) => (
                      <Stack
                        key={i}
                        onClick={async () => {
                          // console.log('location slected: ', [loc.raw.lat, loc.raw.lon]);
                          await setCreatedZoneArea(loc?.label);
                          if (loc?.raw?.lat && loc?.raw?.lon)
                            await setSelectedLoaction({
                              lat: parseFloat(loc?.raw?.lat),
                              lon: parseFloat(loc?.raw?.lon),
                            });
                          setSearchResult([]);
                          // else setSelectedLoaction([]);
                        }}
                        flexDirection="row"
                        gap="8px"
                        alignItems="center"
                        sx={{ marginBottom: '8px', cursor: 'pointer' }}
                      >
                        <LocationOnOutlined /> <Typography variant="body2">{loc?.label}</Typography>
                      </Stack>
                    ))}
                  </>
                ) : (
                  <Stack
                    flexDirection="row"
                    gap="8px"
                    alignItems="center"
                    sx={{ marginBottom: '8px', cursor: 'pointer' }}
                  >
                    <Typography variant="body2">Loading...</Typography>
                  </Stack>
                )}
              </Box>
            )}
          </Box>
        </Stack>

        <Box sx={{ position: 'relative' }}>
          <ZoneMap
            currentZoneName={rowData?.zoneName || ''}
            setPolygonArea={setPolygonArea}
            allZones={allZones}
            setCreatedZoneGeometry={setCreatedZoneGeometry}
            selectedLocation={selectedLocation}
            currentLocation={currentLocation}
            setCreatedZoneArea={setCreatedZoneArea}
          ></ZoneMap>
          {editZone?.isLoading && (
            <Stack
              sx={{ position: 'absolute', top: '0', left: '0', zIndex: '9999', backdropFilter: 'blur(10px)' }}
              justifyContent="center"
              alignContent="center"
              alignItems="center"
              width="100%"
              height="100%"
            >
              <CircularProgress color="primary" sx={{ width: '100px !important', height: '100px !important' }} />
              <Typography>Please Wait...</Typography>
            </Stack>
          )}
        </Box>
        <Box>
          <Stack flexDirection="row" sx={{ marginTop: '40px' }}>
            <Box flex={1}>
              <Typography
                sx={{ color: theme.palette.text.primary, fontSize: '16px', fontWeight: 600, lineHeight: '20px' }}
              >
                Area
              </Typography>
              <ConvertArea squareMeters={polygonArea} />
            </Box>
            <Stack flexDirection="row" gap="20px">
              <Button disabled={editZone?.isLoading} onClick={updateZone} variant="contained" color="primary">
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </ModalContainer>
  );
}

export default EditZone;
