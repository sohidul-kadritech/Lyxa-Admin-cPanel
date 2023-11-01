/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Add } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useGlobalContext } from '../../../../context';
import CallUser from '../../OrderDetail/Details/CallUser';
import { productDeal } from '../../OrderDetail/Details/OrderSummary/Product';
import AdjustMentProduct from '../AdjustMentProduct';
import StyledAdjustmentOrderContainer from '../StyledAdjustmentOrderContainer';
import StyledProductSelector from '../StyledProductSelector';
import { makeSingleProductDetails, matchedMeals, populateProductData } from '../helpers';

function AdjustMentOrderSummary({ order, setAdjustedOrder }) {
  const { currentUser } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const { userType } = currentUser;
  const totalProductQuantity = order?.productsDetails?.reduce((prev, curr) => curr?.productQuantity + prev, 0);
  const history = useHistory();
  const routeMatch = useRouteMatch();

  const onIncrementDecrement = (type, value) => {
    setAdjustedOrder((prev) => {
      const matched = matchedMeals(prev?.productsDetails, value?.product);
      const deal = productDeal(prev.productsDetails[matched?.index]);
      let productData = prev?.productsDetails;
      if (matched?.isMatched && value?.value > 0) {
        productData[matched?.index].productQuantity = value?.value;
        productData = populateProductData(productData, order?.shop?.shopExchangeRate);
      } else {
        productData?.splice(matched?.index, 1);
        productData = populateProductData(productData, order?.shop?.shopExchangeRate);
      }

      return { ...prev, productsDetails: productData };
    });
  };

  const onDeleteProduct = (data) => {
    // order?.productsDetails

    setAdjustedOrder((prev) => {
      // remove the products
      const matched = matchedMeals(prev?.productsDetails, data);

      if (matched?.index > -1) prev.productsDetails?.splice(matched?.index, 1);

      return { ...prev };
    });
  };

  const onClickProduct = (data) => {
    setAdjustedOrder((prev) => {
      const newProduct = makeSingleProductDetails(data?.product);

      // remove the products
      const matched = matchedMeals(prev?.productsDetails, newProduct);

      const deal = productDeal(prev.productsDetails[matched?.index]);

      let testDoubleDeal = prev?.productsDetails;

      // matched
      console.log('new product:', { newProduct, matched });

      if (matched?.isMatched) {
        const deal = productDeal(prev.productsDetails[matched?.index]);
        testDoubleDeal[matched?.index].productQuantity += newProduct?.productQuantity;
        testDoubleDeal = populateProductData(testDoubleDeal, order?.shop?.shopExchangeRate);
      } else if (!matched?.shouldAddInLastIndex) {
        console.log(matched?.lastIndex, newProduct);
        testDoubleDeal?.splice(matched?.lastIndex, 0, newProduct);
        testDoubleDeal = populateProductData(testDoubleDeal, order?.shop?.shopExchangeRate);
      } else {
        testDoubleDeal.push(newProduct);
        testDoubleDeal = populateProductData(testDoubleDeal, order?.shop?.shopExchangeRate);
      }

      console.log({ prev });

      return { ...prev, productsDetails: testDoubleDeal };
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
              onIncrementDecrement={onIncrementDecrement}
            />
          ))}
        </Stack>
      </StyledAdjustmentOrderContainer>
      <Stack>
        {open && (
          <StyledProductSelector order={order} setAdjustedOrder={setAdjustedOrder} onClickProduct={onClickProduct} />
        )}
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
