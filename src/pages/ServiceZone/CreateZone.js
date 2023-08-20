import { Cached, LocationOnOutlined, MyLocation } from '@mui/icons-material';
import { Box, Button, CircularProgress, IconButton, Stack, Typography, useTheme } from '@mui/material';
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import StyledFormField from '../../components/Form/StyledFormField';
import ModalContainer from './ModalContainer';
import ZoneMap from './ZoneMap';

import StyledInput from '../../components/Styled/StyledInput';
import { ConvertArea, convertedLatLonToLonLat, validateEditedData } from './helper';
import useGeoLocation from './useGeoLocation';

// eslint-disable-next-line prettier/prettier, no-unused-vars
const fieldContainerSx = {
  padding: '14px 0px 23px 0',
  flex: '1',
};

function CreateZone({ onClose, addNewZone, allZones, ...props }) {
  const theme = useTheme();

  const [isDisable, setIsDisable] = useState(false);

  const { location: currentLocation, getCurrentLocation } = useGeoLocation();

  const [createdZoneGeometry, setCreatedZoneGeometry] = useState([
    [0, 0],
    [0, 0],
    [0, 0],
  ]);

  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const [createdZoneName, setCreatedZoneName] = useState('');

  const [createdZoneArea, setCreatedZoneArea] = useState('');

  const [polygonArea, setPolygonArea] = useState(0);

  const [selectedLocation, setSelectedLoaction] = useState({ lat: null, lon: null });

  // eslint-disable-next-line no-unused-vars

  // getLocationFromLatLng(40.714224, -73.961452);

  const createNewZone = () => {
    const polygon = convertedLatLonToLonLat(createdZoneGeometry);
    const data = {
      zoneName: createdZoneName,
      zoneArea: createdZoneArea,
      zoneGeometry: {
        type: 'Polygon',
        coordinates: [...polygon, polygon[0]],
      },
      // zoneStatus: createdZoneStatus,
    };
    console.log('data-->', data);
    if (validateEditedData(data)) {
      addNewZone.mutate(data);
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
      .then((results) => generateShopAddress(results[0]))
      .catch((error) => console.error('Error', error));
  };

  return (
    <ModalContainer
      onClose={onClose}
      title="Create zone"
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
        <Stack flexDirection="row" gap="36px" alignItems="center">
          {/* Zone name */}
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
              defaultValue: props?.rowData?.zoneName || '',
              type: 'text',
              name: 'zoneName',
              onChange: (e) => setCreatedZoneName(e.target.value),
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
            setIsDisable={setIsDisable}
            setPolygonArea={setPolygonArea}
            currentLocation={currentLocation}
            allZones={allZones}
            setCreatedZoneGeometry={setCreatedZoneGeometry}
            selectedLocation={selectedLocation}
            setCreatedZoneArea={setCreatedZoneArea}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />

          {addNewZone?.isLoading && (
            <Stack
              sx={{ position: 'absolute', top: '0', left: '0', zIndex: '9999', backdropFilter: 'blur(10px)' }}
              justifyContent="center"
              alignContent="center"
              alignItems="center"
              width="100%"
              height="100%"
            >
              <CircularProgress color="primary" sx={{ width: '100px !important', height: '100px !important' }} />
              <Typography sx={{ color: theme.palette.primary.contrastText }}>Please Wait...</Typography>
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
            <Stack direction="row" alignItems="center" gap={{ xs: 2, sm: 3, lg: 4 }}>
              <IconButton
                disabled={addNewZone?.isLoading}
                onClick={() => {
                  setIsLoading(!isLoading);
                }}
                variant="outlined"
                color="primary"
              >
                <Cached />
              </IconButton>
              <IconButton
                disabled={addNewZone?.isLoading}
                onClick={() => {
                  getCurrentLocation();
                }}
                variant="outlined"
                color="primary"
              >
                <MyLocation />
              </IconButton>
              <Button
                disabled={addNewZone?.isLoading || isDisable}
                onClick={createNewZone}
                variant="contained"
                color="primary"
              >
                Save Zone
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </ModalContainer>
  );
}

export default CreateZone;
