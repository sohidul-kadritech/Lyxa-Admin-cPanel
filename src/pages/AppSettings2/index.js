import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import currenciesList from '../../common/data/currencyList';
import PageTop from '../../components/Common/PageTop';
import Taglist from '../../components/Common/Taglist';
import StyledFormField from '../../components/Form/StyledFormField';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import InputBox from '../Settings/Admin/Marketing/LoyaltySettings/InputBox';
import StyledBox from '../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';
import IncrementDecrementButton from './IncrementDecrementButton';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '#',
  },
  {
    label: 'App Configuration',
    to: '#',
  },
];

export const maxDeliveryOptions = [
  {
    label: 'BDT',
    value: 'bdt',
  },
  {
    label: 'USD',
    value: 'usd',
  },
];

// eslint-disable-next-line no-unused-vars

function Appsettings2() {
  //   const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const [lyxaLimit, setLyxaLimit] = useState(25);

  const getShopSettingsData = useQuery([API_URL.APP_SETTINGS], () => AXIOS.get(API_URL.APP_SETTINGS));
  // eslint-disable-next-line no-unused-vars
  const [maxDistanceForButler, setMaxDistanceForButler] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [maxCustomerServiceValue, setMaxCustomerServiceValue] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [vat, setVat] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [searchDeliveryBoyKm, setSearchDeliveryBoyKm] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [nearByShopKm, setNearByShopKm] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [maxDiscount, setMaxDiscount] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [currency, setCurrency] = useState({});

  useEffect(() => {
    setMaxDistanceForButler(getShopSettingsData?.data?.data?.appSetting?.maxDistanceForButler || 0);
    setMaxCustomerServiceValue(getShopSettingsData?.data?.data?.appSetting?.maxCustomerServiceValue || 0);
    setVat(getShopSettingsData?.data?.data?.appSetting?.vat || 0);
    setSearchDeliveryBoyKm(getShopSettingsData?.data?.data?.appSetting?.searchDeliveryBoyKm || []);
    setNearByShopKm(getShopSettingsData?.data?.data?.appSetting?.nearByShopKm || []);
    setMaxDiscount(getShopSettingsData?.data?.data?.appSetting?.maxDiscount || 0);
    // eslint-disable-next-line no-unused-vars
    setCurrency(getShopSettingsData?.data?.data?.appSetting?.currency);
  }, [getShopSettingsData?.data]);

  // Handle Incremented by one

  const incrementHandler = () => {
    setLyxaLimit((prev) => prev + 1);
  };
  // Handle decremented by one
  const decrementHandler = () => {
    setLyxaLimit((prev) => prev - 1);
  };

  return (
    <Box>
      <PageTop
        // title="Zone"
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />
      <Box>
        {getShopSettingsData.isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <StyledBox title="Butler">
              <Stack gap="10px">
                <InputBox
                  title="Maximum item price"
                  endAdornment="$"
                  inputValue={`${maxDistanceForButler}`}
                  inputType="number"
                  //   onInputChange={(e) => {
                  //     setGetReward((prev) => ({ ...prev, amount: e.target.value }));
                  //     setGlobalChange(true);
                  //   }}
                />
                <InputBox
                  title="Maximum Distance"
                  endAdornment="KM"
                  inputValue={`${maxDistanceForButler}`}
                  inputType="number"
                  //   onInputChange={(e) => {
                  //     setGetReward((prev) => ({ ...prev, amount: e.target.value }));
                  //     setGlobalChange(true);
                  //   }}
                />
              </Stack>
            </StyledBox>
            <StyledBox title="Lyxa Pay Limit ($)">
              <IncrementDecrementButton
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                currentValue={maxCustomerServiceValue}
              />
            </StyledBox>
            <StyledBox title="VAT (Percentage)">
              <IncrementDecrementButton
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                currentValue={vat}
              />
            </StyledBox>
            <StyledBox title="Delivery Boy Search Area (KM)">
              <Taglist
                listContainerSx={{
                  mb: 2.5,
                  mt: 2,
                }}
                addButtonLabel="Add"
                items={searchDeliveryBoyKm}
                // onAdd={(value) => addNewBundleItem(value)}
                // onDelete={(item, index, array) => {
                //   array.splice(index, 1);
                //   setRender((prev) => !prev);
                //   setGlobalChange(true);
                // }}
              />
            </StyledBox>
            <StyledBox title="Near Shop Distance (KM)">
              <IncrementDecrementButton
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                currentValue={nearByShopKm}
              />
            </StyledBox>
            <StyledBox title="Maximum Discount for Shops ($)">
              <Taglist
                listContainerSx={{
                  mb: 2.5,
                  mt: 2,
                }}
                addButtonLabel="Add"
                items={maxDiscount}
                // onAdd={(value) => addNewBundleItem(value)}
                // onDelete={(item, index, array) => {
                //   array.splice(index, 1);
                //   setRender((prev) => !prev);
                //   setGlobalChange(true);
                // }}
              />
            </StyledBox>
            <StyledBox title="App Currency">
              <StyledFormField
                intputType="select"
                containerProps={{
                  sx: {
                    width: '125px',
                  },
                }}
                inputProps={{
                  name: 'shopStatus',
                  placeholder: 'currency',
                  // value: props?.value,
                  items: currenciesList.map((currency) => {
                    const label = currency?.name_plural;
                    const value = { ...currency };
                    return { label, value };
                  }),
                  //   items: categories,
                  // onChange: (e) => props.action(e.target.value),
                  //   readOnly: Boolean(newProductCategory) || productReadonly,
                }}
              />
            </StyledBox>
          </>
        )}
      </Box>

      <Stack
        direction="row"
        justifyContent="flex-end"
        gap={4}
        sx={{
          mt: 9,
          pb: 12,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          //   onClick={() => {
          //     if (has_unsaved_change) {
          //       setIsConfirmModalOpen(true);
          //     }
          //   }}
        >
          Discard
        </Button>
        <Button
          // onClick={updateData.mutate}
          variant="contained"
          color="primary"
          //   disabled={updateData.isLoading}
        >
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
}

export default Appsettings2;
