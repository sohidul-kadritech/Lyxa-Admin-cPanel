/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import { StyledOrderDetailBox } from '../../helpers';
import CallUser from '../CallUser';
import GroupOrder from './GroupOrder';
import RegularOrder from './RegularOrder';

export default function OrderSummary({ order }) {
  const totalProductQuantity = order?.productsDetails?.reduce((prev, curr) => curr?.productQuantity + prev, 0);

  return (
    <StyledOrderDetailBox
      title={
        <span>
          Order Summary
          <span
            style={{
              fontStyle: 'italic',
            }}
          >
            {' '}
            x{totalProductQuantity || 0}
          </span>
        </span>
      }
    >
      <Box pt={3} pb={3}>
        <CallUser
          disableContainerStyle
          user={{
            name: order?.shop?.shopName,
            image: order?.shop?.shopLogo,
            number: order?.shop?.phone_number,
          }}
        />
      </Box>
      {order?.cart?.cartType === 'group' ? <GroupOrder order={order} /> : <RegularOrder order={order} />}
    </StyledOrderDetailBox>
  );
}
