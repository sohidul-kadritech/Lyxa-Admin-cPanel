/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { StyledOrderDetailBox } from '../../helpers';
import CallUser from '../CallUser';
import GroupOrder from './GroupOrder';
import RegularOrder from './RegularOrder';

export default function OrderSummary({ order }) {
  const totalProductQuantity = order?.productsDetails?.reduce((prev, curr) => curr?.productQuantity + prev, 0);
  const history = useHistory();
  const routeMatch = useRouteMatch();

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
          onClickName={() =>
            history.push({
              pathname: `/shop/profile/${order?.shop?._id}`,
              state: {
                from: routeMatch?.path,
                backToLabel: 'Back to previous',
              },
            })
          }
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
