import { LocationOnOutlined } from '@mui/icons-material';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import React, { useState } from 'react';
import StyledFormField from '../../components/Form/StyledFormField';
import ModalContainer from './ModalContainer';
import ZoneMap from './ZoneMap';
import { validateEditedData } from './helper';

// eslint-disable-next-line prettier/prettier, no-unused-vars
const fieldContainerSx = {
  padding: '14px 0px 23px 0',
  flex: '1',
};

function CreateZone({ onClose, addNewZone, allZones, ...props }) {
  const theme = useTheme();

  // const { account_type } = useSelector((store) => store?.Login?.admin);
  // eslint-disable-next-line no-unused-vars
  const [searchLoading, setSearchLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [createdZoneGeometry, setCreatedZoneGeometry] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [createdZoneStatus, setCreatedZoneStatus] = useState('active');
  // eslint-disable-next-line no-unused-vars
  const [createdZoneName, setCreatedZoneName] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [createdZoneArea, setCreatedZoneArea] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [searchResult, setSearchResult] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedLocation, setSelectedLoaction] = useState({ lat: 23.8103, lon: 90.4125 });
  // eslint-disable-next-line no-unused-vars
  console.log('createdZone', createdZoneName);

  // eslint-disable-next-line no-unused-vars
  console.log('data: ', props?.rowData);
  // eslint-disable-next-line prettier/prettier, no-unused-vars
  const createNewZone = () => {
    const data = {
      zoneName: createdZoneName,
      zoneArea: createdZoneArea,
      zoneGeometry: {
        type: 'Polygon',
        coordinates: [createdZoneGeometry],
      },
      zoneStatus: createdZoneStatus,
    };
    if (validateEditedData(data)) {
      addNewZone.mutate(data);
      // const apiurl = account_type === 'admin' ? API_URL.GET_ALL_ZONE : '';

      // getAllZones.refetch();
    }
    console.log(data);
  };

  const mapSearchResult = async (e) => {
    setSearchLoading(true);
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: e.target.value });
    setSearchLoading(false);
    setSearchResult(e.target.value ? results : []);
    console.log('result: ', results);
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
              defaultValue: props?.rowData?.zoneName || '',
              type: 'text',
              name: 'zoneName',
              onChange: (e) => setCreatedZoneName(e.target.value),
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
                defaultValue: props?.rowData?.zoneArea || '',
                type: 'text',
                name: 'zoneArea',
                onChange: mapSearchResult,
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
            allZones={allZones}
            setCreatedZoneGeometry={setCreatedZoneGeometry}
            selectedLocation={selectedLocation}
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
                20m
              </Typography>
            </Box>
            <Box>
              <Button onClick={createNewZone} variant="contained" color="primary">
                Save Zone
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </ModalContainer>
  );
}

export default CreateZone;
