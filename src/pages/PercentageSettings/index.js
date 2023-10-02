/* eslint-disable prettier/prettier */
import { Box, Button, Drawer, Stack, Tab, Tabs, Typography } from '@mui/material';
import { isNumber } from 'lodash';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ConfirmModal from '../../components/Common/ConfirmModal';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import IncrementDecrementButton from '../ReferFriend/IncrementDecrementButton';
import AddRange from './AddRange';
import PercentageTable from './PercentageTable';
import RangeTable from './RangeTable';
import {
  discountTypeOptions,
  generatedDataForRange,
  generatedDataForRangeDelete,
  validateGlobalCharge,
} from './helpers';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '/settings',
  },
  {
    label: 'Percentage Settings',
    to: '#',
  },
];

const indexToTypeTracker = {
  0: 'global',
  1: 'seller',
  2: 'delivery',
  3: 'butler',
};

function PercentageSettings2() {
  const [currentTab, setCurrentTab] = useState(0);
  const [globalChargeType, setGlobalChargeType] = useState('percentage');
  const [globalCharge, setGlobalCharge] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [editedData, setEditedData] = useState({});

  const [isConfirm, setIsConfirm] = useState(false);

  const [selectedRange, setSelectedRange] = useState({});

  const [type, setType] = useState('global');

  const [hasChanged, setHasChanged] = useState(true);

  const [open, setOpen] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [isEdit, setIsEdit] = useState(false);

  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const queryClient = useQueryClient();

  const incrementHandler = (setValue) => {
    setValue((prev) => {
      if (isNumber(parseInt(prev, 10)) && prev !== '') return parseInt(prev, 10) + 1;
      if (prev === '') return 1;
      return prev;
    });
  };
  // Handle decremented by one
  const decrementHandler = (setValue) => {
    setValue((prev) => {
      if (isNumber(parseInt(prev, 10)) && prev !== '') return parseInt(prev, 10) - 1;
      if (prev === '' || prev <= 0) return 0;
      return prev;
    });
  };

  const getRelatedSellerQuery = useQuery(
    [API_URL.GET_SPECIAL_DROP_CHARGE],
    () => AXIOS.get(API_URL.GET_SPECIAL_DROP_CHARGE),
    {
      onSuccess: (data) => {
        if (data.status) {
          console.log('====> seller', data?.data?.sellers);
        } else {
          console.log('=====> msg: ', data.message);
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );
  // eslint-disable-next-line no-unused-vars
  const getGlobalDropCharge = useQuery([API_URL.GET_DELIVERY_FEE], () => AXIOS.get(API_URL.GET_DELIVERY_FEE), {
    onSuccess: (data) => {
      if (data.status) {
        console.log('====>', data?.data?.charge);
        setGlobalCharge(data?.data?.charge?.dropPercentage ? data?.data?.charge?.dropPercentage : 0);
        setGlobalChargeType(
          data?.data?.charge?.dropPercentageType ? data?.data?.charge?.dropPercentageType : 'percentage',
        );
      } else {
        console.log('=====> msg: ', data.message);
      }
    },
  });

  const setGlobalDropCharge = useMutation((data) => AXIOS.post(API_URL.SET_DELIVERY_FEE, data), {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries(API_URL.GET_DELIVERY_FEE);
        successMsg(data.message, 'success');
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  // eslint-disable-next-line no-unused-vars
  const deleteSellerRange = useMutation((data) => AXIOS.post(API_URL.DELETE_SELLER_SPECIAL_DROP_CHARGE, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(API_URL.GET_SPECIAL_DROP_CHARGE);
        setIsConfirmDelete(false);
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  const addDeliveryCutRange = useMutation((data) => AXIOS.post(API_URL.UPDATE_DELIVERY_CUT, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(API_URL.GET_DELIVERY_FEE);
        setOpen(false);
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  const addDeliveryCutRangeForButler = useMutation((data) => AXIOS.post(API_URL.UPDATE_BULTER_DELIVERY_CUT, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(API_URL.GET_DELIVERY_FEE);
        setOpen(false);
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  const addRangeHandler = (newRange) => {
    // console.log('newRange:', newRange);
    const allData =
      indexToTypeTracker[currentTab] === 'delivery'
        ? getGlobalDropCharge?.data?.data?.charge?.deliveryRange
        : getGlobalDropCharge?.data?.data?.charge?.deliveryRangeButler;

    const generatedData = generatedDataForRange(newRange, allData, indexToTypeTracker[currentTab], isEdit);

    if (generatedData && generatedData?.deliveryRange) {
      addDeliveryCutRange.mutate(generatedData);
      return;
    }
    if (generatedData && generatedData?.deliveryRangeButler) {
      addDeliveryCutRangeForButler.mutate(generatedData);
    }
  };

  const callDeleteRange = () => {
    // console.log('newRange:', newRange);
    console.log(indexToTypeTracker[currentTab], 'current tab:');
    const allData =
      indexToTypeTracker[currentTab] === 'delivery'
        ? getGlobalDropCharge?.data?.data?.charge?.deliveryRange
        : getGlobalDropCharge?.data?.data?.charge?.deliveryRangeButler;

    const generatedData = generatedDataForRangeDelete(selectedRange, allData, indexToTypeTracker[currentTab]);

    if (indexToTypeTracker[currentTab] !== 'seller' && generatedData && generatedData?.deliveryRange) {
      addDeliveryCutRange.mutate(generatedData);
      console.log('newRange for normal', generatedData);
      return;
    }
    if (indexToTypeTracker[currentTab] !== 'seller' && generatedData && generatedData?.deliveryRangeButler) {
      console.log('newRange for butler', generatedData);
      addDeliveryCutRangeForButler.mutate(generatedData);
      return;
    }

    if (indexToTypeTracker[currentTab] === 'seller') {
      deleteSellerRange.mutate({ sellerId: selectedRange._id });
    }
  };

  const updateGlobarCharge = () => {
    if (hasChanged) {
      const isValid = validateGlobalCharge(getGlobalDropCharge?.data?.data?.charge, { globalCharge, globalChargeType });
      if (isValid) {
        setGlobalDropCharge.mutate({ dropPercentage: globalCharge, dropPercentageType: globalChargeType });
        return;
      }
    }
    successMsg('Please make a change first!');
  };

  return (
    <Box>
      <PageTop
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        backTo="/settings"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
          setType(indexToTypeTracker[newValue]);
        }}
      >
        <Tab label="Global"></Tab>
        <Tab label="Seller"></Tab>
        <Tab label="Delivery"></Tab>
        <Tab label="Butler"></Tab>
      </Tabs>

      {type === 'global' ? (
        <Box sx={{ marginTop: '30px' }}>
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            sx={{ width: { sm: '100%', md: '80%', lg: '60%' } }}
          >
            <Stack>
              <Typography variant="h6" sx={{ fontWeight: '600' }}>
                Lyxa charge type
              </Typography>
              <StyledFormField
                intputType="select"
                inputProps={{
                  name: 'discountType',
                  placeholder: 'Lyxa charge type',
                  value: globalChargeType || '',
                  items: discountTypeOptions,
                  //   items: categories,
                  readOnly: true,
                  onChange: (e) => {
                    setGlobalCharge(0);
                    setHasChanged(true);
                    setGlobalChargeType(() => e.target.value);
                  },
                }}
              />
            </Stack>

            <Stack>
              <Typography variant="h6" sx={{ fontWeight: '600' }}>
                Lyxa charge ({globalChargeType})
              </Typography>
              <IncrementDecrementButton
                currentValue={globalCharge}
                setValue={setGlobalCharge}
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                setTypeValidation={() => setHasChanged(true)}
              />
            </Stack>
          </Stack>
          {/* add or discard */}
          <Stack flexDirection="row" justifyContent="flex-end" marginTop="30px" gap="20px">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                if (hasChanged) {
                  setIsConfirm(true);
                } else {
                  successMsg('Please make a change first!');
                }
              }}
            >
              Discard
            </Button>
            <Button
              onClick={updateGlobarCharge}
              variant="contained"
              color="primary"
              disabled={setGlobalDropCharge?.isLoading}
            >
              Save Changes
            </Button>
          </Stack>
          <ConfirmModal
            message="Do you want to discard the changes ?"
            isOpen={isConfirm}
            blurClose
            onCancel={() => {
              setIsConfirm(false);
            }}
            onConfirm={() => {
              // callDeleteFaq();
              setIsConfirm(false);
              getGlobalDropCharge.refetch();
              setHasChanged(false);
            }}
          />
        </Box>
      ) : (
        <Box sx={{ marginTop: '30px' }}>
          {indexToTypeTracker[currentTab] === 'seller' ? (
            <PercentageTable
              setSelectedRange={setSelectedRange}
              setIsConfirm={setIsConfirmDelete}
              data={getRelatedSellerQuery?.data?.data?.sellers}
              loading={getRelatedSellerQuery.isLoading}
            />
          ) : (
            <RangeTable
              setIsEdit={setIsEdit}
              setSelectedRange={setSelectedRange}
              setIsConfirm={setIsConfirmDelete}
              setOpen={setOpen}
              setEditedData={setEditedData}
              data={
                indexToTypeTracker[currentTab] === 'delivery'
                  ? getGlobalDropCharge?.data?.data?.charge?.deliveryRange
                  : getGlobalDropCharge?.data?.data?.charge?.deliveryRangeButler
              }
              loading={getGlobalDropCharge.isLoading}
            />
          )}

          <ConfirmModal
            message="Do you want to delete the range ?"
            isOpen={isConfirmDelete}
            blurClose
            loading={
              addDeliveryCutRange.isLoading || addDeliveryCutRangeForButler.isLoading || deleteSellerRange.isLoading
            }
            onCancel={() => {
              setIsConfirmDelete(false);
            }}
            onConfirm={() => {
              callDeleteRange();
              setIsConfirmDelete(false);
              setHasChanged(false);
            }}
          />
        </Box>
      )}

      <Drawer open={open} anchor="right">
        <AddRange
          isEdit={isEdit}
          allData={
            indexToTypeTracker[currentTab] === 'delivery'
              ? getGlobalDropCharge?.data?.data?.charge?.deliveryRange
              : getGlobalDropCharge?.data?.data?.charge?.deliveryRangeButler
          }
          callForUpdate={addRangeHandler}
          editedData={isEdit ? editedData : undefined}
          onClose={() => setOpen(false)}
          isLoading={addDeliveryCutRange.isLoading || addDeliveryCutRangeForButler.isLoading}
        />
      </Drawer>
    </Box>
  );
}

export default PercentageSettings2;
