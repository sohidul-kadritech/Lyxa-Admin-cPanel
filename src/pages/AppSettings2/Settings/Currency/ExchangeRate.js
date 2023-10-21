/* eslint-disable max-len */
import { Box, Stack } from '@mui/material';
import React from 'react';
import { TitleWithToolTip } from '../../../../components/Common/TitleWithToolTip';
import StyledFormField from '../../../../components/Form/StyledFormField';
import InputBox from '../../../Settings/Admin/Marketing/LoyaltySettings/InputBox';
import StyledBox from '../../../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';
import IncrementDecrementButton from '../../IncrementDecrementButton';
import { getAcceptedCurrencyOptions } from '../../helpers';

function ExchangeRate({ newAppSettings, setNewAppSettings, setHasChanged, isUsedSecondaryCurrency, action }) {
  const { incrementHandler, decrementHandler } = action;
  return (
    <Box>
      <StyledBox
        title={
          <TitleWithToolTip
            title="Rate"
            tooltip="Admins have the ability to change the exchange rate when secondary currency is enabled. Flexibility is provided by the store's ability to change this rate if it is within 10% less or greater or equalt to the administrator's rate."
          />
        }
      >
        <Stack direction="row" alignItems="center" flexWrap="wrap">
          {/* Amount of base currency which is disabled in user inteface */}
          <InputBox
            title={`Amount of ${
              newAppSettings?.baseCurrency?.symbol ? `(${newAppSettings?.baseCurrency?.symbol || ''})` : ''
            }`}
            endAdornment={`${newAppSettings?.baseCurrency?.symbol || ''}`}
            inputValue={`${1}`}
            inputType="number"
            sxLeft={{ width: '200px' }}
            sxRight={{ width: '140px' }}
            inputProps={{ readOnly: true, sx: { opacity: '0.5' } }}
            sxContainer={{ flex: 1.7 }}
          />

          {/* Settings for exchange rate amount */}
          <InputBox
            title={`Equivalent to ${
              newAppSettings?.secondaryCurrency?.symbol ? `(${newAppSettings?.secondaryCurrency?.code})` : ''
            }`}
            endAdornment={`${newAppSettings?.secondaryCurrency?.symbol ? newAppSettings?.secondaryCurrency?.code : ''}`}
            inputType="number"
            sxLeft={{ width: '200px' }}
            sxRight={{ width: '140px' }}
            sxContainer={{ flex: 2 }}
            isRenderedChild
          >
            <IncrementDecrementButton
              allowDecimal={false}
              isChangeOthers
              isReadOnly={isUsedSecondaryCurrency === 'disable'}
              changeOthers={() => {
                setHasChanged(true);
              }}
              isValidateType={false}
              incrementHandler={(setValue, key) => {
                incrementHandler(setValue, key, setHasChanged);
              }}
              decrementHandler={(setValue, key) => {
                decrementHandler(setValue, key, setHasChanged);
              }}
              objectKey="adminExchangeRate"
              setValue={setNewAppSettings}
              currentValue={newAppSettings?.adminExchangeRate}
            />
          </InputBox>
        </Stack>
      </StyledBox>

      {/* settings for accepted currency */}
      {false && (
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
              items: getAcceptedCurrencyOptions(newAppSettings?.baseCurrency, newAppSettings?.secondaryCurrency),
              onChange: (e) => {
                setHasChanged(true);
                setNewAppSettings((prev) => ({ ...prev, acceptedCurrency: e.target.value }));
              },
            }}
          />
        </StyledBox>
      )}
    </Box>
  );
}

export default ExchangeRate;
