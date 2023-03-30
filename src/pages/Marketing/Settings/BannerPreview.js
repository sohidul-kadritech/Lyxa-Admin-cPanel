// third party
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { ReactComponent as Tag } from '../../../assets/icons/tag.svg';
import { ReactComponent as TagBg } from '../../../assets/icons/tagBg.svg';

function Skeleton({ sx, ...props }) {
  return (
    <Box
      sx={{
        background: '#F6F6F6',
        display: 'block',
        borderRadius: '3px',
        ...(sx || {}),
      }}
      {...props}
    ></Box>
  );
}

export default function BannerPreview({ shopBanner, shopLogo, shopName, marketingType }) {
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
          position: 'relative',
        }}
      >
        <img
          src={shopBanner}
          alt="banner"
          style={{
            width: '100%',
            maxWidth: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {(marketingType === 'percentage' || marketingType === 'double_menu') && (
          <Box
            sx={{
              position: 'absolute',
              left: '5px',
              top: '3px',
            }}
          >
            <TagBg />
            <Stack
              direction="row"
              alignItems="center"
              gap="3px"
              sx={{
                marginTop: '-23px',
                paddingLeft: '8px',
              }}
            >
              <Tag />
              <Typography
                sx={{
                  fontSize: '10px!important',
                  fontWeight: 400,
                  lineHeight: '14px',
                  color: '#6F6F6F',
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  {marketingType === 'double_menu' ? '2x Deal ' : '50% off '}
                </span>
                on selected items
              </Typography>
            </Stack>
          </Box>
        )}
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
            src={shopLogo}
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
              {shopName}
            </Typography>
            <Skeleton width={10} height={10} />
          </Stack>
          <Skeleton height={15} />
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" gap="6px">
        {marketingType === 'reward' ? (
          <Button
            startIcon={<CardGiftcardIcon />}
            disableRipple
            sx={{
              background: '#EFF8FA',
              color: '#15BFCA',
              padding: '4px 9px',
              fontWeight: '500',
              fontSize: '10px',
              lineHeight: 1,
              borderRadius: '3px',

              '& .MuiSvgIcon-root': {
                fontSize: '14px',
              },

              '&:hover': { background: '#EFF8FA', color: theme.palette.secondary.main },
            }}
          >
            Rewards
          </Button>
        ) : (
          <Skeleton
            height={15}
            sx={{
              flex: 1,
            }}
          />
        )}
        {marketingType === 'free_delivery' ? (
          <Button
            startIcon={<DeliveryDiningIcon />}
            disableRipple
            sx={{
              background: 'rgba(91, 189, 78, 0.07)',
              color: '#5BBD4E',
              padding: '4px 9px',
              fontWeight: '500',
              fontSize: '10px',
              lineHeight: 1,
              borderRadius: '3px',

              '& .MuiSvgIcon-root': {
                fontSize: '14px',
              },

              '&:hover': { background: 'rgba(91, 189, 78, 0.07)', color: theme.palette.secondary.main },
            }}
          >
            Free
          </Button>
        ) : (
          <Skeleton
            height={15}
            sx={{
              flex: 1,
            }}
          />
        )}
        {/* <Skeleton
          height={15}
          sx={{
            flex: 1,
          }}
        /> */}
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
      </Stack>
    </Box>
  );
}
