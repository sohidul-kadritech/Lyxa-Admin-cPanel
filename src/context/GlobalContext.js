import { createContext, useContext, useMemo, useReducer } from 'react';
import { currentUserInit, currentUserReducer } from './currentUser';
import { tabsInit, tabsReducer } from './tabs';

/*
Global Store
*/
const Context = createContext();
/*
Global Store Provider
*/
export default function ContextProvider({ children }) {
  const [currentUser, dispatchCurrentUser] = useReducer(currentUserReducer, currentUserInit);
  const [tabs, dispatchTabs] = useReducer(tabsReducer, tabsInit);

  const value = useMemo(() => ({ currentUser, dispatchCurrentUser, tabs, dispatchTabs }), [currentUser, tabs]);
  console.log('================================>', value.tabs);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
/*
Wrapper for using Global Store
*/
export const useGlobalContext = () => useContext(Context);
