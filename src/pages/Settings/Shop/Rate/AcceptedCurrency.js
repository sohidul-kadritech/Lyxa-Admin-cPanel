import { Stack } from '@mui/material';

import React from 'react';
import StyledFormField from '../../../../components/Form/StyledFormField';

import { getAcceptedCurrencyOptions } from '../../../AppSettings2/helpers';
import InputBox from '../../Admin/Marketing/LoyaltySettings/InputBox';

function AcceptedCurrency({ shopSettings, setShopSettings, setHasChanged }) {
  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap">
      <InputBox
        title="Accepted Currency"
        // endAdornment={`${shopSettings?.secondaryCurrency?.symbol ? shopSettings?.secondaryCurrency?.symbol : ''}`}
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
            placeholder: 'Accepted Currency',
            readOnly: true,
            value: shopSettings?.shopAcceptedCurrency || '',
            items: getAcceptedCurrencyOptions(shopSettings?.currency, shopSettings?.secondaryCurrency),
            onChange: (e) => {
              setHasChanged(true);
              setShopSettings((prev) => ({ ...prev, shopAcceptedCurrency: e.target.value }));
            },
            //   readOnly: Boolean(newProductCategory) || productReadonly,
          }}
        />
      </InputBox>
    </Stack>
  );
}

export default AcceptedCurrency;
