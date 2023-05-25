import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';
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
import RequestedAreaTable from './RequestedAreaTable';

function PointerWrapper() {
  return <LocationOnIcon />;
}
function RequestedArea() {
  const [range, setRange] = useState({ ...dateRangeInit });
  const [open, setOpen] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [isSinglePoint, setIsSinglePoint] = useState(false);
  const getRequestedAreaQuery = useQuery([API_URL.REQUESTED_AREA], () => AXIOS.get(API_URL.REQUESTED_AREA));
  const defaultProps = {
    center: {
      lat: 0,
      lng: 0,
    },
    zoom: 12,
  };
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
        <Button variant="contained" color="primary" size="small" onClick={() => setOpen(true)}>
          Map View
        </Button>
      </Stack>

      {getRequestedAreaQuery.isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box sx={{ padding: '30px 0px' }}>
          <RequestedAreaTable setIsSinglePoint={setIsSinglePoint} areas={getRequestedAreaQuery?.data?.data?.areas} />
        </Box>
      )}
      <Modal open={open} centered>
        <ModalContainer
          title="Map view"
          onClose={() => setOpen(false)}
          sx={{ padding: '40px', width: '90vw', height: '90vh', backgroundColor: '#ffffff', borderRadius: '7px' }}
        >
          <Box width="100%" height="100%" paddingBottom="40px" paddingTop="40px" sx={{ borderRadius: '7px' }}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: GOOGLE_API_KEY,
                language: 'en',
                region: 'US',
                libraries: ['places'],
              }}
              yesIWantToUseGoogleMapApiInternals
              defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
            >
              {/* <PointerWrapper lat={defaultProps.center.lat} lng={defaultProps.center.lng} /> */}

              {getRequestedAreaQuery?.data?.data?.areas.map((area, i) => (
                <PointerWrapper key={i} lat={area?.location?.coordinates[0]} lng={area?.location?.coordinates[1]} />
              ))}
            </GoogleMapReact>
          </Box>
        </ModalContainer>
      </Modal>
    </Box>
  );
}

export default RequestedArea;
