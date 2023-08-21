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

  console.log('appSetting', appSetting);

  // const incrementHandler = (setValue, key) => {
  //   setHasChanged(true);
  //   setValue((prev) => {
  // eslint-disable-next-line max-len
  //     if (isNumber(parseInt(prev[key], 10)) && prev[key] !== '') return { ...prev, [key]: parseInt(prev[key], 10) + 5 };
  //     if (prev[key] === '') return { ...prev, [key]: 5 };
  //     return { ...prev };
  //   });
  // };

  // const decrementHandler = (setValue, key) => {
  //   setHasChanged(true);
  //   setValue((prev) => {
  //     if (isNumber(parseInt(prev[key], 10)) && prev[key] !== '' && parseInt(prev[key], 10) - 5 > 0)
  //       return { ...prev, [key]: parseInt(prev[key], 10) - 5 };
  //     if (prev[key] === '' || prev[key] <= 0) return { ...prev, [key]: 5 };
  //     return { ...prev };
  //   });
  // };

  console.log(
    appSetting?.adminExchangeRate - appSetting?.adminExchangeRate / 10,
    appSetting?.adminExchangeRate + appSetting?.adminExchangeRate / 10
  );

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
        {/* <IncrementDecrementButton
          isChangeOthers
          changeOthers={() => {
            setHasChanged(true);
          }}
          isValidateType={false}
          incrementHandler={incrementHandler}
          decrementHandler={decrementHandler}
          objectKey="shopExchangeRate"
          setValue={setShopSettings}
          currentValue={shopSettings?.shopExchangeRate}
        /> */}
        <IncrementDecrementInput
          value={shopSettings?.shopExchangeRate}
          min={Number(appSetting?.adminExchangeRate - appSetting?.adminExchangeRate / 10)}
          max={Number(appSetting?.adminExchangeRate + appSetting?.adminExchangeRate / 10)}
          onChange={(value) => {
            setShopSettings((prev) => ({ ...prev, shopExchangeRate: value }));
            setHasChanged(true);
          }}
        />
      </InputBox>
    </Stack>
  );
}

export default Rate;
