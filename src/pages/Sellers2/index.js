import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { AddMenuButton } from '../Faq2';
import { statusTypeOptions } from '../Product1/helpers';
import SellerList from './SellerList';
import SellersProfile from './SellersProfile';

function SellerList2() {
  const [status, setStatus] = useState('all');
  // eslint-disable-next-line no-unused-vars
  const [searchKey, setSearchKey] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isEdit, setIsEdit] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isReadOnly, setIsReadOnly] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [currentSeller, setCurrentSeller] = useState({});
  const theme = useTheme();

  const getAllSellersQuery = useQuery(
    [API_URL.ALL_SELLER, { status, searchKey }],
    () =>
      AXIOS.get(API_URL.ALL_SELLER, {
        params: {
          status,
          searchKey,
        },
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          console.log(data?.data?.sellers[0]);
          setCurrentSeller(data?.data?.sellers[0]);
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  console.log('get all sellers: ', getAllSellersQuery?.data?.data?.sellers);

  return (
    <Box>
      {/* Sellers Page Top Section */}
      <PageTop
        title="Seller List"
        backTo="/settings"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />
      <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
        <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />

        <StyledFormField
          intputType="select"
          containerProps={{
            sx: { padding: '0px 0px' },
          }}
          inputProps={{
            name: 'status',
            placeholder: 'Status',
            value: status,
            items: statusTypeOptions,
            size: 'sm2',
            onChange: (e) => setStatus(e.target.value),
          }}
        />
        <AddMenuButton
          onClick={() => {
            setOpen(() => {
              setIsEdit(false);
              setIsReadOnly(false);
              return true;
            });
          }}
        />
      </Stack>

      {/* Sellers Main Section */}
      <Box marginTop="42px">
        <Typography
          variant="body2"
          sx={{
            fontWeight: '600 !important',
            color: theme.palette.text.secondary2,
            marginBottom: '26px',
            textTransform: 'uppercase',
          }}
        >
          Sellers
        </Typography>
        <Stack direction="row" gap="22px">
          {/* Sellers List --> left */}
          <Box>
            <SellerList
              data={getAllSellersQuery?.data?.data?.sellers}
              currentSeller={currentSeller}
              setCurrentSeller={setCurrentSeller}
            />
          </Box>
          {/* Seller Profile --> right */}
          <Box flex={1}>
            <SellersProfile currentSeller={currentSeller} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default SellerList2;
