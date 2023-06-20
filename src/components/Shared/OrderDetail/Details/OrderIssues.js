import { Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import { ReactComponent as FlagIcon } from '../../../../assets/icons/order-flag.svg';
import { StyledOrderDetailBox } from '../helpers';

export default function OrderIssues({ flags = [] }) {
  const theme = useTheme();
  const isResolved = flags?.reduce((acc, curr) => acc && curr?.isResolved, true);

  console.log('isResolved', isResolved);
  console.log(flags);

  // {item?.comment}

  return (
    <StyledOrderDetailBox
      title={
        <span>
          <FlagIcon style={{ color: theme.palette.error.main, marginRight: '3px' }} /> Flags
          <span style={{ fontSize: 11, color: theme.palette.success.main }}>
            &nbsp;&nbsp;{isResolved && '(All Resolved)'}
          </span>
        </span>
      }
    >
      <Stack gap={3} pt={1.5}>
        {flags?.map((item) => (
          <Stack key={item?._id} gap="1px">
            <Typography
              variant="body2"
              fontSize={14}
              lineHeight="22px"
              color={item?.isResolved ? undefined : '#dd5b63'}
            >
              <span style={{ textTransform: 'capitalize', fontWeight: 700 }}>{item?.type}</span>{' '}
              <span style={{ fontSize: 13 }}>
                - Flagged on {moment(item?.createdAt).format('hh:mm A MMM DD, YYYY')}
              </span>
            </Typography>
            <Typography variant="body2" fontSize={12} lineHeight="22px">
              {item?.comment}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </StyledOrderDetailBox>
  );
}
