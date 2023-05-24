import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import currenciesList from '../../common/data/currencyList';
import ConfirmModal from '../../components/Common/ConfirmModal';
import PageTop from '../../components/Common/PageTop';
import Taglist from '../../components/Common/Taglist';
import StyledFormField from '../../components/Form/StyledFormField';
import { successMsg } from '../../helpers/successMsg';
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

export const validateList = (newValue, oldList) => {
  if (Number(newValue) < 1) {
    successMsg('Bundle cannot be smaller than 1');
    return false;
  }

  if (Number.isNaN(Number(newValue))) {
    successMsg('Please enter a valid value');
    return false;
  }

  if (oldList.includes(Number(newValue))) {
    successMsg('Bundle item already exists');
    return false;
  }

  return true;
};

// eslint-disable-next-line no-unused-vars

function Appsettings2() {
  //   const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const [lyxaLimit, setLyxaLimit] = useState(25);

  const getShopSettingsData = useQuery([API_URL.APP_SETTINGS], () => AXIOS.get(API_URL.APP_SETTINGS));

  console.log('shop data: ', getShopSettingsData?.data?.data?.appSetting);

  // eslint-disable-next-line no-unused-vars
  const [maxTotalEstItemsPriceForButler, setMaxTotalEstItemsPriceForButler] = useState(0);
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

  // eslint-disable-next-line no-unused-vars
  const [type, setType] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [isConfirm, setIsconfirm] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    setMaxTotalEstItemsPriceForButler(getShopSettingsData?.data?.data?.appSetting?.maxTotalEstItemsPriceForButler || 0);
    setMaxDistanceForButler(getShopSettingsData?.data?.data?.appSetting?.maxDistanceForButler || 0);
    setMaxCustomerServiceValue(getShopSettingsData?.data?.data?.appSetting?.maxCustomerServiceValue || 0);
    setVat(getShopSettingsData?.data?.data?.appSetting?.vat || 0);
    setSearchDeliveryBoyKm(getShopSettingsData?.data?.data?.appSetting?.searchDeliveryBoyKm || []);
    setNearByShopKm(getShopSettingsData?.data?.data?.appSetting?.nearByShopKm || []);
    setMaxDiscount(getShopSettingsData?.data?.data?.appSetting?.maxDiscount || 0);
    // eslint-disable-next-line no-unused-vars
    setCurrency(getShopSettingsData?.data?.data?.appSetting?.currency || {});
  }, [getShopSettingsData?.data]);

  // eslint-disable-next-line prettier/prettier

  const updateQuery = useMutation((data) => AXIOS.post(API_URL.UPDATE_APP_SETTINGS, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg('Updated Succesfully', 'success');
        setHasChanged(false);
      } else {
        successMsg('Something Went Wrong');
      }
    },
  });

  // eslint-disable-next-line no-unused-vars
  const populateData = () => {
    setMaxTotalEstItemsPriceForButler(getShopSettingsData?.data?.data?.appSetting?.maxTotalEstItemsPriceForButler || 0);
    setMaxDistanceForButler(getShopSettingsData?.data?.data?.appSetting?.maxDistanceForButler || 0);
    setMaxCustomerServiceValue(getShopSettingsData?.data?.data?.appSetting?.maxCustomerServiceValue || 0);
    setVat(getShopSettingsData?.data?.data?.appSetting?.vat || 0);
    setSearchDeliveryBoyKm(getShopSettingsData?.data?.data?.appSetting?.searchDeliveryBoyKm || []);
    setNearByShopKm(getShopSettingsData?.data?.data?.appSetting?.nearByShopKm || []);
    setMaxDiscount(getShopSettingsData?.data?.data?.appSetting?.maxDiscount || 0);
    setCurrency(getShopSettingsData?.data?.data?.appSetting?.currency || {});
    setType([]);
  };

  const setTypeValidation = (type, setType, value) => {
    setHasChanged(true);
    if (type.includes(value)) {
      return;
    }
    const oldType = type;
    oldType.push(value);
    setType(oldType);
  };

  const addNewBundleItem = (bundle, setBundle, oldbundle) => {
    if (validateList(bundle, oldbundle)) {
      setBundle((prev) => [...prev, Number(bundle)]);
      // setGlobalChange(true);

      return true;
    }
    return false;
  };

  // Handle Incremented by one

  const incrementByOneHandler = (setValue) => {
    setValue((prev) => prev + 1);
  };
  // Handle decremented by one
  const decrementByOneHandler = (setValue) => {
    setValue((prev) => prev - 1);
  };

  // Handle Incremented by five

  const incrementByFiveHandler = (setValue) => {
    setValue((prev) => prev + 5);
  };
  // Handle decremented by one
  const decrementByFiveHandler = (setValue) => {
    setValue((prev) => prev - 5);
  };

  const updateData = () => {
    // setting/app-setting/edit
    const data = {
      maxTotalEstItemsPriceForButler,
      nearByShopKm,
      maxDistanceForButler,
      maxDiscount,
      maxCustomerServiceValue,
      searchDeliveryBoyKm,
      currency,
      vat,
      type,
    };
    console.log('Created Data', data);

    if (hasChanged) updateQuery.mutate(data);
    else successMsg('Please make some changes first !');
    // createDataForAppSettings(data);
  };

  return (
    <Box sx={{ backgroundColor: '#fbfbfb' }}>
      <PageTop
        // title="Zone"
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          fontWeight: 700,
          backgroundColor: '#fbfbfb',
        }}
      />
      <Box sx={{ backgroundColor: '#ffffff', borderRadius: '7px', padding: '30px' }}>
        {getShopSettingsData.isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <StyledBox title="Butler">
              <Stack gap="10px" justifyContent="center">
                <InputBox
                  title="Max total EST items price"
                  endAdornment={`${currency?.symbol_native}`}
                  inputValue={`${maxTotalEstItemsPriceForButler}`}
                  inputType="number"
                  sxLeft={{ width: '200px' }}
                  sxRight={{ width: '110px' }}
                  onInputChange={(e) => {
                    setMaxTotalEstItemsPriceForButler(e?.target?.value);
                    setTypeValidation(type, setType, 'maxTotalEstItemsPriceForButler');
                  }}
                />
                <InputBox
                  sxLeft={{ width: '200px' }}
                  sxRight={{ width: '110px' }}
                  title="Maximum Distance"
                  endAdornment="KM"
                  inputValue={`${maxDistanceForButler}`}
                  inputType="number"
                  onInputChange={(e) => {
                    setMaxDistanceForButler(e?.target?.value);

                    setTypeValidation(type, setType, 'maxDistanceForButler');
                  }}
                />
              </Stack>
            </StyledBox>
            <StyledBox title={`Lyxa Pay Limit (Customer Service) (${currency?.symbol_native})`}>
              <IncrementDecrementButton
                incrementHandler={incrementByOneHandler}
                decrementHandler={decrementByOneHandler}
                setValue={setMaxCustomerServiceValue}
                types={type}
                type="maxCustomerServiceValue"
                setTypeValidation={setTypeValidation}
                setType={setType}
                currentValue={maxCustomerServiceValue}
              />
            </StyledBox>
            <StyledBox title="VAT (Percentage)">
              <IncrementDecrementButton
                incrementHandler={incrementByOneHandler}
                decrementHandler={decrementByOneHandler}
                setValue={setVat}
                currentValue={vat}
                setTypeValidation={setTypeValidation}
                types={type}
                type="vat"
                setType={setType}
              />
            </StyledBox>
            <StyledBox title="Delivery Boy Search Area (KM)">
              <Taglist
                listContainerSx={{
                  mb: 2.5,
                  mt: 2,
                }}
                addButtonLabel="Add"
                items={searchDeliveryBoyKm || []}
                onAdd={(value) => {
                  setTypeValidation(type, setType, 'searchDeliveryBoyKm');
                  if (searchDeliveryBoyKm?.length <= 2) {
                    addNewBundleItem(value, setSearchDeliveryBoyKm, searchDeliveryBoyKm);
                  } else {
                    successMsg('Maximum 3 items can add ');
                  }
                }}
                onDelete={(item) => {
                  setTypeValidation(type, setType, 'searchDeliveryBoyKm');
                  setSearchDeliveryBoyKm((prev) => prev.filter((value) => value !== item));
                }}
              />
            </StyledBox>
            <StyledBox title="Near Shop Distance (KM)">
              <IncrementDecrementButton
                incrementHandler={incrementByFiveHandler}
                decrementHandler={decrementByFiveHandler}
                setValue={setNearByShopKm}
                currentValue={nearByShopKm}
                setTypeValidation={setTypeValidation}
                types={type}
                type="nearByShopKm"
                setType={setType}
              />
            </StyledBox>
            <StyledBox title={`Maximum Discount for Shops (${currency?.symbol_native})`}>
              <Taglist
                listContainerSx={{
                  mb: 2.5,
                  mt: 2,
                }}
                addButtonLabel="Add"
                items={maxDiscount || []}
                onAdd={(value) => {
                  setTypeValidation(type, setType, 'maxDiscount');
                  addNewBundleItem(value, setMaxDiscount, maxDiscount);
                }}
                onDelete={(item) => {
                  setTypeValidation(type, setType, 'maxDiscount');
                  setMaxDiscount((prev) => prev.filter((value) => value !== item));
                }}
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
                  value: currency?.code || '',
                  items: currenciesList.map((currency) => {
                    const label = currency?.name_plural;
                    const value = currency?.code;
                    return { label, value };
                  }),
                  //   items: categories,
                  onChange: (e) => {
                    console.log('currency value: ', e.target.value);
                    const selectedCurrency = currenciesList.find((currency) => e.target.value === currency?.code);
                    setTypeValidation(type, setType, 'currency');
                    setCurrency(selectedCurrency);
                  },
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
          onClick={() => {
            if (hasChanged) {
              setIsconfirm(true);
            }
          }}
        >
          Discard
        </Button>
        <Button onClick={updateData} variant="contained" color="primary" disabled={updateQuery?.isLoading}>
          Save Changes
        </Button>
      </Stack>

      <ConfirmModal
        message="Do you want to discard the changes ?"
        isOpen={isConfirm}
        blurClose
        onCancel={() => {
          setIsconfirm(false);
        }}
        onConfirm={() => {
          // callDeleteFaq();
          setIsconfirm(false);
          populateData();
          setHasChanged(false);
        }}
      />
    </Box>
  );
}

export default Appsettings2;
