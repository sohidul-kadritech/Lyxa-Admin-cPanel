import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export default function useQueryParams(defaultParams) {
  const location = useLocation();
  const history = useHistory();

  Object.entries(defaultParams).forEach(([k, v]) => {
    if (v === undefined) delete defaultParams[k];
  });

  const searchParams = useMemo(() => new URLSearchParams(location.search || defaultParams), [location.search]);
  const searchParamsObj = useMemo(() => Object.fromEntries(searchParams), [searchParams]);

  const setSearchParam = (key, value) => {
    // console.log('params hooks list: ', { key, value });
    if (typeof key === 'object') {
      Object.entries(key).forEach(([k, v]) => {
        if (v === undefined) searchParams.delete(k);
        else searchParams.set(k, v);
      });
    } else if (typeof key === 'function') {
      Object.entries(key(searchParamsObj)).forEach(([k, v]) => {
        // console.log('params hooks function: ', { k, v });
        if (v === undefined) searchParams.delete(k);
        else searchParams.set(k, v);
      });
    } else {
      if (value === undefined) searchParams.delete(key);
      else searchParams.set(key, value);
      searchParams.set(key, value);
    }
    history.replace({ search: searchParams.toString() });
  };

  return [searchParamsObj, setSearchParam];
}
