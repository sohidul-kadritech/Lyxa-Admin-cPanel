import { Stack } from '@mui/material';
import OptionsSelect from '../../../../components/Filter/OptionsSelect';

export function ShopAction2({ actionSx, options, ...props }) {
  // const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  return (
    <Stack
      sx={actionSx}
      direction="row"
      marginTop="22px"
      justifyContent="start"
      spacing={{ xs: 1, sm: 2, md: 3, lg: 3 }}
      useFlexGap
      alignItems="center"
      flexWrap="wrap"
    >
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
