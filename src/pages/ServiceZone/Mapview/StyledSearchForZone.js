/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { LocationOnOutlined } from '@mui/icons-material';
import { Box, Stack, Typography, debounce, useTheme } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import StyledInput from '../../../components/Styled/StyledInput';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';

function StyledSearchForZone({ onClick }) {
  const theme = useTheme();
  const [zoneName, setZoneName] = useState('');
  const [open, setOpen] = useState(false);
  const [searchedZone, setSearchedZone] = useState([]);

  // getAllZones
  const getAllZones = useMutation(
    [API_URL.GET_ALL_ZONE],
    () =>
      AXIOS.get(API_URL.GET_ALL_ZONE, {
        params: {
          searchKey: zoneName,
          pageSize: 10,
        },
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          const tempZones = data?.data?.zones || [];
          setSearchedZone(tempZones);
        }
      },
    },
  );

  const getZones = useMemo(
    () =>
      debounce((value) => {
        setZoneName(value);
        setOpen(true);
        getAllZones.mutate();
      }, 50),
    [],
  );

  return (
    <Stack mt={2.5} sx={{ position: 'relative' }}>
      <Typography sx={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px', pb: '8px' }} variant="h4">
        Search With Zone
      </Typography>
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
        //   {...getInputProps()}
        fullWidth
        type="text"
        value={zoneName}
        onChange={(e) => {
          getZones(e.target.value);
        }}
      />
      <Box
        sx={{
          fontSize: '14px',
          width: '100%',
          position: 'absolute',
          top: '65px',
          backgroundColor: '#F6F8FA',
          borderRadius: '8px',
          zIndex: '99999',
          overflow: 'hidden',
        }}
      >
        {getAllZones?.isLoading && <Box sx={{ padding: '6px 16px' }}>Loading...</Box>}

        {open && !getAllZones?.isLoading && (
          <>
            {searchedZone.map((zone, i) => (
              <Box
                key={i}
                onClick={() => {
                  if (onClick) onClick(zone);
                  setOpen(false);
                  setZoneName(zone?.zoneName);
                }}
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
                <LocationOnOutlined /> <Typography variant="body2"> {zone?.zoneName}</Typography>
                {/* {suggestion.description} */}
              </Box>
            ))}

            {!searchedZone.length && <Box sx={{ padding: '6px 16px' }}>No zone found</Box>}
          </>
        )}
      </Box>
    </Stack>
  );
}

export default StyledSearchForZone;
