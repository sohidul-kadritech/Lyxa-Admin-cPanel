import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
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
import { separatesUpdatedData } from './helpers';

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

export const validateList = (newValue, oldList, type) => {
  if (Number(newValue) < 1 && type === 'number') {
    successMsg('Bundle cannot be smaller than 1');
    return false;
  }

  if (Number.isNaN(Number(newValue)) && type === 'number') {
    successMsg('Please enter a valid value');
    return false;
  }

  if (oldList.includes(Number(newValue) && type === 'number')) {
    successMsg('Bundle item already exists');
    return false;
  }

  if (Number(newValue) < 1 && type === 'number') {
    successMsg('Bundle cannot be smaller than 1');
    return false;
  }

  // for text type

  if (!newValue && type === 'text') {
    successMsg('Bundle cannot be smaller than 1 character');
    return false;
  }

  if (oldList.includes(newValue) && type === 'text') {
    successMsg('Bundle item already exists');
    return false;
  }

  return true;
};

// eslint-disable-next-line no-unused-vars

function Appsettings2() {
  //   const theme = useTheme();

  const queryClient = useQueryClient();
  // eslint-disable-next-line no-unused-vars
  const [lyxaLimit, setLyxaLimit] = useState(25);

  const getShopSettingsData = useQuery([API_URL.APP_SETTINGS], () => AXIOS.get(API_URL.APP_SETTINGS));

  const getAllUnits = useQuery([API_URL.GET_ALL_UNIT], () => AXIOS.get(API_URL.GET_ALL_UNIT));

  // eslint-disable-next-line no-unused-vars
  const [deletedUnitId, setDeletedUnitId] = useState([]);
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
  const [maxDiscount, setMaxDiscount] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [units, setUnits] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [oldUnits, setOldUnits] = useState([]);

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

    setUnits(getAllUnits?.data?.data || []);
    setOldUnits(getAllUnits?.data?.data || []);
  }, [getShopSettingsData?.data?.data, getAllUnits?.data?.data]);

  // eslint-disable-next-line no-unused-vars
  const updateQuery2 = useMutation(
    async (data) => {
      if (data?.addUnit?.nameList?.length === 0 && data?.deleteUnit?.idList?.length > 0) {
        const response1 = await AXIOS.post(API_URL.UPDATE_APP_SETTINGS, data?.appSettings);
        const response3 = await AXIOS.post(API_URL.DELETE_UNIT, data?.deleteUnit);
        return [response1, response3];
      }
      if (data?.addUnit?.nameList?.length > 0 && data?.deleteUnit?.idList?.length === 0) {
        const response1 = await AXIOS.post(API_URL.UPDATE_APP_SETTINGS, data?.appSettings);
        const response2 = await AXIOS.post(API_URL.ADD_UNIT, data?.addUnit);
        return [response1, response2];
      }
      if (data?.addUnit?.nameList?.length === 0 && data?.deleteUnit?.idList?.length === 0) {
        const response1 = await AXIOS.post(API_URL.UPDATE_APP_SETTINGS, data?.appSettings);
        return [response1];
      }

      const response1 = await AXIOS.post(API_URL.UPDATE_APP_SETTINGS, data?.appSettings);
      const response2 = await AXIOS.post(API_URL.ADD_UNIT, data?.addUnit);
      const response3 = await AXIOS.post(API_URL.DELETE_UNIT, data?.deleteUnit);

      return [response1, response2, response3];
    },
    {
      onSuccess: (data) => {
        if (data.length === 3 && data[0].status && data[1].status && data[2].status) {
          successMsg('Updated Succesfully', 'success');
          setHasChanged(false);
          queryClient.invalidateQueries([API_URL.UPDATE_APP_SETTINGS, API_URL.ADD_UNIT, API_URL.DELETE_UNIT]);
        } else if (data.length === 2 && data[0].status && data[1].status) {
          successMsg('Updated Succesfully', 'success');
          setHasChanged(false);
          queryClient.invalidateQueries([API_URL.UPDATE_APP_SETTINGS, API_URL.ADD_UNIT, API_URL.DELETE_UNIT]);
        } else if (data.length === 1 && data[0].status) {
          successMsg('Updated Succesfully', 'success');
          setHasChanged(false);
          queryClient.invalidateQueries([API_URL.UPDATE_APP_SETTINGS, API_URL.ADD_UNIT, API_URL.DELETE_UNIT]);
        } else {
          successMsg('Something Went Wrong');
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

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
    setUnits(getAllUnits?.data?.data || []);
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

  const addNewBundleItem = (bundle, setBundle, oldbundle, type = 'number') => {
    if (validateList(bundle, oldbundle, type) && type === 'number') {
      setBundle((prev) => [...prev, Number(bundle)]);
      return true;
    }

    if (
      validateList(
        bundle,
        oldbundle.map((data) => data?.name),
        // eslint-disable-next-line prettier/prettier
        type,
      ) &&
      type === 'text'
    ) {
      setHasChanged(true);
      setBundle((prev) => {
        const previousData = oldUnits.find((unit) => unit.name === bundle);
        if (previousData) {
          setDeletedUnitId((prev) => prev.filter((id) => id !== previousData._id));
          return [...prev, previousData];
        }
        return [...prev, { name: bundle, isNew: true }];
      });
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
    const appsettignsData = {
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

    const updateDUnits = separatesUpdatedData(
      oldUnits.map((unit) => unit.name),
      // eslint-disable-next-line prettier/prettier
      units.map((unit) => unit.name),
    );

    // if (hasChanged) updateQuery.mutate(data);

    if (hasChanged) {
      updateQuery2.mutate({
        appSettings: appsettignsData,
        addUnit: {
          nameList: updateDUnits,
        },
        deleteUnit: {
          idList: deletedUnitId,
        },
      });
    } else successMsg('Please make some changes first !');
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
        {getShopSettingsData.isLoading || getAllUnits.isLoading ? (
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

            <StyledBox title="Units">
              <Taglist
                listContainerSx={{
                  mb: 2.5,
                  mt: 2,
                }}
                type="text"
                addButtonLabel="Add"
                items={units.map((u) => u.name) || []}
                onAdd={(value) => {
                  // setTypeValidation(type, setType, 'maxDiscount');
                  addNewBundleItem(value, setUnits, units, 'text');
                }}
                onDelete={(item) => {
                  // setTypeValidation(type, setType, 'maxDiscount');
                  setHasChanged(true);
                  setUnits((prev) => {
                    setDeletedUnitId((deletedUnit) => {
                      const deletedId = prev.find((value) => value.name === item && value._id);
                      if (deletedId && !deletedUnit.includes(deletedId?._id)) return [...deletedUnit, deletedId._id];
                      return [...deletedUnit];
                    });

                    return prev.filter((value) => value.name !== item);
                  });
                  // setDeletedUnitId((prev) => [...prev, { id: units.find((value) => value.name === item) }]);
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
        <Button
          onClick={() => {
            updateData();
          }}
          variant="contained"
          color="primary"
          disabled={updateQuery2?.isLoading}
        >
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
