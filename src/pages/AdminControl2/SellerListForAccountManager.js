import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import ConfirmModal from '../../components/Common/ConfirmModal';
import { SellerInfo } from '../Sellers2/SellerList';
import { getActiveSellers, isItActiveOrNot } from './helpers';

function SellerListForAccountManager({ data, setSellers, sellers = [] }) {
  const theme = useTheme();

  const [isConfirm, setIsConfirm] = useState(false);
  const [tempSellerId, setTempSellerId] = useState('');

  const styleForSellerList = {
    padding: '12px 20px 10px 20px',
    borderLeft: `4px solid transparent`,
    cursor: 'pointer',
    transition: 'all 0.3s linear',
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
    transition: 'all 0.3s linear',
  };

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        padding: '13px 0px 21px',
        borderRadius: '7px',
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
                sx={!isItActiveOrNot(seller?._id, sellers) ? styleForSellerList : styleForSellerListActive}
                onClick={() => {
                  setTempSellerId(seller._id);
                  setIsConfirm(true);
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
      <ConfirmModal
        message={`Are you sure you want to  ${
          !isItActiveOrNot(tempSellerId, sellers) ? 'assign' : 'remove'
        } this seller?`}
        isOpen={isConfirm}
        onCancel={() => {
          setIsConfirm(false);
        }}
        onConfirm={() => {
          setSellers(getActiveSellers(tempSellerId, sellers));
          setIsConfirm(false);
        }}
      />
    </Box>
  );
}

export default SellerListForAccountManager;
