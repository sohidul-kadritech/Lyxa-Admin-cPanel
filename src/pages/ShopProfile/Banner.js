/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context';
import { CoverPhotoButton, getMarketingLabel } from './helper';

function MarketingLabelCard({ label, sx }) {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        background: '#CC274B',
        padding: '4px 8px',
        borderRadius: '10px',
        border: `1px solid #CC274B`,
        ...(sx || {}),
      }}
      direction="row"
      alignContent="center"
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
    </Stack>
  );
}

export default function ShopBanner({ shop, loading, onDrop }) {
  const { currentUser, general } = useGlobalContext();
  const currency = general?.currency;
  const { admin } = currentUser;

  const [promotion, setPromotion] = useState(getMarketingLabel(shop, general?.appSetting));

  useEffect(() => {
    setPromotion(getMarketingLabel(shop, general?.appSetting));
    console.log({ shop });
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
      <Box sx={{ position: 'absolute', top: '10px', left: '10px', minWidth: '350px', minHeight: '120px' }}>
        <Stack sx={{ position: 'relative' }} gap={2.5} alignItems="flex-start">
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
