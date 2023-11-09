/* eslint-disable no-unsafe-optional-chaining */
import { Stack } from '@mui/material';

import React from 'react';
import IncrementDecrementInput from '../../../../components/Form/IncrementDecrementInput';
import { useGlobalContext } from '../../../../context';
import InputBox from '../../Admin/Marketing/LoyaltySettings/InputBox';

function Rate({ shopSettings, setShopSettings, setHasChanged }) {
  const { general } = useGlobalContext();
  const { appSetting } = general;
  const secondaryCurrency = appSetting?.secondaryCurrency?.code;

  // console.log('appSetting', appSetting);

  // console.log(
  //   appSetting?.adminExchangeRate - appSetting?.adminExchangeRate / 10,
  //   // eslint-disable-next-line prettier/prettier
  //   appSetting?.adminExchangeRate + appSetting?.adminExchangeRate / 10,
  // );

  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap">
      <InputBox
        title={`Amount of (${appSetting?.baseCurrency?.symbol})`}
        endAdornment={`${secondaryCurrency}`}
        inputValue={`${1}`}
        inputType="number"
        sxLeft={{ width: '200px' }}
        sxRight={{ width: '140px' }}
        inputProps={{ readOnly: true, sx: { opacity: '0.5' } }}
        sxContainer={{ flex: 1.5 }}
      />

      <InputBox
        title={`Equivalent to ${
          appSetting?.secondaryCurrency?.symbol ? `(${appSetting?.secondaryCurrency?.code})` : ''
        }`}
        endAdornment={`${appSetting?.secondaryCurrency?.symbol ? appSetting?.secondaryCurrency?.code : ''}`}
        inputType="number"
        sxLeft={{ width: '200px' }}
        sxRight={{ width: '140px' }}
        sxContainer={{ flex: 2 }}
        isRenderedChild
      >
        <IncrementDecrementInput
          allowDecimal={false}
          value={shopSettings?.shopExchangeRate}
          min={Number(appSetting?.adminExchangeRate - appSetting?.adminExchangeRate / 10)}
          max={Number(appSetting?.adminExchangeRate + appSetting?.adminExchangeRate / 10)}
          onChange={(value) => {
            console.log({ output: value });
            setShopSettings((prev) => ({ ...prev, shopExchangeRate: value }));
            setHasChanged(true);
          }}
          onBlur={(value) => {
            setShopSettings((prev) => ({ ...prev, shopExchangeRate: value }));
            setHasChanged(true);
          }}
        />
      </InputBox>
    </Stack>
  );
}

export default Rate;
