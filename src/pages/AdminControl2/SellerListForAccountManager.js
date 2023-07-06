import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { SellerInfo } from '../Sellers2/SellerList';
import { getActiveSellers, isItActiveOrNot } from './helpers';

function SellerListForAccountManager({ data, sellers, setSellers }) {
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars

  const styleForSellerList = {
    padding: '12px 20px 10px 20px',
    borderLeft: `4px solid transparent`,
    cursor: 'pointer',
    transition: 'all 0.3s linear',
    // transition: 'all 0.2s ease-in',
    '&:hover': {
      borderLeft: `4px solid ${theme.palette.danger.main}`,
      backgroundColor: 'rgba(177, 177, 177, 0.2)',
    },
  };

  // eslint-disable-next-line no-unused-vars
  const styleForSellerListActive = {
    padding: '12px 20px 10px 20px',
    borderLeft: `4px solid ${theme.palette.danger.main}`,
    cursor: 'pointer',
    backgroundColor: 'rgba(177, 177, 177, 0.2)',
    transition: 'all 0.3s linear',
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.contrastText,
        padding: '13px 0px 21px',
        borderRadius: '7px',
        // border: `1px solid ${theme.palette.custom.border}`,
        maxHeight: '550px',
        overflow: 'scroll',
      }}
    >
      <Stack>
        {data.length > 0 ? (
          <>
            {data.map((seller, i) => (
              <Box
                id={`seller_${seller._id}`}
                className="sellerItems"
                key={i}
                // ref={currentSeller?._id === seller?._id ? sellerRef : undefined}
                sx={!isItActiveOrNot(seller?._id, sellers) ? styleForSellerList : styleForSellerListActive}
                // sx={styleForSellerList}
                onClick={() => {
                  setSellers(getActiveSellers(seller._id, sellers));
                }}
              >
                <SellerInfo
                  sellerName={seller?.company_name}
                  image={seller?.profile_photo}
                  shopNumber={seller?.shops.length > 0 ? seller?.shops.length : 0}
                />
              </Box>
            ))}
          </>
        ) : (
          <Box sx={styleForSellerList}>
            <Typography variant="h5" sx={{ fontWeight: '500 !important' }}>
              No sellers found
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default SellerListForAccountManager;
