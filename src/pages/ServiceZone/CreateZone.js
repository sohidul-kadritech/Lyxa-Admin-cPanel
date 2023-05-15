import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import StyledFormField from '../../components/Form/StyledFormField';
import ModalContainer from './ModalContainer';
import ZoneMap from './ZoneMap';

// eslint-disable-next-line prettier/prettier, no-unused-vars
const fieldContainerSx = {
  padding: '14px 0px 23px 0',
  flex: '1',
};
function CreateZone({ onClose }) {
  const theme = useTheme();
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
              type: 'text',
              name: 'name',
            }}
          />
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
              type: 'text',
              name: 'name',
            }}
          />
        </Stack>
        <Box>
          <ZoneMap></ZoneMap>
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
              <Button variant="contained" color="primary">
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
