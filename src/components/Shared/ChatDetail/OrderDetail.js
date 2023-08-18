import { useMemo } from 'react';
import OrderDetail from '../OrderDetail/Details';
import OrderContextProvider from '../OrderDetail/OrderContext';

export default function ChatOrderDetail({ order }) {
  const value = useMemo(
    () => ({
      baseCurrency: order?.baseCurrency?.symbol,
      secondaryCurrency: order?.secondaryCurrency?.code,
      shopExchangeRate: order?.shopExchangeRate,
      adminExchangeRate: order?.adminExchangeRate,
    }),
    []
  );

  return (
    <OrderContextProvider value={value}>
      <OrderDetail order={order} userType="admin" hideMoreOptions />
    </OrderContextProvider>
  );
}
