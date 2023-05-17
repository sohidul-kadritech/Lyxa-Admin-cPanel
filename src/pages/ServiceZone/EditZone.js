import { LocationOnOutlined } from '@mui/icons-material';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import React, { useState } from 'react';
import StyledFormField from '../../components/Form/StyledFormField';
import ModalContainer from './ModalContainer';
import ZoneMap from './ZoneMap';
import { ConvertArea, createdGetLatLngsData, validateEditedData } from './helper';
// eslint-disable-next-line prettier/prettier, no-unused-vars
const fieldContainerSx = {
  padding: '14px 0px 23px 0',
  flex: '1',
};

const calculateCurrentPolygonArea = (polygon) => {
  const convetedData = createdGetLatLngsData(polygon);
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
    rowData?.zoneGeometry?.coordinates[0] || [
      [0, 0],
      [0, 0],
      [0, 0],
      // eslint-disable-next-line prettier/prettier
		]
  );

  // eslint-disable-next-line no-unused-vars
  const [createdZoneStatus, setCreatedZoneStatus] = useState('active');

  const [createdZoneName, setCreatedZoneName] = useState(rowData?.zoneName || '');

  const [createdZoneArea, setCreatedZoneArea] = useState(rowData?.zoneArea || '');

  const [searchResult, setSearchResult] = useState([]);

  const [selectedLocation, setSelectedLoaction] = useState({ lat: null, lon: null });
  console.log(
    'getArear here: ',
    L.GeometryUtil.geodesicArea([
      { lat: 23.2254654, lng: 45.55 },
      { lat: 25.2254654, lng: 48.55 },
      { lat: 28.2254654, lng: 50.55 },
    ])
  );

  console.log(createdGetLatLngsData(rowData?.zoneGeometry?.coordinates[0]), 'funciton call here');
  // console.log('getArear here: ', L.GeometryUtil.geodesicArea(rowData?.zoneGeometry?.coordinates[0]));
  // eslint-disable-next-line no-unused-vars
  const [polygonArea, setPolygonArea] = useState(
    calculateCurrentPolygonArea(rowData?.zoneGeometry?.coordinates[0]) || 0
  );

  const updateZone = () => {
    const data = {
      zoneId: rowData?._id,
      zoneName: createdZoneName,
      zoneArea: createdZoneArea,
      zoneGeometry: {
        type: 'Polygon',
        coordinates: [createdZoneGeometry],
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
			]
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

        <Box>
          <ZoneMap
            setPolygonArea={setPolygonArea}
            allZones={allZones}
            setCreatedZoneGeometry={setCreatedZoneGeometry}
            selectedLocation={selectedLocation}
            currentLocation={currentLocation}
          ></ZoneMap>
        </Box>
        <Box>
          <Stack flexDirection="row" sx={{ marginTop: '40px' }}>
            <Box flex={1}>
              <Typography
                sx={{ color: theme.palette.text.primary, fontSize: '16px', fontWeight: 600, lineHeight: '20px' }}
              >
                Area
              </Typography>
              <Typography
                sx={{ color: theme.palette.text.primary, fontSize: '28px', fontWeight: 500, lineHeight: '20px' }}
              >
                {/* {polygonArea}m<sup>2</sup> */}
                <ConvertArea squareMeters={polygonArea} />
              </Typography>
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
