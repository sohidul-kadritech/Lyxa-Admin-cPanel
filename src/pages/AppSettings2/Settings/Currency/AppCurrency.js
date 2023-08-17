import { Stack } from '@mui/material';
import React from 'react';
import currenciesList from '../../../../common/data/currencyList';
import StyledFormField from '../../../../components/Form/StyledFormField';
import InputBox from '../../../Settings/Admin/Marketing/LoyaltySettings/InputBox';
import StyledBox from '../../../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';
import { getSecondaryCurrencyOptions } from '../../helpers';

// eslint-disable-next-line no-unused-vars
function BaseCurrency({ newAppSettings, setNewAppSettings, setHasChanged }) {
  return (
    <InputBox
      title="Base Currency"
      endAdornment={`${newAppSettings?.baseCurrency?.symbol}`}
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
          value: newAppSettings?.baseCurrency?.code || '',
          items: currenciesList.map((currency) => {
            const label = currency?.name_plural;
            const value = currency?.code;
            return { label, value };
          }),
          //   items: categories,
          onChange: (e) => {
            setHasChanged(true);
            const selectedCurrency = currenciesList.find((currency) => e.target.value === currency?.code);
            setNewAppSettings((prev) => ({ ...prev, baseCurrency: selectedCurrency }));
          },
        }}
      />
    </InputBox>
  );
}
// eslint-disable-next-line no-unused-vars
function SecondaryCurrency({
  newAppSettings,
  setNewAppSettings,
  setHasChanged,
  isUsedSecondaryCurrency,
  setIsUsedSecondaryCurrency,
}) {
  console.log('isUsedSecondaryCurrency', isUsedSecondaryCurrency);
  return (
    <InputBox
      title="Secondary Currency"
      endAdornment={`${newAppSettings?.baseCurrency?.symbol}`}
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
          value: isUsedSecondaryCurrency !== 'disable' ? newAppSettings?.secondaryCurrency?.code || '' : 'disable',
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

              setNewAppSettings((prev) => ({ ...prev, secondaryCurrency: {}, adminExchangeRate: 0 }));
              return;
            }

            if (e.target.value === 'enable') {
              setTimeout(() => {
                setIsUsedSecondaryCurrency('enable');
                setNewAppSettings((prev) => ({
                  ...prev,
                  secondaryCurrency: {},
                  adminExchangeRate: 1,
                  acceptedCurrency: 'both',
                }));
              }, 100);
              return;
            }

            const selectedCurrency = currenciesList.find((currency) => e.target.value === currency?.code);
            setNewAppSettings((prev) => ({ ...prev, secondaryCurrency: selectedCurrency }));
          },
        }}
      />
    </InputBox>
  );
}

function AppCurrency({
  newAppSettings,
  setNewAppSettings,
  setHasChanged,
  isUsedSecondaryCurrency,
  setIsUsedSecondaryCurrency,
}) {
  return (
    <StyledBox title="App Currency">
      <Stack direction="row" alignItems="center" flexWrap="wrap">
        <BaseCurrency
          newAppSettings={newAppSettings}
          setNewAppSettings={setNewAppSettings}
          setHasChanged={setHasChanged}
        />
        <SecondaryCurrency
          newAppSettings={newAppSettings}
          setNewAppSettings={setNewAppSettings}
          setHasChanged={setHasChanged}
          isUsedSecondaryCurrency={isUsedSecondaryCurrency}
          setIsUsedSecondaryCurrency={setIsUsedSecondaryCurrency}
        />
      </Stack>
    </StyledBox>
  );
}

export default AppCurrency;
