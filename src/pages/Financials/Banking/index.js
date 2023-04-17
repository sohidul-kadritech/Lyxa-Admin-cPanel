import { Unstable_Grid2 as Grid } from '@mui/material';
import { useState } from 'react';
import StyledFormField from '../../../components/Form/StyledFormField';
import StyledBox from '../../../components/StyledCharts/StyledBox';
import { bankingDetailsInit } from './helpers';

// eslint-disable-next-line no-unused-vars
const inputSx = {
  background: '#F6F6F6',
  borderRadius: '30px',
};

export default function Banking() {
  const [bankingDetails, setBankingDetails] = useState({ ...bankingDetailsInit });

  const commonChangeHandler = (event) => {
    setBankingDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  console.log(bankingDetails);

  return (
    <StyledBox
      padding
      sx={{
        padding: '35px 20px',
      }}
    >
      <Grid container spacing="30px">
        <Grid xs={12} md={6}>
          {/* account name */}
          <StyledFormField
            label="Bank Account Type"
            intputType="text"
            inputProps={{
              type: 'text',
              placeholder: 'Vegan Pizza',
              name: 'accountName',
              value: bankingDetails.accountName,
              onChange: commonChangeHandler,
              sx: inputSx,
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          {/* account owner */}
          <StyledFormField
            label="Account holder's full name/name of the enterprise"
            intputType="text"
            inputProps={{
              type: 'text',
              placeholder: 'Vegan Pizza',
              name: 'accountOwner',
              value: bankingDetails.accountOwner,
              onChange: commonChangeHandler,
              sx: inputSx,
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          {/* address */}
          <StyledFormField
            label="Address"
            intputType="text"
            inputProps={{
              type: 'text',
              placeholder: 'Vegan Pizza',
              name: 'address',
              value: bankingDetails.address,
              onChange: commonChangeHandler,
              sx: inputSx,
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          {/* address */}
          <StyledFormField
            label="City"
            intputType="text"
            inputProps={{
              type: 'text',
              placeholder: 'Vegan Pizza',
              name: 'city',
              value: bankingDetails.city,
              onChange: commonChangeHandler,
              sx: inputSx,
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          {/* postal code */}
          <StyledFormField
            label="Postal Code"
            intputType="text"
            inputProps={{
              type: 'number',
              placeholder: 'XXXX',
              name: 'postalCode',
              value: bankingDetails.postalCode,
              onChange: commonChangeHandler,
              sx: inputSx,
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          {/* iban */}
          <StyledFormField
            label="IBAN"
            intputType="text"
            inputProps={{
              type: 'number',
              placeholder: 'XXXXXXXXXXXXXXXX24',
              name: 'iban',
              value: bankingDetails.iban,
              onChange: commonChangeHandler,
              sx: inputSx,
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          {/* SWIFT */}
          <StyledFormField
            label="SWIFT"
            intputType="text"
            inputProps={{
              type: 'text',
              placeholder: 'AHHJFIIUWHA',
              name: 'swift',
              value: bankingDetails.swift,
              onChange: commonChangeHandler,
              sx: inputSx,
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <StyledFormField
            label="Payout Frequency"
            intputType="text"
            inputProps={{
              type: 'text',
              placeholder: 'Weekly',
              name: 'payoutFrequency',
              value: bankingDetails.payoutFrequency,
              onChange: commonChangeHandler,
              sx: inputSx,
            }}
          />
        </Grid>
      </Grid>
    </StyledBox>
  );
}
