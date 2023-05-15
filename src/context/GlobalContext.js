import { createContext, useContext, useMemo, useReducer } from 'react';
import { currentUserInit, currentUserReducer } from './currentUser';

/*
Global Store
*/
const Context = createContext();
/*
Global Store Provider
*/
export default function ContextProvider({ children }) {
  const [currentUser, dispatchCurrentUser] = useReducer(currentUserReducer, currentUserInit);
  const value = useMemo(() => ({ currentUser, dispatchCurrentUser }), []);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
/*
Wrapper for using Global Store
*/
export const useGlobalContext = () => useContext(Context);
