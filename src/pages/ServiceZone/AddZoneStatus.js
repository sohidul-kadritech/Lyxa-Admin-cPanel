import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import L from 'leaflet';
import React, { useState } from 'react';
import StyledFormField from '../../components/Form/StyledFormField';
import { successMsg } from '../../helpers/successMsg';
import ModalContainer from './ModalContainer';
import ZoneMap from './ZoneMap';
import { ConvertArea, convertedLonLatToLatLon, createdGetLatLngsData } from './helper';

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
function AddZoneStatus({ onClose, updateAZoneQuery, allZones, currentLocation, rowData, ...props }) {
  const theme = useTheme();

  const [polygonArea, setPolygonArea] = useState(
    // eslint-disable-next-line prettier/prettier
    calculateCurrentPolygonArea(rowData?.zoneGeometry?.coordinates[0]) || 0,
  );
  // eslint-disable-next-line no-unused-vars
  const [createdZoneGeometry, setCreatedZoneGeometry] = useState([
    [0, 0],
    [0, 0],
    [0, 0],
  ]);

  // eslint-disable-next-line no-unused-vars
  const [createdZoneName, setCreatedZoneName] = useState(rowData?.zoneName || '');

  // eslint-disable-next-line no-unused-vars
  const [selectedLocation, setSelectedLoaction] = useState({ lat: null, lon: null });

  const [zoneAvailabilityData, setZoneAvailabilityData] = useState({});

  const changeHanlder = (e) => {
    setZoneAvailabilityData((prev) => {
      console.log({ ...prev, [e.target.name]: e.target.value });
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const onSubmitHandler = () => {
    if (!zoneAvailabilityData?.zoneBusyTitle) {
      successMsg('Please provide title');
      return;
    }

    if (!zoneAvailabilityData?.zoneBusyDescription) {
      successMsg('Please provide description');
      return;
    }

    updateAZoneQuery.mutate({
      ...zoneAvailabilityData,
      zoneId: rowData._id,
      zoneAvailability: 'busy',
      zoneStatus: 'active',
    });
  };
  return (
    <ModalContainer
      onClose={onClose}
      title="Update Zone Availability"
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
                Title
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
              value: zoneAvailabilityData?.zoneBusyTitle || '',
              type: 'text',
              placeholder: 'Zone availability title',
              name: 'zoneBusyTitle',
              onChange: changeHanlder,
              // onChange: (e) => setCreatedZoneName(e.target.value),
            }}
          />
          <StyledFormField
            label={
              <Typography sx={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }} variant="h4">
                Description
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
              value: zoneAvailabilityData?.zoneBusyDescription || '',
              type: 'text',
              placeholder: 'Zone availability description',
              name: 'zoneBusyDescription',
              onChange: changeHanlder,
            }}
          />
        </Stack>
        <Box sx={{ position: 'relative' }}>
          <ZoneMap
            currentZone={rowData?.zoneName || ''}
            setPolygonArea={setPolygonArea}
            currentLocation={currentLocation}
            allZones={allZones}
            setCreatedZoneGeometry={setCreatedZoneGeometry}
            selectedLocation={selectedLocation}
            isEditable={false}
          ></ZoneMap>
          {/* {addNewZone?.isLoading && (
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
          )} */}
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
            <Box>
              <Button
                disabled={updateAZoneQuery?.isLoading}
                onClick={onSubmitHandler}
                variant="contained"
                color="primary"
              >
                Update
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </ModalContainer>
  );
}

export default AddZoneStatus;
