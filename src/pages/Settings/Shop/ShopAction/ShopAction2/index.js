import { Stack } from '@mui/material';
import { useState } from 'react';
import OptionsSelect from '../../../../../components/Filter/OptionsSelect';

export function ShopAction2({ actionSx, options, ...props }) {
  console.log('isMultiple ?', props?.multiple, ' options: ', options);
  const [value, setValue] = useState(props.multiple ? props.value : options[0].value);
  console.log(props);
  return (
    <Stack sx={actionSx} direction="row" marginTop="22px" justifyContent="start" spacing={3} alignItems="center">
      <OptionsSelect
        value={value}
        items={options}
        onChange={(value) => {
          console.log('', value);
          if (props.multiple) props.action(value);
          else setValue(value);
          // props.action(value);
        }}
        {...props}
      />
    </Stack>
  );
}
