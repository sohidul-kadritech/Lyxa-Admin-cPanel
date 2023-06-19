import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useLayoutEffect, useRef } from 'react';

function SellerInfo({ sellerName, image, shopNumber }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" gap={3}>
        {' '}
        <Avatar src={image} alt="photo" sx={{ width: 36, height: 36, textTransform: 'uppercase' }}>
          {sellerName
            ?.split(' ')
            .reduce((prev, curr) => prev + curr[0], '')
            .slice(0, 2)}
        </Avatar>
        <Typography variant="body4" flex={1}>
          {sellerName}
        </Typography>
        <Typography variant="body4" sx={{ color: '#737373' }}>
          {shopNumber}
        </Typography>
      </Stack>
    </Box>
  );
}
// eslint-disable-next-line no-unused-vars
function SellerList({ data = [], currentSeller, setCurrentSeller }) {
  console.log(data);
  const sellerRef = useRef(null);
  const sellerContainer = useRef(null);
  const theme = useTheme();
  const styleForSellerList = {
    padding: '12px 20px 10px 20px',
    borderLeft: `4px solid transparent`,
    cursor: 'pointer',
    // transition: 'all 0.2s ease-in',
    '&:hover': {
      borderLeft: `4px solid ${theme.palette.danger.main}`,
      backgroundColor: 'rgba(177, 177, 177, 0.2)',
    },
  };

  const styleForSellerListActive = {
    padding: '12px 20px 10px 20px',
    borderLeft: `4px solid ${theme.palette.danger.main}`,
    cursor: 'pointer',
    backgroundColor: 'rgba(177, 177, 177, 0.2)',
  };
  const handlePageLoad = () => {
    if (sellerRef.current) {
      sellerRef.current?.scrollIntoView({
        behavior: 'smooth',
        top: sellerContainer.current.offsetTop + 10,
      });
    }
  };
  useLayoutEffect(() => {
    handlePageLoad();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.contrastText,
        padding: '13px 0px 21px',
        width: '278px',
        borderRadius: '7px',
        border: `1px solid ${theme.palette.custom.border}`,
        maxHeight: '60vh',
        overflow: 'auto',
      }}
    >
      <Stack ref={sellerContainer}>
        {data.length > 0 ? (
          <>
            {data.map((seller, i) => (
              <Box
                id={`seller_${seller._id}`}
                key={i}
                ref={currentSeller?._id !== seller?._id ? sellerRef : null}
                sx={currentSeller?._id !== seller?._id ? styleForSellerList : styleForSellerListActive}
                onClick={() => {
                  setCurrentSeller(seller);
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

export default SellerList;
