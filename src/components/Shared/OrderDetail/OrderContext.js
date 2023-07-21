import { createContext } from 'react';

export const OrderContext = createContext();

export default function OrderContextProvider({ children, value }) {
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
