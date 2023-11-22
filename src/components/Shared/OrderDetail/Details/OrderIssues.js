/* eslint-disable no-unused-vars */
import { Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import { ReactComponent as FlagIcon } from '../../../../assets/icons/order-flag.svg';
import { StyledOrderDetailBox } from '../helpers';

export default function OrderIssues({ flags = [], sx, urgentText = '' }) {
  const theme = useTheme();
  const isResolved = flags?.reduce((acc, curr) => acc && curr?.isResolved, true);

  const flaggReasonMap = {};

  console.log('isResolved', isResolved);

  console.log({ flags });

  const uniqueReason = new Set();
  const uniqueReason2 = {};

  const getFlaggReason = (item, addToTheSet = false) => {
    if (item?.type === 'delay') {
      if (addToTheSet) {
        uniqueReason.add(item?.comment);
      }
      uniqueReason2[item?.type] = item?.comment;
      return item?.comment;
    }

    const reason = item?.otherReason ? item?.otherReason : item?.flaggedReason;
    if (addToTheSet) {
      uniqueReason.add(reason);
    }
    uniqueReason2[item?.type] = reason;
    return reason;
  };

  // {item?.comment}

  console.log({ uniqueReason2 });

  return (
    <StyledOrderDetailBox
      sx={sx}
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
          // uniqueReason.add(getFlaggReason(item));

          <Stack key={item?._id} gap="1px">
            <Typography variant="body2" fontSize={14} lineHeight="22px">
              <span
                style={{
                  textTransform: 'capitalize',
                  fontWeight: 700,
                  color: item?.isResolved ? undefined : '#dd5b63',
                }}
              >
                {item?.type}
              </span>{' '}
              <span style={{ fontSize: 13 }}>
                - Flagged on {moment(item?.createdAt).format('hh:mm A MMM DD, YYYY')}
              </span>
            </Typography>
            {item?.type === 'delay' && !uniqueReason?.has(getFlaggReason(item)) ? (
              <Typography variant="body2" fontSize={12} lineHeight="22px">
                <span
                  style={{
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    color: item?.isResolved ? undefined : '#dd5b63',
                  }}
                >
                  Reason:{' '}
                </span>
                {getFlaggReason(item, true)}
              </Typography>
            ) : item?.type !== 'user' && !uniqueReason?.has(getFlaggReason(item)) ? (
              <Typography variant="body2" fontSize={12} lineHeight="22px">
                <span
                  style={{
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    color: item?.isResolved ? undefined : '#dd5b63',
                  }}
                >
                  Reason:{' '}
                </span>
                {getFlaggReason(item, true)}
              </Typography>
            ) : null}
          </Stack>
        ))}
      </Stack>
    </StyledOrderDetailBox>
  );
}
