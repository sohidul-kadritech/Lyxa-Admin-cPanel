import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export default function useQueryParams(defaultParams) {
  const location = useLocation();
  const history = useHistory();

  const searchParams = useMemo(() => new URLSearchParams(location.search || defaultParams), [location.search]);
  const searchParamsObj = useMemo(() => Object.fromEntries(searchParams), [searchParams]);

  const setSearchParam = (key, value) => {
    console.log('key', key, value);
    if (typeof key === 'object') {
      Object.entries(key).forEach(([k, v]) => {
        searchParams.set(k, v);
      });
    } else if (typeof key === 'function') {
      Object.entries(key(searchParamsObj)).forEach(([k, v]) => {
        searchParams.set(k, v);
      });
    } else {
      searchParams.set(key, value);
    }
    console.log('searchParams.toString()', searchParams.toString());
    history.replace({ search: searchParams.toString() });
  };

  return [searchParamsObj, setSearchParam];
}
