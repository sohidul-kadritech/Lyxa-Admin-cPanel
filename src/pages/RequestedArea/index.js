import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box, Button, Modal, Stack, useTheme } from '@mui/material';
import GoogleMapReact from 'google-map-react';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { GOOGLE_API_KEY } from '../../assets/staticData';
import PageTop from '../../components/Common/PageTop';
import DateRange from '../../components/StyledCharts/DateRange';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { dateRangeInit } from '../Faq2/helpers';
import ModalContainer from '../ServiceZone/ModalContainer';
import RequestedAreaSkeleton from './RequestedAreaSkeleton';
import RequestedAreaTable from './RequestedAreaTable';

function PointerWrapper() {
  return <LocationOnIcon style={{ transform: 'scale(1.5)' }} />;
}
function RequestedArea() {
  const [range, setRange] = useState({ ...dateRangeInit });
  // eslint-disable-next-line no-unused-vars
  const [currentArea, setCurrentArea] = useState([
    {
      location: {
        coordinates: [0, 0],
      },
    },
  ]);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [zoemLevel, setZoomLevel] = useState(12);

  // eslint-disable-next-line no-unused-vars
  const [isSinglePoint, setIsSinglePoint] = useState(false);
  const getRequestedAreaQuery = useQuery([API_URL.REQUESTED_AREA, { startDate: range.start, endDate: range.end }], () =>
    AXIOS.get(API_URL.REQUESTED_AREA, {
      params: { startDate: range.start, endDate: range.end },
      // eslint-disable-next-line prettier/prettier
    }),
  );

  return (
    <Box>
      <PageTop
        title="New Area Requested"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      <Stack flexDirection="row" justifyContent="flex-end" gap="20px">
        <DateRange range={range} setRange={setRange} />
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() =>
            setOpen(() => {
              setZoomLevel(0);
              setCurrentArea(
                getRequestedAreaQuery?.data?.data?.areas || [
                  {
                    location: {
                      coordinates: [0, 0],
                    },
                  },
                  // eslint-disable-next-line prettier/prettier
                ],
              );
              return true;
            })
          }
        >
          Map View
        </Button>
      </Stack>

      {getRequestedAreaQuery.isLoading ? (
        <RequestedAreaSkeleton />
      ) : (
        <Box
          sx={{
            padding: '20px 20px',
            marginTop: '30px',
            overflow: 'auto',
            height: '70vh',
            maxHeight: '700px',
            borderRadius: '7px',
            border: `1px solid ${theme.palette.custom.border}`,
          }}
        >
          <RequestedAreaTable
            setOpen={setOpen}
            setCurrentArea={setCurrentArea}
            setIsSinglePoint={setIsSinglePoint}
            areas={getRequestedAreaQuery?.data?.data?.areas}
            setZoomLevel={setZoomLevel}
          />
        </Box>
      )}
      <Modal open={open} centered>
        <ModalContainer
          title="Map view"
          onClose={() => setOpen(false)}
          sx={{
            width: '96vw',
            height: '96vh',
            margin: '2vh 2vw',
            padding: '36px',
            overflow: 'hidden',
            backgroundColor: theme.palette.primary.contrastText,
            borderRadius: '10px',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              padding: '40px 0px',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '7px',
                // backgroundColor: 'red',
                overflow: 'hidden',
              }}
            >
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: GOOGLE_API_KEY,
                  language: 'en',
                  region: 'US',
                  libraries: ['places'],
                }}
                // style={{ borderRadius: '7px' }}
                yesIWantToUseGoogleMapApiInternals
                defaultCenter={{
                  lat: currentArea[0]?.location?.coordinates[1],
                  lng: currentArea[0]?.location?.coordinates[0],
                }}
                defaultZoom={zoemLevel}
              >
                {currentArea.map((area, i) => (
                  <PointerWrapper key={i} lat={area?.location?.coordinates[1]} lng={area?.location?.coordinates[0]} />
                ))}
              </GoogleMapReact>
            </Box>
          </Box>
        </ModalContainer>
      </Modal>
    </Box>
  );
}

export default RequestedArea;
