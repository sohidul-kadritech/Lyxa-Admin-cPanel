/* eslint-disable no-unused-vars */
import { Box, Button, Stack } from '@mui/material';
import { isNumber } from 'lodash';
import React, { useState } from 'react';
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
import AppSettingsSkeleton from './AppSettingsSkeleton';
import IncrementDecrementButton from './IncrementDecrementButton';
import { appSettingsValidateData, separatesUpdatedData } from './helpers';

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
const initialCurrency = {
  symbol: '€',
  name: 'Euro',
  symbol_native: '€',
  decimal_digits: 2,
  rounding: 0,
  code: 'EUR',
  name_plural: 'euros',
  _id: '647707ce1afe457826284190',
};

export const getAcceptedCurrencyOptions = (base, secondary) => [
  {
    label: 'Both',
    value: 'both',
  },
  {
    label: `${base?.code} Only`,
    value: base?.code,
  },
  {
    label: `${secondary?.code} Only`,
    value: secondary?.code,
  },
];

const getSecondaryCurrencyOptions = [
  {
    label: 'Disable',
    value: 'disable',
  },
  {
    label: 'Enable',
    value: 'enable',
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
  if (oldList.includes(Number(newValue)) && type === 'number') {
    console.log('into if');
    successMsg('Bundle item already exists');
    return false;
  }
  console.log('after if');
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

const provideErrorMessage = (data) => {
  for (let i = 0; i < data.length; i++) {
    if (!data[i].status) {
      successMsg(data[i].message, 'error');
    }
  }
};

function Appsettings2() {
  const queryClient = useQueryClient();
  const [deletedUnitId, setDeletedUnitId] = useState([]);
  const [isConfirm, setIsconfirm] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [units, setUnits] = useState([]);
  const [oldUnits, setOldUnits] = useState([]);
  const [newAppSettings, setNewAppSettings] = useState({});
  const [oldAppSettings, setOldAppSettings] = useState({});
  const [isUsedSecondaryCurrency, setIsUsedSecondaryCurrency] = useState('');

  // Get all shop settings data
  const getAppSettingsData = useQuery([API_URL.APP_SETTINGS], () => AXIOS.get(API_URL.APP_SETTINGS), {
    onSuccess: (data) => {
      if (data.status) {
        setOldAppSettings(getAppSettingsData?.data?.data?.appSetting);
        setNewAppSettings(getAppSettingsData?.data?.data?.appSetting);

        setIsUsedSecondaryCurrency(() => {
          const currency =
            Object?.keys(getAppSettingsData?.data?.data?.appSetting.secondaryCurrency || {})?.length > 1
              ? 'enable'
              : 'disable';
          return currency;
        });
      }
    },
  });

  // Get all unit data
  const getAllUnits = useQuery([API_URL.GET_ALL_UNIT], () => AXIOS.get(API_URL.GET_ALL_UNIT), {
    onSuccess: (data) => {
      if (data.status) {
        console.log('data unit', data?.data);
        setUnits(data?.data || []);
        setOldUnits(data?.data || []);
      }
    },
  });

  // update data
  const updateQuery2 = useMutation(
    async (data) => {
      setDeletedUnitId([]);
      if (data?.addUnit?.nameList?.length === 0 && data?.deleteUnit?.idList?.length > 0) {
        const response1 = await AXIOS.post(API_URL.UPDATE_APP_SETTINGS, data?.appSettings);
        const response3 = await AXIOS.post(API_URL.DELETE_UNIT, data?.deleteUnit);
        const response4 = await AXIOS.post(API_URL.UNIT_ADMIN_LOGS, data?.logs);
        return [response1, response3, response4];
      }
      if (data?.addUnit?.nameList?.length > 0 && data?.deleteUnit?.idList?.length === 0) {
        const response1 = await AXIOS.post(API_URL.UPDATE_APP_SETTINGS, data?.appSettings);
        const response2 = await AXIOS.post(API_URL.ADD_UNIT, data?.addUnit);
        const response4 = await AXIOS.post(API_URL.UNIT_ADMIN_LOGS, data?.logs);
        return [response1, response2, response4];
      }
      if (data?.addUnit?.nameList?.length === 0 && data?.deleteUnit?.idList?.length === 0) {
        const response1 = await AXIOS.post(API_URL.UPDATE_APP_SETTINGS, data?.appSettings);
        return [response1];
      }
      const response1 = await AXIOS.post(API_URL.UPDATE_APP_SETTINGS, data?.appSettings);
      const response2 = await AXIOS.post(API_URL.ADD_UNIT, data?.addUnit);
      const response3 = await AXIOS.post(API_URL.DELETE_UNIT, data?.deleteUnit);
      const response4 = await AXIOS.post(API_URL.UNIT_ADMIN_LOGS, data?.logs);
      return [response1, response2, response3, response4];
    },
    {
      onSuccess: (data) => {
        if (data.length === 4 && data[0].status && data[1].status && data[2].status && data[2].status) {
          successMsg('Updated Succesfully', 'success');
          setHasChanged(false);
          setOldAppSettings(data[0]?.data?.appSetting);
          setNewAppSettings(data[0]?.data?.appSetting);

          if (data[1]?.data) {
            setOldUnits(() => {
              console.log('old unit: ', data[1]?.data);
              return [...data[1].data];
            });
            setUnits(() => {
              console.log('old unit: ', data[1]?.data);
              return [...data[1].data];
            });
          }
          setIsUsedSecondaryCurrency(() =>
            // eslint-disable-next-line prettier/prettier
            Object?.keys(data[0]?.data?.appSetting?.secondaryCurrency || {})?.length > 1 ? 'enable' : 'disable'
          );
          queryClient.invalidateQueries([API_URL.UPDATE_APP_SETTINGS, API_URL.ADD_UNIT, API_URL.DELETE_UNIT]);
        } else if (data.length === 3 && data[0].status && data[1].status && data[2].status) {
          successMsg('Updated Succesfully', 'success');
          setHasChanged(false);
          setOldAppSettings(data[0]?.data?.appSetting);
          setNewAppSettings(data[0]?.data?.appSetting);
          if (data[1]?.data) {
            if (data[1]?.data) {
              setOldUnits(() => {
                console.log('old unit: ', data[1]?.data);
                return [...data[1].data];
              });
              setUnits(() => {
                console.log('old unit: ', data[1]?.data);
                return [...data[1].data];
              });
            }
          }
          setIsUsedSecondaryCurrency(() =>
            // eslint-disable-next-line prettier/prettier
            Object?.keys(data[0]?.data?.appSetting?.secondaryCurrency || {})?.length > 1 ? 'enable' : 'disable'
          );
          queryClient.invalidateQueries([API_URL.UPDATE_APP_SETTINGS, API_URL.ADD_UNIT, API_URL.DELETE_UNIT]);
        } else if (data.length === 1 && data[0].status) {
          successMsg('Updated Succesfully', 'success');
          setHasChanged(false);
          setOldAppSettings(data[0]?.data?.appSetting);
          setNewAppSettings(data[0]?.data?.appSetting);
          setIsUsedSecondaryCurrency(() =>
            // eslint-disable-next-line prettier/prettier
            Object?.keys(data[0]?.data?.appSetting?.secondaryCurrency || {})?.length > 1 ? 'enable' : 'disable'
          );
          queryClient.invalidateQueries([API_URL.UPDATE_APP_SETTINGS, API_URL.ADD_UNIT, API_URL.DELETE_UNIT]);
        } else {
          provideErrorMessage(data);
        }
      },
      // eslint-disable-next-line prettier/prettier
    }
  );

  // reset data
  const populateData = () => {
    setNewAppSettings(getAppSettingsData?.data?.data?.appSetting);
    setUnits(getAllUnits?.data?.data || []);
  };

  const addNewBundleItem = (bundle, setBundle, oldbundle, objectKey, type = 'number') => {
    if (validateList(bundle, oldbundle, type) && type === 'number') {
      setBundle((prev) => ({ ...prev, [objectKey]: [...oldbundle, Number(bundle)] }));
      return true;
    }

    if (
      validateList(
        bundle,
        oldbundle.map((data) => data?.name),
        // eslint-disable-next-line prettier/prettier
        type
      ) &&
      type === 'text'
    ) {
      setHasChanged(true);
      setBundle((prev) => {
        // if units already exist in old unit list.
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
  const incrementByOneHandler = (setValue, key) => {
    setHasChanged(true);
    setValue((prev) => {
      if (isNumber(parseInt(prev[key], 10)) && prev[key] !== '') return { ...prev, [key]: parseInt(prev[key], 10) + 1 };
      if (prev[key] === '') return { ...prev, [key]: 1 };
      return { ...prev };
    });
  };

  // Handle decremented by one
  const decrementByOneHandler = (setValue, key) => {
    setHasChanged(true);
    setValue((prev) => {
      if (isNumber(parseInt(prev[key], 10)) && prev[key] !== '') return { ...prev, [key]: parseInt(prev[key], 10) - 1 };
      if (prev[key] === '' || prev[key] <= 0) return { ...prev, [key]: 0 };
      return { ...prev };
    });
  };

  // Handle Incremented by five
  const incrementByFiveHandler = (setValue, key) => {
    setHasChanged(true);
    setValue((prev) => {
      if (isNumber(parseInt(prev[key], 10)) && prev[key] !== '') return { ...prev, [key]: parseInt(prev[key], 10) + 5 };
      if (prev[key] === '') return { ...prev, [key]: 5 };
      return { ...prev };
    });
  };

  // Handle decremented by five
  const decrementByFiveHandler = (setValue, key) => {
    setHasChanged(true);
    setValue((prev) => {
      if (isNumber(parseInt(prev[key], 10)) && prev[key] !== '' && parseInt(prev[key], 10) - 5 > 0)
        return { ...prev, [key]: parseInt(prev[key], 10) - 5 };
      if (prev[key] === '' || prev[key] <= 0) return { ...prev, [key]: 5 };
      return { ...prev };
    });
  };

  const updateData = () => {
    console.log({ newAppSettings });
    const generatedData = appSettingsValidateData(oldAppSettings, newAppSettings);

    if (isUsedSecondaryCurrency === 'enable' && !newAppSettings.secondaryCurrency?.symbol) {
      successMsg('Select a secondary currency or disable it!', 'error');
      return;
    }

    if (newAppSettings?.exchangeRate <= 1) {
      successMsg('Exchange rate should be greater than 1!', 'error');
      return;
    }

    if (
      isUsedSecondaryCurrency === 'enable' &&
      newAppSettings.secondaryCurrency?.symbol &&
      newAppSettings.secondaryCurrency?.symbol === newAppSettings.currency?.symbol
    ) {
      successMsg('Secondary currency should not same as base currency!', 'error');
      return;
    }

    const updatedUnits = separatesUpdatedData(
      oldUnits?.map((unit) => unit.name),
      // eslint-disable-next-line prettier/prettier
      units?.map((unit) => unit.name)
    );

    console.log('', updatedUnits);
    console.log('generatedData', generatedData);

    if (hasChanged) {
      setOldUnits((prev) => {
        if (deletedUnitId?.length > 0) {
          return [...units];
        }
        return [...prev];
      });

      updateQuery2.mutate({
        appSettings: generatedData,
        addUnit: {
          nameList: updatedUnits,
        },
        deleteUnit: {
          idList: deletedUnitId,
        },
        logs: {
          newValue: units?.map((unit) => unit.name),
          oldValue: oldUnits?.map((unit) => unit.name),
        },
      });
    } else successMsg('Please make some changes first !');
  };

  return (
    <Box sx={{ backgroundColor: '#fbfbfb' }}>
      <PageTop
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        backTo="/settings"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          fontWeight: 700,
          backgroundColor: '#fbfbfb',
        }}
      />
      <Box sx={{ backgroundColor: '#ffffff', borderRadius: '7px', padding: '30px' }}>
        {getAppSettingsData.isLoading || getAllUnits.isLoading ? (
          <AppSettingsSkeleton />
        ) : (
          <>
            <StyledBox title="Butler">
              <Stack gap="10px" justifyContent="center">
                <InputBox
                  title="Max total EST items price"
                  endAdornment={`${newAppSettings?.currency?.symbol}`}
                  inputValue={`${newAppSettings?.maxTotalEstItemsPriceForButler}`}
                  inputType="number"
                  sxLeft={{ width: '200px' }}
                  sxRight={{ width: '140px' }}
                  onInputChange={(e) => {
                    setHasChanged(true);
                    setNewAppSettings((prev) => ({ ...prev, maxTotalEstItemsPriceForButler: e?.target?.value }));
                    // setMaxTotalEstItemsPriceForButler(e?.target?.value);
                  }}
                />
                <InputBox
                  sxLeft={{ width: '200px' }}
                  sxRight={{ width: '140px' }}
                  title="Maximum Distance"
                  endAdornment="KM"
                  inputValue={`${newAppSettings?.maxDistanceForButler}`}
                  inputType="number"
                  onInputChange={(e) => {
                    setHasChanged(true);
                    // setMaxDistanceForButler(e?.target?.value);
                    setNewAppSettings((prev) => ({ ...prev, maxDistanceForButler: e?.target?.value }));
                  }}
                />
              </Stack>
            </StyledBox>
            <StyledBox title={`Lyxa Pay Limit (Customer Service) (${newAppSettings?.currency?.symbol})`}>
              <IncrementDecrementButton
                isChangeOthers
                changeOthers={() => {
                  setHasChanged(true);
                }}
                incrementHandler={incrementByOneHandler}
                decrementHandler={decrementByOneHandler}
                objectKey="maxCustomerServiceValue"
                setValue={setNewAppSettings}
                isValidateType={false}
                currentValue={newAppSettings?.maxCustomerServiceValue}
              />
            </StyledBox>
            <StyledBox title="VAT (Percentage)">
              <IncrementDecrementButton
                isChangeOthers
                changeOthers={() => {
                  setHasChanged(true);
                }}
                isValidateType={false}
                incrementHandler={incrementByOneHandler}
                decrementHandler={decrementByOneHandler}
                objectKey="vat"
                setValue={setNewAppSettings}
                currentValue={newAppSettings?.vat}
              />
            </StyledBox>

            <StyledBox title="Delivery Boy Search Area (KM)">
              <Taglist
                listContainerSx={{
                  mb: 2.5,
                  mt: 2,
                }}
                addButtonLabel="Add"
                items={newAppSettings?.searchDeliveryBoyKm || []}
                onAdd={(value) => {
                  if (newAppSettings?.searchDeliveryBoyKm?.length <= 2) {
                    setHasChanged(true);
                    addNewBundleItem(
                      value,
                      setNewAppSettings,
                      newAppSettings?.searchDeliveryBoyKm,
                      // eslint-disable-next-line prettier/prettier
                      'searchDeliveryBoyKm'
                    );
                  } else {
                    successMsg('Maximum 3 items can add ');
                  }
                }}
                onDelete={(item) => {
                  setHasChanged(true);
                  setNewAppSettings((prev) => ({
                    ...prev,
                    searchDeliveryBoyKm: prev?.searchDeliveryBoyKm.filter((value) => value !== item),
                  }));
                }}
              />
            </StyledBox>
            <StyledBox title="Shop Distance (KM)">
              <IncrementDecrementButton
                isChangeOthers
                changeOthers={() => {
                  setHasChanged(true);
                }}
                isValidateType={false}
                incrementHandler={incrementByFiveHandler}
                decrementHandler={decrementByFiveHandler}
                objectKey="nearByShopKm"
                setValue={setNewAppSettings}
                currentValue={newAppSettings?.nearByShopKm}
              />
            </StyledBox>
            <StyledBox title="Near Shop Distance in Home Screen (KM)">
              <IncrementDecrementButton
                isChangeOthers
                changeOthers={() => {
                  setHasChanged(true);
                }}
                isValidateType={false}
                incrementHandler={incrementByFiveHandler}
                decrementHandler={decrementByFiveHandler}
                objectKey="nearByShopKmForUserHomeScreen"
                setValue={setNewAppSettings}
                currentValue={newAppSettings?.nearByShopKmForUserHomeScreen}
              />
            </StyledBox>
            <StyledBox title={`Maximum Discount for Shops (${newAppSettings?.currency?.symbol})`}>
              <Taglist
                listContainerSx={{
                  mb: 2.5,
                  mt: 2,
                }}
                addButtonLabel="Add"
                items={newAppSettings?.maxDiscount || []}
                onAdd={(value) => {
                  setHasChanged(true);
                  addNewBundleItem(
                    value,
                    setNewAppSettings,
                    newAppSettings?.maxDiscount,
                    // eslint-disable-next-line prettier/prettier
                    'maxDiscount'
                  );
                }}
                onDelete={(item) => {
                  setHasChanged(true);
                  setNewAppSettings((prev) => ({
                    ...prev,
                    maxDiscount: prev?.maxDiscount.filter((value) => value !== item),
                  }));
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
                  setHasChanged(true);
                  addNewBundleItem(value, setUnits, units, null, 'text');
                }}
                onDelete={(item) => {
                  setHasChanged(true);
                  setUnits((prev) => {
                    console.log('delete---> previous unit', prev, 'item: ', item);
                    setDeletedUnitId((deletedUnit) => {
                      const deletedId = prev.find((value) => value.name === item && value._id);
                      if (deletedId && !deletedUnit.includes(deletedId?._id)) return [...deletedUnit, deletedId._id];
                      return [...deletedUnit];
                    });
                    return prev.filter((value) => value.name !== item);
                  });
                }}
              />
            </StyledBox>
            <StyledBox title="App Currency">
              <Stack direction="row" alignItems="center" flexWrap="wrap">
                <InputBox
                  title="Base Currency"
                  endAdornment={`${newAppSettings?.currency?.symbol}`}
                  inputType="number"
                  sxLeft={{ width: '200px' }}
                  sxRight={{ width: '140px' }}
                  sxContainer={{ flex: 1.7 }}
                  isRenderedChild
                >
                  <StyledFormField
                    intputType="select"
                    containerProps={{
                      sx: {
                        width: '125px',
                      },
                    }}
                    inputProps={{
                      placeholder: 'currency',
                      value: newAppSettings?.currency?.code || '',
                      items: currenciesList.map((currency) => {
                        const label = currency?.name_plural;
                        const value = currency?.code;
                        return { label, value };
                      }),
                      //   items: categories,
                      onChange: (e) => {
                        setHasChanged(true);
                        const selectedCurrency = currenciesList.find((currency) => e.target.value === currency?.code);
                        setNewAppSettings((prev) => ({ ...prev, currency: selectedCurrency }));
                      },
                      //   readOnly: Boolean(newProductCategory) || productReadonly,
                    }}
                  />
                </InputBox>
                {/* Secondary Currency */}
                <InputBox
                  title="Secondary Currency"
                  endAdornment={`${newAppSettings?.currency?.symbol}`}
                  inputType="number"
                  sxLeft={{ width: '200px' }}
                  sxRight={{ width: '140px' }}
                  sxContainer={{ flex: 2 }}
                  isRenderedChild
                >
                  <StyledFormField
                    intputType="select"
                    containerProps={{
                      sx: {
                        width: '125px',
                      },
                    }}
                    inputProps={{
                      placeholder: 'Secondary currency',
                      value:
                        isUsedSecondaryCurrency !== 'disable'
                          ? newAppSettings?.secondaryCurrency?.code || ''
                          : 'disable',
                      items:
                        isUsedSecondaryCurrency !== 'disable'
                          ? [
                              getSecondaryCurrencyOptions[0],
                              ...currenciesList.map((currency) => {
                                const label = currency?.name_plural;
                                const value = currency?.code;
                                return { label, value };
                              }),
                            ]
                          : [...getSecondaryCurrencyOptions],
                      //   items: categories,
                      onChange: (e) => {
                        setHasChanged(true);
                        if (e.target.value === 'disable') {
                          setIsUsedSecondaryCurrency(e.target.value);

                          setNewAppSettings((prev) => ({ ...prev, secondaryCurrency: {}, exchangeRate: 1 }));
                          return;
                        }

                        if (e.target.value === 'enable') {
                          setTimeout(() => {
                            setIsUsedSecondaryCurrency('enable');
                            setNewAppSettings((prev) => ({
                              ...prev,
                              secondaryCurrency: {},
                              exchangeRate: 1,
                              acceptedCurrency: 'both',
                            }));
                          }, 100);
                          return;
                        }

                        const selectedCurrency = currenciesList.find((currency) => e.target.value === currency?.code);
                        setNewAppSettings((prev) => ({ ...prev, secondaryCurrency: selectedCurrency }));
                      },
                      //   readOnly: Boolean(newProductCategory) || productReadonly,
                    }}
                  />
                </InputBox>
              </Stack>
            </StyledBox>
            {isUsedSecondaryCurrency !== 'disable' && (
              <Box>
                <StyledBox title="Rate">
                  <Stack direction="row" alignItems="center" flexWrap="wrap">
                    <InputBox
                      title={`Amount of (${newAppSettings?.currency?.symbol})`}
                      endAdornment={`${newAppSettings?.currency?.symbol}`}
                      inputValue={`${1}`}
                      inputType="number"
                      sxLeft={{ width: '200px' }}
                      sxRight={{ width: '140px' }}
                      inputProps={{ readOnly: true, sx: { opacity: '0.5' } }}
                      sxContainer={{ flex: 1.7 }}
                    />

                    <InputBox
                      title={`Equivalent to ${
                        newAppSettings?.secondaryCurrency?.symbol ? `(${newAppSettings?.secondaryCurrency?.code})` : ''
                      }`}
                      endAdornment={`${
                        newAppSettings?.secondaryCurrency?.symbol ? newAppSettings?.secondaryCurrency?.code : ''
                      }`}
                      inputType="number"
                      sxLeft={{ width: '200px' }}
                      sxRight={{ width: '140px' }}
                      sxContainer={{ flex: 2 }}
                      isRenderedChild
                    >
                      <IncrementDecrementButton
                        isChangeOthers
                        isReadOnly={isUsedSecondaryCurrency === 'disable'}
                        changeOthers={() => {
                          setHasChanged(true);
                        }}
                        isValidateType={false}
                        incrementHandler={incrementByFiveHandler}
                        decrementHandler={decrementByFiveHandler}
                        objectKey="exchangeRate"
                        setValue={setNewAppSettings}
                        currentValue={newAppSettings?.exchangeRate}
                      />
                    </InputBox>
                  </Stack>
                </StyledBox>

                <StyledBox title="Accepted Currency">
                  <StyledFormField
                    intputType="select"
                    containerProps={{
                      sx: {
                        width: '125px',
                      },
                    }}
                    inputProps={{
                      placeholder: 'Accepted Currency',
                      value: newAppSettings?.acceptedCurrency || '',
                      items: getAcceptedCurrencyOptions(newAppSettings?.currency, newAppSettings?.secondaryCurrency),
                      onChange: (e) => {
                        setHasChanged(true);
                        setNewAppSettings((prev) => ({ ...prev, acceptedCurrency: e.target.value }));
                      },
                      //   readOnly: Boolean(newProductCategory) || productReadonly,
                    }}
                  />
                </StyledBox>
              </Box>
            )}
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
