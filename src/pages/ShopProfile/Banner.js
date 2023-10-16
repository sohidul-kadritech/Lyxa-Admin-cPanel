/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { CoverPhotoButton } from './helper';

const getMarketingLabel = (shop) => 'Double deal';

function MarketingLabelCard({ label }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        background: 'rgba(221, 91, 99, 1)',
        // backdropFilter: 'blur(10px)',
        padding: '4px 16px',
        borderTopRightRadius: '32px',
        borderBottomRightRadius: '32px',
        border: `1px solid ${theme.palette.danger.main}`,
      }}
    >
      <Typography variant="h6" color={theme?.palette.primary.contrastText}>
        {label}
      </Typography>
    </Box>
  );
}

export default function ShopBanner({ shop, loading, onDrop }) {
  return (
    <Box
      sx={{
        borderRadius: '7px',
        overflow: 'hidden',
        height: '350px',
        width: '100%',
        position: 'relative',
      }}
    >
      <img
        src={shop?.shopBanner}
        alt="Banner"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <Box sx={{ position: 'absolute', top: '10px', left: '0px', width: '350px', height: '120px' }}>
        <Stack sx={{ position: 'absolute', width: '100%', height: '120px' }} gap={2.5}>
          <MarketingLabelCard label={getMarketingLabel(shop)} />
          <MarketingLabelCard label={getMarketingLabel(shop)} />
          <MarketingLabelCard label={getMarketingLabel(shop)} />
          <MarketingLabelCard label={getMarketingLabel(shop)} />
        </Stack>
      </Box>
      <CoverPhotoButton
        loading={loading}
        onDrop={(acceptedFiles) => {
          onDrop(acceptedFiles, 'banner');
        }}
        label="Add Cover Photo"
      />
    </Box>
  );
}
