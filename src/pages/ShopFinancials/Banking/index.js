import { Unstable_Grid2 as Grid } from '@mui/material';
import StyledFormField from '../../../components/Form/StyledFormField';
import StyledBox from '../../../components/StyledCharts/StyledBox';
import { useGlobalContext } from '../../../context';

// eslint-disable-next-line no-unused-vars
const inputSx = {
  background: '#F6F6F6',
  borderRadius: '30px',
};

export default function Banking() {
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;
  console.log(shop);

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
              value: shop?.bank_name,
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
              value: shop.account_name,
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
              value: shop.bank_address,
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
              value: shop.address?.city,
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
              value: shop?.bank_postal_code,
              // onChange: commonChangeHandler,
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
              value: shop?.account_swift,
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
              value: shop?.account_swift,
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
              value: shop?.payout_frequency,
              sx: { ...inputSx, textTransform: 'capitalize' },
            }}
          />
        </Grid>
      </Grid>
    </StyledBox>
  );
}
