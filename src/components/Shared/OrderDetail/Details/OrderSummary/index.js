/* eslint-disable no-unsafe-optional-chaining */
import { StyledOrderDetailBox } from '../../helpers';
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
      {order?.cart?.cartType === 'group' ? <GroupOrder order={order} /> : <RegularOrder order={order} />}
    </StyledOrderDetailBox>
  );
}
