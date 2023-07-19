/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
import React from 'react';
import { useGlobalContext } from '../../../../context';
import { StyledOrderDetailBox } from '../helpers';

export default function ButlerAmountDetails({ order = {} }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;
  const exchangeRate = general?.appSetting?.exchangeRate;
  const totalPayment = order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0;

  return (
    <StyledOrderDetailBox title="Order Profit Details">
      {/* <Box pt={2}>
        <StyledItem label="Total Order Amount" value={(totalPayment || 0).toFixed(2)} />
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          <StyledItem
            label="Rider Profit"
            isCurrency={!order?.shop?.haveOwnDeliveryBoy}
            value={(order?.deliveryBoyFee || 0).toFixed(2)}
          />
        </Box>
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          {!order?.shop?.haveOwnDeliveryBoy && (
            <StyledItem label="Lyxa Delivery Profit" value={(order?.dropCharge || 0).toFixed(2)} />
          )}
        </Box>
        <Box borderTop="1px solid #EEEEEE" pt={3.5}>
          <StyledItem
            label="Total Lyxa Profit"
            value={`${secondaryCurrency} ${((order?.dropCharge || 0) * exchangeRate).toFixed(2)} ~ ${currency} ${(
              order?.dropCharge || 0
            ).toFixed(2)}`}
            isCurrency={false}
          />
          <StyledItem label="Lyxa VAT" value={(order?.vatAmount?.vatForAdmin || 0).toFixed(2)} pbsx={0} />
        </Box>
      </Box> */}
    </StyledOrderDetailBox>
  );
}
