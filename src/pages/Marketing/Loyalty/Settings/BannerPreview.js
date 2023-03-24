// third party
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { Box, Button, Skeleton, Stack, Typography, useTheme } from '@mui/material';

export default function BannerPreview({ banner, logo, name }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          overflow: 'hidden',
          borderRadius: '8px',
        }}
      >
        <img
          src={banner}
          alt="banner"
          style={{
            width: '100%',
            maxWidth: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>
      <Stack direction="row" gap="10px" alignItems="baseline" pt={2.5}>
        {/* logo */}
        <Box
          sx={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShirnk: 0,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: '100%',
              maxWidth: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
        {/* title */}
        <Box
          sx={{
            flex: 1,
            pb: '10px',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" pb={2}>
            <Typography variant="body2" fontWeight={500}>
              {name}
            </Typography>
            <Skeleton width={10} height={10} />
          </Stack>
          <Skeleton height={15} />
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" gap="6px">
        <Button
          startIcon={<CardGiftcardIcon />}
          disableRipple
          sx={{
            background: '#EFF8FA',
            color: theme.palette.secondary.main,
            padding: '4px 9px',
            fontWeight: '500',
            fontSize: '10px',
            lineHeight: 1,
            // lineHeight: '20px',
            '& .MuiSvgIcon-root': {
              fontSize: '14px',
            },

            '&:hover': { background: '#EFF8FA', color: theme.palette.secondary.main },
          }}
        >
          Rewards
        </Button>
        <Skeleton
          height={15}
          sx={{
            flex: 1,
          }}
        />
        <Skeleton
          height={15}
          sx={{
            flex: 1,
          }}
        />
        <Skeleton
          height={15}
          sx={{
            flex: 1,
          }}
        />
        {/* <Skeleton height={15} /> */}
      </Stack>
    </Box>
  );
}
