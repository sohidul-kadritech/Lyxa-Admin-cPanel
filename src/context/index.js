import { createContext, useContext, useMemo, useReducer } from 'react';
import { currentUserInit, currentUserReducer } from './currentUser';
import { shopTabsInit, shopTabsReducer } from './shopTabs';

/*
Global Store
*/
const Context = createContext();
/*
Global Store Provider
*/
export default function ContextProvider({ children }) {
  const [currentUser, dispatchCurrentUser] = useReducer(currentUserReducer, currentUserInit);
  const [shopTabs, dispatchShopTabs] = useReducer(shopTabsReducer, shopTabsInit);

  const value = useMemo(
    () => ({ currentUser, dispatchCurrentUser, shopTabs, dispatchShopTabs }),
    [currentUser, shopTabs]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
/*
Wrapper for using Global Store
*/
export const useGlobalContext = () => useContext(Context);
