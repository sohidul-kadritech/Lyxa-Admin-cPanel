import { Stack } from '@mui/material';
import OptionsSelect from '../../../../components/Filter/OptionsSelect';

export function ShopAction2({ actionSx, options, ...props }) {
  return (
    <Stack sx={actionSx} direction="row" marginTop="22px" justifyContent="start" spacing={3} alignItems="center">
      <OptionsSelect
        value={props.value}
        items={options}
        onChange={(value) => {
          props.action(value);
        }}
        {...props}
      />
    </Stack>
  );
}
