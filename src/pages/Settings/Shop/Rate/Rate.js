import { Stack } from '@mui/material';

import { isNumber } from 'lodash';
import React from 'react';
import IncrementDecrementButton from '../../../AppSettings2/IncrementDecrementButton';
import InputBox from '../../Admin/Marketing/LoyaltySettings/InputBox';

function Rate({ shopSettings, setShopSettings, setHasChanged }) {
  const incrementHandler = (setValue, key) => {
    setHasChanged(true);
    setValue((prev) => {
      if (isNumber(parseInt(prev[key], 10)) && prev[key] !== '') return { ...prev, [key]: parseInt(prev[key], 10) + 5 };
      if (prev[key] === '') return { ...prev, [key]: 5 };
      return { ...prev };
    });
  };

  const decrementHandler = (setValue, key) => {
    setHasChanged(true);
    setValue((prev) => {
      if (isNumber(parseInt(prev[key], 10)) && prev[key] !== '' && parseInt(prev[key], 10) - 5 > 0)
        return { ...prev, [key]: parseInt(prev[key], 10) - 5 };
      if (prev[key] === '' || prev[key] <= 0) return { ...prev, [key]: 5 };
      return { ...prev };
    });
  };

  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap">
      <InputBox
        title={`Amount of (${shopSettings?.currency?.symbol})`}
        endAdornment={`${shopSettings?.currency?.symbol}`}
        inputValue={`${1}`}
        inputType="number"
        sxLeft={{ width: '200px' }}
        sxRight={{ width: '140px' }}
        inputProps={{ readOnly: true, sx: { opacity: '0.5' } }}
        sxContainer={{ flex: 1.5 }}
      />

      <InputBox
        title={`Equivalent to ${
          shopSettings?.secondaryCurrency?.symbol ? `(${shopSettings?.secondaryCurrency?.code})` : ''
        }`}
        endAdornment={`${shopSettings?.secondaryCurrency?.symbol ? shopSettings?.secondaryCurrency?.code : ''}`}
        inputType="number"
        sxLeft={{ width: '200px' }}
        sxRight={{ width: '140px' }}
        sxContainer={{ flex: 2 }}
        isRenderedChild
      >
        <IncrementDecrementButton
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
        />
      </InputBox>
    </Stack>
  );
}

export default Rate;
