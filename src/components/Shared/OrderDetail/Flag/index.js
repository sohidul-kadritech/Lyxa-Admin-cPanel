import { Stack, Typography } from '@mui/material';
import { ReactComponent as FlagIcon } from '../../../../assets/icons/order-flag.svg';
import { StyledOrderDetailBox } from '../helpers';
import { StyledListItem } from './ListItem';
import FlagSummary from './Summary';

export default function FlagDetails({ order }) {
  return (
    <Stack gap={4}>
      {!order?.flag?.length && (
        <Stack pt={30} pb={3}>
          <Typography textAlign="center" variant="body1">
            No Flags
          </Typography>
        </Stack>
      )}
      {order?.flag?.length && (
        <>
          <StyledOrderDetailBox
            title={
              <span>
                <FlagIcon color="#DD5B63" /> Flag Details
              </span>
            }
          >
            <Stack gap={2}>
              {order?.flag?.map((item, i, { length: l }) => (
                <Stack
                  gap={1.5}
                  key={item?._id}
                  pt={1.5}
                  pb={i === l - 1 ? 0 : 1.5}
                  borderBottom={i === l - 1 ? undefined : '1px solid #eee'}
                >
                  <StyledListItem label="Flag Type: " value={item?.type} />
                  <StyledListItem label="Flag Comment: " value={item?.comment} />
                </Stack>
              ))}
            </Stack>
          </StyledOrderDetailBox>
          <StyledOrderDetailBox title="Summary">
            <FlagSummary order={order} />
          </StyledOrderDetailBox>
        </>
      )}
    </Stack>
  );
}
