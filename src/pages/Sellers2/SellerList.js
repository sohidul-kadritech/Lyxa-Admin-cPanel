/* eslint-disable no-unused-vars */
import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';

export function SellerInfo({ sellerName, image, shopNumber }) {
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
function SellerList({ data = [], currentSeller, setCurrentSeller, loading = true }) {
  const theme = useTheme();
  const params = useParams();
  const [hasScrolled, setHasScrolled] = useState(false);

  const history = useHistory();

  const sellerRef = useRef(null);
  const sellerContainer = useRef(null);

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
      // console.log('current element paisi', sellerRef.current);
      sellerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      // console.log('current element painai', sellerRef.current);
    }
  };

  const scrollToTop = () => {
    if (sellerRef.current) {
      setHasScrolled(true);

      sellerContainer?.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });

      sellerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  useEffect(() => {
    if (sellerRef.current && !hasScrolled && !loading) {
      setTimeout(() => {
        scrollToTop();
      }, 650);
    }
  });

  return (
    <Box
      ref={sellerContainer}
      sx={{
        backgroundColor: theme.palette.primary.contrastText,
        padding: '13px 0px 21px',
        width: '278px',
        borderRadius: '7px',
        border: `1px solid ${theme.palette.custom.border}`,
        maxHeight: '500px',
        overflow: 'scroll',
      }}
    >
      <Stack>
        {data.length > 0 ? (
          <>
            {data.map((seller, i) => (
              <Box
                id={`seller_${seller._id}`}
                key={i}
                ref={currentSeller?._id === seller?._id ? sellerRef : undefined}
                sx={currentSeller?._id !== seller?._id ? styleForSellerList : styleForSellerListActive}
                onClick={() => {
                  setCurrentSeller(seller);
                }}
              >
                <SellerInfo
                  sellerName={seller?.company_name}
                  image={seller?.profile_photo}
                  shopNumber={seller?.shops?.length > 0 ? seller?.shops?.length : 0}
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
