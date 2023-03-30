// third party
import { useTheme } from '@emotion/react';
import { Box, Stack, Typography } from '@mui/material';
import CloseButton from '../../components/Common/CloseButton';
import StyledFormField from '../../components/Form/StyledFormField';

const fieldContainerSx = {
  padding: '22px 0',
  borderBottom: '1px solid #EEEEEE',
};

// project import
export default function AddContainer() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minWidth: '400px',
        paddingLeft: '16px',
        paddingRight: '20px',
        paddingTop: '95px',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: '19px',
            lineHeight: '23px',
          }}
        >
          Create New Container
        </Typography>
        <CloseButton
          sx={{
            color: theme.palette.text.heading,
          }}
        />
      </Stack>
      <Box>
        <StyledFormField
          label="Name"
          intputType="text"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            type: 'text',
          }}
        />
        <StyledFormField
          label="Name"
          intputType="text"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            type: 'text',
          }}
        />
        <StyledFormField
          label="Name"
          intputType="text"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            type: 'text',
          }}
        />
      </Box>
    </Box>
  );
}
