/* eslint-disable max-len */
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
import SettingsForVAT from './Settings/SettingsForVAT';
import SettingsWithBundle from './Settings/SettingsWithBundle';
import SettingsWithIncrementDecrementButton from './Settings/SettingsWithIncrementDecrementButton';
import {
  appSettingsValidateData,
  decrementByFiveHandler,
  decrementByOneHandler,
  incrementByFiveHandler,
  incrementByOneHandler,
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

const initialAppCurrency = {
  baseCurrency: {
    symbol: '$',
    name: 'US Dollar',
    symbol_native: '$',
    decimal_digits: 2,
    rounding: 0,
    code: 'USD',
    name_plural: 'US dollars',
    flag: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAALESURBVHja7Jc/aBNxFMc/l0STtqYtihgkYLOYitjuFuwiUgfBUOgSOqS6CNqmRRqLmyjBBDQ4FLRL/TOokEEhgyC4O7RSB0MHWxEtWLGtrW2Su/s9h8ZeUlF7rV4XHzy+995v+d77vnf3fpqIsJ3mYpvtPwENcAPeMjppJlD0APXHj9/44nZvrhh3d45tsvYuAk9GdwM0nTiRkZmZb3L9+jPbuBUDmjyA1zAUIyMviMXaSaVzDPSfJJ3O0V+JqRz9A1acSufQgC+XrlpvJRXCVua06nNXYz36m0kArwtAKUVPTzvJ5FPifR0kk0/pW4/x6jje10GhoEOhaHmx7OtzP50XQDfWOIbb2lISjz+SqakFicVGN4yx2OhWJQh7AAzDJB7vYHDwEclkF4nExnBo6DGz3Rfs959/F8aHGQDKBBSJxEOuXeuit/cemUz3hhBA6d82NfxSKlkStLZekcnJeTl2LC35/Jwt/CsS6LpJT88d7oycJRod5sH9c0Sjw9z/A4Lw8egp0MptLmI9V8br8prPB8WCJYGuK27fPkPk9E2y2T5ORzJks71EIqtxZC2uznd23kJ8y9Vj9zv7MZKGjlROQSg0JKHQZZmYmJVgMLFhDAYTW5YAIBwMJmR8/JPU1Z2XsTF7OL3nkH0PtMj7g20ChDUgHAhczC8tlTAM03ZD52ue258CjwfNX8eBty+bNSBsmmbe5XL2z6yUwu12N3sApve34jFMpKQ7swPs3IGxw2NNgTINRARRpv1tQtbFld3+q3VT3CjTsAgE34/j8/kclWBlZQVqa1cJTO89TI3XiyyvOCNBbQ3LpaK1E5pKVX/B/jkDDaWkQoKPr2hoaHBUgoWFBWhsXCXwLtBCY73fUQJzXxfXKmDqfpPPMu8oAfEDBUwN2AccAfY6vJbPAq+18p3AX0YnrQgsav8vp9tN4PsALYQJa7MTgzkAAAAASUVORK5CYII=',
  },
  secondaryCurrency: {},
  units: [],
  nearByShopKm: 0,
  nearByShopKmForUserHomeScreen: 0,
  maxDistanceForButler: 0,
  maxDiscount: 0,
  searchDeliveryBoyKm: [],
  adminExchangeRate: 0,
  maxTotalEstItemsPriceForButler: 0,
  maxCustomerServiceValue: 0,
  acceptedCurrency: 'base',
  vat: 0,
};

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

  // store appSettings data
  const [newAppSettings, setNewAppSettings] = useState({
    ...initialAppCurrency,
  });

  const [oldAppSettings, setOldAppSettings] = useState({});

  const [isUsedSecondaryCurrency, setIsUsedSecondaryCurrency] = useState('');

  const { general, dispatchGeneral } = useGlobalContext();

  const [disableCurrency, setDisableCurrency] = useState({
    base: false,
    secondary: false,
  });

  // Get all app settings data
  const getAppSettingsData = useQuery([API_URL.APP_SETTINGS], () => AXIOS.get(API_URL.APP_SETTINGS), {
    onSuccess: (data) => {
      if (data.status) {
        setOldAppSettings(data?.data?.appSetting ? data?.data?.appSetting : { ...initialAppCurrency });
        setNewAppSettings(data?.data?.appSetting ? data?.data?.appSetting : { ...initialAppCurrency });
        dispatchGeneral({ type: 'appSetting', payload: { appSetting: data?.data?.appSetting } });
        setDisableCurrency({
          base: Object?.keys(data?.data?.appSetting?.baseCurrency || {})?.length > 1,
          secondary: Object?.keys(data?.data?.appSetting?.secondaryCurrency || {})?.length > 1,
        });
      }
    },
  });

  // update data
  const updateQuery2 = useMutation(async (data) => AXIOS.post(API_URL.UPDATE_APP_SETTINGS, data?.appSettings), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg(data?.message, 'success');
        setHasChanged(false);
        queryClient.invalidateQueries(API_URL.APP_SETTINGS);
      } else {
        successMsg(data?.message, 'success');
      }
    },
    // eslint-disable-next-line prettier/prettier
  });

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
  };
  // // add new bundle
  // const addNewBundleItem = (bundle, setBundle, oldbundle, objectKey, type = 'number') => {
  //   if (validateList(bundle, oldbundle, type) && type === 'number') {
  //     setBundle((prev) => ({ ...prev, [objectKey]: [...oldbundle, Number(bundle)] }));
  //     setHasChanged(true);
  //     return true;
  //   }

  //   if (validateList(bundle, oldbundle, type) && type === 'text') {
  //     setHasChanged(true);
  //     setBundle((prev) => ({ ...prev, [objectKey]: [...oldbundle, bundle] }));
  //     return true;
  //   }
  //   return false;
  // };

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

    if (newAppSettings?.acceptedCurrency === 'both' && !newAppSettings?.adminExchangeRate) {
      successMsg('Please provide equivalent exchange rate of base currency', 'error');
      return;
    }

    if (newAppSettings?.acceptedCurrency === 'base' && newAppSettings?.adminExchangeRate > 0) {
      successMsg('Exchange rate must be zero when accepted currency base only.', 'error');
      return;
    }

    console.log('generatedData', generatedData);

    if (hasChanged) {
      updateQuery2.mutate({
        appSettings: generatedData,
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
        {getAppSettingsData?.isLoading ? (
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
              endAdornment={newAppSettings?.baseCurrency?.symbol || ''}
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
            <SettingsWithBundle
              title="Delivery Boy Search Area (KM)"
              objectKey="searchDeliveryBoyKm"
              newAppSettings={newAppSettings}
              setNewAppSettings={setNewAppSettings}
              setHasChanged={setHasChanged}
              // addNewBundleItem={addNewBundleItem}
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
              endAdornment={newAppSettings?.baseCurrency?.symbol || ''}
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

            {/* Settings for Delivery Boy Search Area */}
            <SettingsWithBundle
              title="Units"
              newAppSettings={newAppSettings}
              setNewAppSettings={setNewAppSettings}
              setHasChanged={setHasChanged}
              // addNewBundleItem={addNewBundleItem}
              objectKey="units"
              limit="infinity"
              bundleType="text"
            />

            {/* Settings for App Currency */}
            <SettingsForCurrency
              newAppSettings={newAppSettings}
              setNewAppSettings={setNewAppSettings}
              setHasChanged={setHasChanged}
              setIsUsedSecondaryCurrency={setIsUsedSecondaryCurrency}
              isUsedSecondaryCurrency={isUsedSecondaryCurrency}
              disableCurrency={disableCurrency}
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
          setIsconfirm(false);

          populateData();
          setHasChanged(false);
        }}
      />
    </Box>
  );
}

export default Appsettings2;
