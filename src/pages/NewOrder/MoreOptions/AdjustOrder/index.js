/* eslint-disable no-unused-vars */
import { West } from '@mui/icons-material';
import { Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import socketServices from '../../../../common/socketService';
import CloseButton from '../../../../components/Common/CloseButton';
import CustomerInfo from '../../../../components/Shared/AdjustMentOrder/CustomerInfo';
import { matchedMeals } from '../../../../components/Shared/AdjustMentOrder/helpers';
import { successMsg } from '../../../../helpers/successMsg';
import * as API_URL from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import AdjustmentItemCard from './AdjustmentItem';
import ProductSuggestion from './ProductSuggestion';
import { generateProductData } from './helpers';

function AdjustOrderForShop({ currentOrder, onClose }) {
  const [adjustOrder, setAdjustOrder] = useState(currentOrder);

  const [replacementOrder, setReplacementOrder] = useState([]);

  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const [nextPage, setNextPage] = useState(false);

  const queryClient = useQueryClient();

  const adjustOrderRequestQuery = useMutation((data) => AXIOS.post(API_URL.ADJUST_ORDER_REQUEST, data), {
    onSuccess: (data, payload) => {
      if (data.status) {
        successMsg(data?.message, 'success');
        queryClient.invalidateQueries(API_URL.ORDER_LIST);
        queryClient.invalidateQueries(API_URL.URGENT_ORDER_COUNT);
        queryClient.invalidateQueries(API_URL.LATE_ORDER_COUNT);
        onClose();
        socketServices?.emit('updateOrder', {
          orderId: payload?.orderId,
        });
      } else {
        successMsg(data?.message, 'warn');
      }
    },
  });

  const onCheck = (product) => {
    setReplacementOrder((prev) => {
      const matched = matchedMeals(prev, product);
      const data = [...prev];

      if (matched?.isMatched) {
        data?.splice(matched?.index, 1);
        return [...data];
      }

      return [...data, { ...product, notes: '' }];
    });
  };

  const onAddNote = (product, e) => {
    setReplacementOrder((prev) => {
      const matched = matchedMeals(prev, product);

      const data = [...prev];

      if (matched?.isMatched) {
        data[matched?.index][e.target.name] = e.target.value;
      }

      return [...data];
    });
  };

  const onCheckProduct = (product) => {
    console.log('suggested', { product });
    setSuggestedProducts((prev) => {
      const matched = matchedMeals(prev, product);
      const data = [...prev];

      if (data?.find((prdct) => prdct?._id === product?._id)) {
        return data?.filter((prdct) => prdct?._id !== product?._id);
      }

      return [...data, { ...product }];
    });
  };

  const onConfirm = () => {
    const validate = generateProductData(adjustOrder, replacementOrder, suggestedProducts);

    if (validate?.status) {
      adjustOrderRequestQuery.mutate(validate?.data);
      return;
    }

    successMsg(validate?.msg);
  };

  return (
    <Paper
      sx={{
        width: 'min(90vw, 1530px)',
        height: 'min(90vh, 1250px)',
        background: '#fff',
        position: 'relative',
        top: '0px',
        borderRadius: '8px',
        padding: '20px',
        overflow: 'auto',
        transition: 'all 0.3s linear',
      }}
    >
      <Stack sx={{ position: 'relative', top: '0px' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          pb={5}
          sx={{
            position: 'sticky',
            padding: '16px 0px',
            top: '-20px',
            zIndex: '999',
            backgroundColor: '#fbfbfb',
          }}
        >
          <Stack direction="row" alignItems="center" gap={4}>
            {nextPage && (
              <IconButton onClick={() => setNextPage(false)}>
                <West />
              </IconButton>
            )}
            <Typography fontSize="18px" variant="h4">
              {!nextPage ? 'Select Items to replaced' : 'Choose Suggestion (Optional)'}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" gap={2.5}>
            {!nextPage && (
              <CustomerInfo
                title={adjustOrder?.user?.name}
                image={adjustOrder?.user?.profile_photo}
                subtitle={adjustOrder?.user?.phone_number}
              />
            )}
            <CloseButton
              onClick={() => {
                onClose();
              }}
            />
          </Stack>
        </Stack>

        {!nextPage ? (
          <Stack gap={4}>
            {adjustOrder?.productsDetails?.map((product, i) => {
              const matched = matchedMeals(replacementOrder, product);
              const note = matched?.isMatched ? replacementOrder[matched?.index]?.note : '';
              return (
                <AdjustmentItemCard
                  key={i}
                  product={product}
                  shopExchangeRate={adjustOrder?.shop?.shopExchangeRate}
                  isChecked={matched.isMatched}
                  notes={note}
                  onCheck={onCheck}
                  onAddNote={onAddNote}
                />
              );
            })}
          </Stack>
        ) : (
          <ProductSuggestion OnCheckProduct={onCheckProduct} suggestedProducts={suggestedProducts} />
        )}

        {replacementOrder?.length > 0 && (
          <Stack
            direction="row"
            justifyContent="center"
            gap={2.5}
            mt={4}
            sx={{
              position: 'sticky',
              padding: '16px 0px',
              bottom: '-20px',
              paddingBottom: '20px',
              zIndex: '999',
              backgroundColor: '#fbfbfb',
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              sx={{
                minWidth: '250px',
              }}
              onClick={onClose}
              disabled={adjustOrderRequestQuery?.isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{
                minWidth: '250px',
              }}
              disabled={adjustOrderRequestQuery?.isLoading}
              onClick={() => {
                if (!nextPage) setNextPage(true);
                else {
                  onConfirm();
                }
              }}
            >
              {nextPage ? 'Confirm & send' : 'Next'}
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

export default AdjustOrderForShop;
