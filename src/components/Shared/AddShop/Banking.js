import { Box } from '@mui/material';
import StyledFormField from '../../Form/StyledFormField';

export default function ShopBanking({ shop, onChange }) {
  return (
    <Box>
      {/* bank name */}
      <StyledFormField
        label="Bank Name *"
        intputType="text"
        inputProps={{
          value: shop?.bank_name,
          type: 'text',
          name: 'bank_name',
          onChange,
        }}
      />
      {/* Account Holder’s Full Name/Name of Enterprise  */}
      <StyledFormField
        label="Account Holder’s Full Name/Name of Enterprise "
        intputType="text"
        containerProps={{
          sx: {
            padding: '14px 0px 10px 0',
          },
        }}
        inputProps={{
          value: shop?.account_name,
          type: 'text',
          name: 'account_name',
          onChange,
          autoComplete: 'off',
        }}
      />
      {/* Address */}
      <StyledFormField
        label="Address *"
        intputType="text"
        inputProps={{
          value: shop?.bank_address,
          type: 'text',
          name: 'bank_address',
          onChange,
        }}
      />
      {/* postal code */}
      <StyledFormField
        label="Postal Code *"
        intputType="text"
        inputProps={{
          value: shop?.bank_postal_code,
          type: 'text',
          name: 'bank_postal_code',
          onChange,
        }}
      />
      {/* IBAN */}
      <StyledFormField
        label="Account Nr / IBAN *"
        intputType="text"
        inputProps={{
          value: shop?.account_number,
          type: 'text',
          name: 'account_number',
          onChange,
        }}
      />
      {/* zip code */}
      <StyledFormField
        label="SWIFT *"
        intputType="text"
        inputProps={{
          value: shop?.account_swift,
          type: 'text',
          name: 'account_swift',
          onChange,
        }}
      />
    </Box>
  );
}
