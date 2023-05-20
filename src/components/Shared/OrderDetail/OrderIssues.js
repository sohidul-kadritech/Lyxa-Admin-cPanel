import { Stack, Typography, useTheme } from '@mui/material';
import { ReactComponent as FlagIcon } from '../../../assets/icons/order-flag.svg';
import { StyledOrderDetailBox } from './helpers';

export default function OrderIssues({ flags = [] }) {
  const theme = useTheme();

  return (
    <StyledOrderDetailBox
      title={
        <>
          <FlagIcon style={{ color: theme.palette.error.main, marginRight: '3px' }} /> Issues
        </>
      }
    >
      <Stack gap={1}>
        {flags?.map((item) => (
          <Typography variant="body2" fontSize={14} lineHeight="22px" key={item?._id}>
            {item?.comment}
          </Typography>
        ))}
      </Stack>
    </StyledOrderDetailBox>
  );
}
