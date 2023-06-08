import { Box, Drawer, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { AddMenuButton } from '../Faq2';
import { statusTypeOptions } from '../Product1/helpers';
import AddLyxaCharge from './AddLyxaCharge';
import AddSeller from './AddSeller';
import SellerList from './SellerList';
import SellersProfile from './SellersProfile';
import { previewGenerator } from './helpers';

function SellerList2() {
  const [status, setStatus] = useState('all');

  const [searchKey, setSearchKey] = useState('');

  const [open, setOpen] = useState(false);
  const [openLyxaChargeSidebar, setOpenLyxaChargeSidebar] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  // const [isReadOnly, setIsReadOnly] = useState(false);

  const [loading, setLoading] = useState(false);
  const [currentSeller, setCurrentSeller] = useState({});
  const theme = useTheme();

  const queryClient = useQueryClient();
  const getAllSellersQuery = useQuery(
    [API_URL.ALL_SELLER, { sellerStatus: status, searchKey }],
    () =>
      AXIOS.get(API_URL.ALL_SELLER, {
        params: {
          sellerStatus: status,
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

  const addSellerQuery = useMutation((data) => AXIOS.post(API_URL.ADD_SELLER, data), {
    onSuccess: (data) => {
      if (data.status) {
        setOpen(false);
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(API_URL.ALL_SELLER);
        setLoading(false);
      } else {
        successMsg(data.message);
        setLoading(false);
      }
    },
  });

  const editSellerQuery = useMutation((data) => AXIOS.post(API_URL.EDIT_SELLER, data), {
    onSuccess: (data) => {
      if (data.status) {
        setOpen(false);
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(API_URL.ALL_SELLER);
        setLoading(false);
      } else {
        successMsg(data.message);
        setLoading(false);
      }
    },
  });

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
              return true;
            });
          }}
        />
      </Stack>

      {/* Sellers Main Section */}
      <Box marginTop="42px">
        <Box>
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
              <SellersProfile
                setAddSidebarOpen={setOpen}
                setOpenLyxaChargeSidebar={setOpenLyxaChargeSidebar}
                setIsEdit={setIsEdit}
                currentSeller={currentSeller}
              />
            </Box>
          </Stack>
        </Box>
      </Box>

      <Drawer open={open} anchor="right">
        <AddSeller
          onClose={() => {
            setOpen(false);
            setLoading(false);
          }}
          loading={loading}
          isEdit={isEdit}
          setLoading={setLoading}
          addSellerQuery={isEdit ? editSellerQuery : addSellerQuery}
          sellerData={
            isEdit
              ? {
                  ...currentSeller,
                  password: '',
                  sellerStatus: currentSeller?.status,
                  profile_photo: previewGenerator(currentSeller?.profile_photo),
                  certificate_of_incorporation: previewGenerator(currentSeller?.certificate_of_incorporation),
                  national_id: previewGenerator(currentSeller?.national_id),
                  sellerContractPaper: previewGenerator(currentSeller?.sellerContractPaper),
                }
              : {
                  sellerStatus: '',
                  sellerType: '',
                }
          }
        />
      </Drawer>

      <Drawer open={openLyxaChargeSidebar} anchor="right">
        <AddLyxaCharge
          onClose={() => {
            setOpenLyxaChargeSidebar(false);
          }}
        />
      </Drawer>
    </Box>
  );
}

export default SellerList2;
