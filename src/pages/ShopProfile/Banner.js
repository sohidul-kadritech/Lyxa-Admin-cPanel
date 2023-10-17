/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { CoverPhotoButton, getMarketingLabel } from './helper';

function MarketingLabelCard({ label }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: '#CC274B',
        padding: '4px 8px',
        borderRadius: '10px',
        border: `1px solid #CC274B`,
      }}
    >
      <Typography
        variant="body"
        lineHeight="20px"
        fontSize="14px"
        fontWeight={400}
        color={theme?.palette.primary.contrastText}
      >
        {label}
      </Typography>
    </Box>
  );
}

export default function ShopBanner({ shop, loading, onDrop }) {
  const [promotion, setPromotion] = useState(getMarketingLabel(shop));

  useEffect(() => {
    setPromotion(getMarketingLabel(shop));
  }, [shop?.marketings]);

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
      <Box sx={{ position: 'absolute', top: '10px', left: '10px', minWidth: '450px', height: '120px' }}>
        <Stack sx={{ position: 'absolute', width: '100%', height: '120px' }} gap={2.5}>
          {promotion?.percentage?.isActive && <MarketingLabelCard label={promotion?.percentage?.label} />}
          {promotion?.double_menu?.isActive && <MarketingLabelCard label={promotion?.double_menu?.label} />}
          {promotion?.featured?.isActive && <MarketingLabelCard label={promotion?.featured?.label} />}
          {promotion?.free_delivery?.isActive && <MarketingLabelCard label={promotion?.free_delivery?.label} />}
          {promotion?.reward?.isActive && <MarketingLabelCard label={promotion?.reward?.label} />}
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
