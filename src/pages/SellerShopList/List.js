import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import { useGlobalContext } from '../../context';

function StyledShopButton({ shop, isActiveShop, onSelect, disabled }) {
  const theme = useTheme();

  return (
    <Stack
      onClick={() => {
        onSelect(shop);
      }}
      direction="row"
      alignItems="center"
      gap={3}
      className={`${isActiveShop ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      sx={{
        border: '1px solid #EEEEEE',
        borderRadius: '7px',
        padding: '15px 12px',
        transition: 'all 150ms ease',
        cursor: 'pointer',
        width: '250px',
        flex: '0 0 auto',

        '&:hover': {
          border: `1px solid ${theme.palette.primary.main}`,
        },

        '&.active': {
          border: `1px solid ${theme.palette.primary.main}`,
        },

        '&.disabled': {
          cursor: 'not-allowed',
          opacity: 0.5,
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background:
            shop?.shopStatus === 'inactive'
              ? '#F89C5B'
              : shop?.liveStatus === 'online'
              ? theme?.palette.success.main
              : theme?.palette.error.main,
        }}
      ></Box>
      <Avatar src={shop?.shopLogo} alt="photo" sx={{ width: 36, height: 36, textTransform: 'uppercase' }}>
        {shop?.shopName
          ?.split(' ')
          .reduce((prev, curr) => prev + curr[0], '')
          .slice(0, 2)}
      </Avatar>
      <Typography variant="body4">{shop?.shopName}</Typography>
    </Stack>
  );
}

export default function List({ shops = [], loading }) {
  const { currentUser, dispatchCurrentUser } = useGlobalContext();
  const { shop: currentShop } = currentUser;
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      sx={{
        gap: '15px',
        flexWrap: 'wrap',
      }}
    >
      {shops.map((shop) => (
        <StyledShopButton
          disabled={loading}
          key={shop?._id}
          shop={shop}
          isActiveShop={currentShop?._id === shop?._id}
          onSelect={(shop) => {
            dispatchCurrentUser({ type: 'shop', payload: { shop } });
          }}
        />
      ))}
      {!shops.length && (
        <Stack
          sx={{ height: '68px', background: theme.palette.custom.border, px: 5 }}
          alignItems="center"
          justifyContent="center"
          borderRadius={8}
          flex={1}
        >
          <Typography variant="body4">No shop found</Typography>
        </Stack>
      )}
    </Stack>
  );
}
