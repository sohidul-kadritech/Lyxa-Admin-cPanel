import { Stack, Typography } from '@mui/material';
import { StyledProfileBox } from './helpers';

function AddressItem({ address, isFirst, isLast }) {
  return (
    <Stack
      className={`${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`}
      sx={{
        paddingTop: '20px',
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
      <Typography variant="inherit" fontSize={13} lineHeight="20px" fontWeight={500}>
        {address?.type}
      </Typography>
      <Typography variant="inherit" fontSize={11} lineHeight="22px" fontWeight={400}>
        {address?.address}
      </Typography>
    </Stack>
  );
}

export default function Address({ addressList }) {
  return (
    <StyledProfileBox title="Addresses">
      <Stack>
        {addressList?.map((adrs, i, { length: l }) => (
          <AddressItem address={adrs} key={adrs._id} isFirst={i === 0} isLast={i === l - 1} />
        ))}
      </Stack>
    </StyledProfileBox>
  );
}
