import { Stack, Typography } from '@mui/material';

export default function AddressItem({ address, isFirst, isLast }) {
  return (
    <Stack
      className={`${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`}
      sx={{
        paddingTop: '11px',
        paddingBottom: '11px',
        borderBottom: '1px solid',
        borderBottomColor: 'custom.border',

        '&.first': {
          paddingTop: '4px',
        },

        '&.last': {
          borderBottom: 'none',
          paddingBottom: '0',
        },
      }}
    >
      {/* {address?.primary && ( */}
      <Typography variant="inherit" fontSize={13} lineHeight="20px" fontWeight={500}>
        {address?.addressLabel}
      </Typography>
      <Typography variant="inherit" fontSize={11} lineHeight="22px" fontWeight={400}>
        {address?.address}
      </Typography>
    </Stack>
  );
}
