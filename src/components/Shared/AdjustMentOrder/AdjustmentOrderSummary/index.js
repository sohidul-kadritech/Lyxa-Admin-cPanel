/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Add } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useGlobalContext } from '../../../../context';
import CallUser from '../../OrderDetail/Details/CallUser';
import AdjustMentProduct from '../AdjustMentProduct';
import StyledAdjustmentOrderContainer from '../StyledAdjustmentOrderContainer';
import StyledProductSelector from '../StyledProductSelector';
import { matchedMeals } from '../helpers';

function AdjustMentOrderSummary({ order, setAdjustedOrder }) {
  const { currentUser } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const { userType } = currentUser;
  const totalProductQuantity = order?.productsDetails?.reduce((prev, curr) => curr?.productQuantity + prev, 0);
  const history = useHistory();
  const routeMatch = useRouteMatch();

  const onIncrementDecrement = (type, value) => {
    console.log(type, value);
    matchedMeals(order?.productsDetails, value?.product);

    setAdjustedOrder((prev) => {
      // remove the products
      const matched = matchedMeals(prev?.productsDetails, value?.product);

      if (matched?.isMatched) {
        if (type === 'increment') {
          prev.productsDetails[matched?.index].productQuantity++;
        } else {
          prev.productsDetails[matched?.index].productQuantity--;
        }
      }

      return { ...prev };
    });
  };

  const onDeleteProduct = (data) => {
    // order?.productsDetails

    setAdjustedOrder((prev) => {
      // remove the products
      const updatedProducts = prev?.productsDetails?.filter((product) => product?.productId !== data?.productId);

      return { ...prev, productsDetails: [...updatedProducts] };
    });
  };

  const onDeleteAtribute = (data) => {
    setAdjustedOrder((prev) => {
      // remove the products

      const productDetails = [...prev?.productsDetails];

      // find index for product details
      const findItemsIndex = productDetails?.findIndex((product) => product?.productId === data?.product?.productId);

      if (findItemsIndex > -1) {
        // find index for product attributes
        const findAttributesIndex = productDetails[findItemsIndex]?.selectedAttributes?.findIndex(
          (attr) => attr?.id === data?.attribute?.id,
        );

        if (findAttributesIndex > -1) {
          const removeAttributes = productDetails[findItemsIndex]?.selectedAttributes[
            findAttributesIndex
          ]?.selectedItems?.filter((selectedItem) => selectedItem?._id !== data?.item?._id);

          // if there are only one items then remove whole atributes other wise one item
          if (removeAttributes?.length > 0)
            productDetails[findItemsIndex].selectedAttributes[findAttributesIndex].selectedItems = removeAttributes;
          else {
            productDetails[findItemsIndex].selectedAttributes.splice(findAttributesIndex, 1);
          }
        }
      }

      return { ...prev, productDetails: [...productDetails] };
    });
  };

  return (
    <Box>
      <StyledAdjustmentOrderContainer
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
            onClickName={
              userType === 'admin'
                ? () =>
                    history.push({
                      pathname: `/shop/profile/${order?.shop?._id}`,
                      state: {
                        from: routeMatch?.path,
                        backToLabel: 'Back to Orders',
                      },
                    })
                : undefined
            }
            user={{
              name: order?.shop?.shopName,
              image: order?.shop?.shopLogo,
              number: order?.shop?.phone_number,
            }}
          />
        </Box>
        <Stack>
          {order?.productsDetails?.map((product, i, { length: l }) => (
            <AdjustMentProduct
              product={product}
              key={i}
              isFirst={i === 0}
              isLast={i === l - 1}
              shopExchangeRate={order?.shop?.shopExchangeRate}
              onDeleteProduct={onDeleteProduct}
              onDeleteAtribute={onDeleteAtribute}
              onIncrementDecrement={onIncrementDecrement}
            />
          ))}
        </Stack>
      </StyledAdjustmentOrderContainer>
      <Stack>
        {open && <StyledProductSelector order={order} setAdjustedOrder={setAdjustedOrder} />}
        <Box paddingLeft="16px" mt={open ? 0 : 4} mb={4}>
          <Button
            disableRipple
            startIcon={<Add />}
            sx={{
              textDecoration: 'underline',
            }}
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          >
            Add Item
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default AdjustMentOrderSummary;
