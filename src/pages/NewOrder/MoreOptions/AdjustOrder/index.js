/* eslint-disable no-unused-vars */
import { Button, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import CloseButton from '../../../../components/Common/CloseButton';
import CustomerInfo from '../../../../components/Shared/AdjustMentOrder/CustomerInfo';
import { matchedMeals } from '../../../../components/Shared/AdjustMentOrder/helpers';
import AdjustmentItemCard from './AdjustmentItem';
import ProductSuggestion from './ProductSuggestion';

function AdjustOrderForShop({ currentOrder, onClose }) {
  const [adjustOrder, setAdjustOrder] = useState(currentOrder);

  const [replacementOrder, setReplacementOrder] = useState([]);

  const [nextPage, setNextPage] = useState(false);

  const onCheck = (product) => {
    setReplacementOrder((prev) => {
      const matched = matchedMeals(prev, product);
      const data = [...prev];

      if (matched?.isMatched) {
        return data?.filter((prdct) => prdct?.productId !== product?.productId);
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

  return (
    <Paper
      sx={{
        width: 'min(90vw, 1530px)',
        height: 'min(90vh, 1250px)',
        background: '#fff',
        position: 'relative',
        borderRadius: '8px',
        padding: '20px',
        overflow: 'auto',
        transition: 'all 0.3s linear',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
        <Typography fontSize="18px" variant="h4">
          {!nextPage ? 'Select Items to replaced' : 'Choose Suggestion (Optional)'}
        </Typography>
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
            const findCheckedOrder = replacementOrder?.find((item) => item?.productId === product?.productId);
            const notes = findCheckedOrder ? findCheckedOrder?.notes : '';
            return (
              <AdjustmentItemCard
                key={i}
                product={product}
                shopExchangeRate={adjustOrder?.shop?.shopExchangeRate}
                isChecked={replacementOrder?.find((item) => item?.productId === product?.productId)}
                notes={notes}
                onCheck={onCheck}
                onAddNote={onAddNote}
              />
            );
          })}
        </Stack>
      ) : (
        <ProductSuggestion />
      )}

      {replacementOrder?.length > 0 && (
        <Stack direction="row" justifyContent="center" gap={2.5} mt={4}>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              minWidth: '250px',
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              minWidth: '250px',
            }}
            onClick={() => {
              setNextPage(true);
            }}
          >
            {nextPage ? 'Confirm & send' : 'Next'}
          </Button>
        </Stack>
      )}
    </Paper>
  );
}

export default AdjustOrderForShop;
