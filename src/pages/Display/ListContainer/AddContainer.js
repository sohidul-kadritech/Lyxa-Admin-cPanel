// third party
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import CloseButton from '../../../components/Common/CloseButton';
import StyledFormField from '../../../components/Form/StyledFormField';

const fieldContainerSx = {
  padding: '22px 0',
  borderBottom: '1px solid #EEEEEE',
};

const selectProps = {
  multiple: true,
  getOptionLabel: (option) => option?.name || 'None',
  isOptionEqualToValue: (option, value) => option?._id === value?._id,
  label: 'None',
  sx: {
    '& .MuiFormControl-root': {
      minWidth: '100px',
    },
  },
};

// project import
export default function AddContainer({ deals, onClose }) {
  const theme = useTheme();
  const [sDeals, setSDeals] = useState([]);

  return (
    <Box
      sx={{
        minWidth: '400px',
        maxWidth: '400px',
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
          disableRipple
          onClick={onClose}
          sx={{
            color: theme.palette.text.primary,
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
          label="Photo"
          intputType="file"
          containerProps={{
            sx: fieldContainerSx,
          }}
        />
        <StyledFormField
          label="Deals"
          intputType="autocomplete"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            ...selectProps,
            options: deals,
            value: sDeals,
            onChange: (e, v) => {
              setSDeals(v.map((item) => item));
            },
          }}
        />
        <StyledFormField
          label="Tags"
          intputType="autocomplete"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            ...selectProps,
            options: deals,
            value: sDeals,
            onChange: (e, v) => {
              setSDeals(v.map((item) => item));
            },
          }}
        />
        <StyledFormField
          label="Restaurant"
          intputType="autocomplete"
          containerProps={{
            sx: { ...fieldContainerSx, borderBottom: '0' },
          }}
          inputProps={{
            ...selectProps,
            options: deals,
            value: sDeals,
            onChange: (e, v) => {
              setSDeals(v.map((item) => item));
            },
          }}
        />
      </Box>
    </Box>
  );
}
