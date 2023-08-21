import { LocationOnOutlined } from '@mui/icons-material';
import { Box, Button, CircularProgress, Stack, Typography, useTheme } from '@mui/material';
import L from 'leaflet';
import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledInput from '../../components/Styled/StyledInput';
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
  const [isDisable, setIsDisable] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [createdZoneGeometry, setCreatedZoneGeometry] = useState(
    convertedLonLatToLatLon(rowData?.zoneGeometry?.coordinates[0]).slice(0, -1) || [
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

  const [selectedLocation, setSelectedLoaction] = useState({ lat: null, lon: null });

  console.log(createdGetLatLngsData(rowData?.zoneGeometry?.coordinates[0]), 'funciton call here');
  // eslint-disable-next-line no-unused-vars
  const [polygonArea, setPolygonArea] = useState(
    // eslint-disable-next-line prettier/prettier
    calculateCurrentPolygonArea(rowData?.zoneGeometry?.coordinates[0]) || 0
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

  // generate addresss here

  const generateShopAddress = async (address = {}) => {
    let latlng;

    console.log('address', address);

    try {
      latlng = await getLatLng(address);
    } catch (error) {
      console.log(error);
    }
    // newAddress.placeId = placeId;
    setSelectedLoaction({ lat: latlng?.lat, lon: latlng?.lng });
  };

  // select address here
  const handleAddressSelect = (address, placeId) => {
    console.log('address handle', address, placeId);
    setCreatedZoneArea(address);
    geocodeByAddress(address);
    geocodeByPlaceId(placeId)
      .then((results) => generateShopAddress(results[0], placeId))
      .catch((error) => console.error('Error', error));
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

          {/* Search Area */}
          <Stack gap={2} sx={{ flex: '1', position: 'relative', ...fieldContainerSx }}>
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
            <PlacesAutocomplete
              value={createdZoneArea}
              onChange={(address) => setCreatedZoneArea(address)}
              onSelect={handleAddressSelect}
              onError={(error) => {
                console.log(error);
              }}
              clearItemsOnError
              shouldFetchSuggestions={createdZoneArea?.length > 3}
              googleCallbackName="myCallbackFunc"
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
                console.log('address suggesion', suggestions);
                return (
                  <div>
                    <StyledInput
                      sx={{
                        '& input': {
                          paddingLeft: '18px',
                          paddingRight: '18px',
                          fontWeight: '500',
                          fontSize: '15px',
                          color: theme.palette.text.primary,
                        },
                      }}
                      {...getInputProps()}
                      fullWidth
                      type="text"
                      value={createdZoneArea}
                    />
                    <Box
                      sx={{
                        fontSize: '14px',
                        width: '100%',
                        position: 'absolute',
                        top: '100%',
                        backgroundColor: '#F6F8FA',
                        borderRadius: '8px',
                        zIndex: '99999',
                        overflow: 'hidden',
                      }}
                    >
                      {loading && <Box sx={{ padding: '6px 16px' }}>Loading...</Box>}
                      {suggestions.map((suggestion) => (
                        <Box
                          {...getSuggestionItemProps(suggestion)}
                          key={Math.random()}
                          sx={{
                            padding: '6px 16px',
                            fontSize: '14px',
                            fontWeight: '400',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '8px',
                            alignItems: 'center',

                            '&:hover': {
                              background: '#ecf0f5',
                            },
                          }}
                        >
                          <LocationOnOutlined /> <Typography variant="body2"> {suggestion.description}</Typography>
                          {/* {suggestion.description} */}
                        </Box>
                      ))}
                    </Box>
                  </div>
                );
              }}
            </PlacesAutocomplete>
          </Stack>
        </Stack>

        <Box sx={{ position: 'relative' }}>
          <ZoneMap
            isEditZone
            currentZone={rowData || ''}
            setPolygonArea={setPolygonArea}
            setIsDisable={setIsDisable}
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
              <Button
                disabled={editZone?.isLoading || isDisable}
                onClick={updateZone}
                variant="contained"
                color="primary"
              >
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
