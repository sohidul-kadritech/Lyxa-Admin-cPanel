/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ConfirmModal from '../../components/Common/ConfirmModal';
import PageTop from '../../components/Common/PageTop';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import AppSettingsSkeleton from './AppSettingsSkeleton';
import SettingsForButler from './Settings/SettingsForButler';
import SettingsForCurrency from './Settings/SettingsForCurrency';
import SettingsForDeliveryBoySearchArea from './Settings/SettingsForDeliveryBoySearchArea';
import SettingsForUnits from './Settings/SettingsForUnits';
import SettingsForVAT from './Settings/SettingsForVAT';
import SettingsWithIncrementDecrementButton from './Settings/SettingsWithIncrementDecrementButton';
import {
  appSettingsValidateData,
  decrementByFiveHandler,
  decrementByOneHandler,
  incrementByFiveHandler,
  incrementByOneHandler,
  separatesUpdatedData,
  validateList,
} from './helpers';

// breadcrumb items list here
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

// initial currency when we have not currency selected before.
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

// provide error message for each request, because we use 3 api simultaneously
const provideErrorMessage = (data) => {
  for (let i = 0; i < data.length; i++) {
    if (!data[i].status) {
      successMsg(data[i].message, 'error');
    }
  }
};

function Appsettings2() {
  const queryClient = useQueryClient();

  // for discard and confirmation
  const [isConfirm, setIsconfirm] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  // store units data
  const [units, setUnits] = useState([]);
  const [deletedUnitId, setDeletedUnitId] = useState([]);
  const [oldUnits, setOldUnits] = useState([]);

  // store appSettings data
  const [newAppSettings, setNewAppSettings] = useState({});
  const [oldAppSettings, setOldAppSettings] = useState({});
  const [isUsedSecondaryCurrency, setIsUsedSecondaryCurrency] = useState('');
  const { general, dispatchGeneral } = useGlobalContext();

  // Get all app settings data
  const getAppSettingsData = useQuery([API_URL.APP_SETTINGS], () => AXIOS.get(API_URL.APP_SETTINGS), {
    onSuccess: (data) => {
      if (data.status) {
        setOldAppSettings(data?.data?.appSetting);
        setNewAppSettings(data?.data?.appSetting);

        dispatchGeneral({ type: 'appSetting', payload: { appSetting: data?.data?.appSetting } });

        // check wheater secondary currency is  enable or disable.
        setIsUsedSecondaryCurrency(() => {
          const currency =
            Object?.keys(data?.data?.appSetting.secondaryCurrency || {})?.length > 1 ? 'enable' : 'disable';
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
        Promise.all([
          queryClient.invalidateQueries(API_URL.APP_SETTINGS),
          queryClient.invalidateQueries(API_URL.GET_ALL_UNIT),
        ]);

        if (data.length === 4 && data[0].status && data[1].status && data[2].status && data[2].status) {
          successMsg('Updated Succesfully', 'success');
          setHasChanged(false);
        } else if (data.length === 3 && data[0].status && data[1].status && data[2].status) {
          successMsg('Updated Succesfully', 'success');
          setHasChanged(false);
        } else if (data.length === 1 && data[0].status) {
          successMsg('Updated Succesfully', 'success');
          setHasChanged(false);
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

    setIsUsedSecondaryCurrency(() => {
      const currency =
        Object?.keys(getAppSettingsData?.data?.data?.appSetting.secondaryCurrency || {})?.length > 1
          ? 'enable'
          : 'disable';
      return currency;
    });

    setUnits(getAllUnits?.data?.data || []);
  };
  // add new bundle
  const addNewBundleItem = (bundle, setBundle, oldbundle, objectKey, type = 'number') => {
    if (validateList(bundle, oldbundle, type) && type === 'number') {
      setBundle((prev) => ({ ...prev, [objectKey]: [...oldbundle, Number(bundle)] }));
      setHasChanged(true);
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
  // on update handler
  const updateData = () => {
    console.log({ newAppSettings });
    const generatedData = appSettingsValidateData(oldAppSettings, newAppSettings);

    if (isUsedSecondaryCurrency === 'enable' && !newAppSettings.secondaryCurrency?.symbol) {
      successMsg('Select a secondary currency or disable it!', 'error');
      return;
    }

    if (
      isUsedSecondaryCurrency === 'enable' &&
      newAppSettings?.secondaryCurrency?.symbol &&
      newAppSettings?.secondaryCurrency?.symbol === newAppSettings?.baseCurrency?.symbol
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
          fontWeight: 700,
          backgroundColor: '#fbfbfb',
        }}
      />
      <Box sx={{ backgroundColor: '#ffffff', borderRadius: '7px', padding: '30px' }}>
        {getAppSettingsData?.isLoading || getAllUnits?.isLoading ? (
          <AppSettingsSkeleton />
        ) : (
          <>
            {/* Settings for butler */}
            <SettingsForButler
              newAppSettings={newAppSettings}
              setNewAppSettings={setNewAppSettings}
              setHasChanged={setHasChanged}
            />

            {/* Settings for lyxa pay limit (customer service) */}
            <SettingsWithIncrementDecrementButton
              title={`Lyxa Pay Limit (Customer Service) (${newAppSettings?.baseCurrency?.symbol})`}
              endAdornment={newAppSettings?.baseCurrency?.symbol}
              objectKey="maxCustomerServiceValue"
              newAppSettings={newAppSettings}
              setNewAppSettings={setNewAppSettings}
              setHasChanged={setHasChanged}
              action={{
                incrementHandler: incrementByOneHandler,
                decrementHandler: decrementByOneHandler,
              }}
            />

            {/* Settings for VAT Percentage */}

            <SettingsForVAT
              endAdornment="%"
              newAppSettings={newAppSettings}
              setNewAppSettings={setNewAppSettings}
              setHasChanged={setHasChanged}
            />

            {/* Settings for Delivery Boy Search Area */}
            <SettingsForDeliveryBoySearchArea
              newAppSettings={newAppSettings}
              setNewAppSettings={setNewAppSettings}
              setHasChanged={setHasChanged}
              addNewBundleItem={addNewBundleItem}
            />

            {/* Settings for Shop distance */}
            <SettingsWithIncrementDecrementButton
              title="Shop Distance (KM)"
              endAdornment="KM"
              objectKey="nearByShopKm"
              newAppSettings={newAppSettings}
              setNewAppSettings={setNewAppSettings}
              setHasChanged={setHasChanged}
              action={{
                incrementHandler: incrementByFiveHandler,
                decrementHandler: decrementByFiveHandler,
              }}
            />

            {/* settings for near shop distance in home screens */}
            <SettingsWithIncrementDecrementButton
              title="Near Shop Distance in Home Screen (KM)"
              endAdornment="KM"
              objectKey="nearByShopKmForUserHomeScreen"
              newAppSettings={newAppSettings}
              setNewAppSettings={setNewAppSettings}
              setHasChanged={setHasChanged}
              action={{
                incrementHandler: incrementByFiveHandler,
                decrementHandler: decrementByFiveHandler,
              }}
            />

            {/* Settings for maximum discount for lyxa */}
            <SettingsWithIncrementDecrementButton
              endAdornment={newAppSettings?.baseCurrency?.symbol}
              title="Maximum Discount Per Item for Lyxa (Marketing)"
              objectKey="maxDiscount"
              newAppSettings={newAppSettings}
              setNewAppSettings={setNewAppSettings}
              setHasChanged={setHasChanged}
              action={{
                incrementHandler: incrementByFiveHandler,
                decrementHandler: decrementByFiveHandler,
              }}
            />

            {/* Settings for untis  */}
            <SettingsForUnits
              units={units}
              setUnits={setUnits}
              setHasChanged={setHasChanged}
              setDeletedUnitId={setDeletedUnitId}
              addNewBundleItem={addNewBundleItem}
            />

            {/* Settings for App Currency */}
            <SettingsForCurrency
              newAppSettings={newAppSettings}
              setNewAppSettings={setNewAppSettings}
              setHasChanged={setHasChanged}
              setIsUsedSecondaryCurrency={setIsUsedSecondaryCurrency}
              isUsedSecondaryCurrency={isUsedSecondaryCurrency}
            />
          </>
        )}
      </Box>

      {/* Submit and discard button */}
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

      {/* confirm modal - to discard the changes */}
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
