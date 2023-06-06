// third party
import { Box, Drawer, Typography } from '@mui/material';

// project import
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import AddShop from '../../components/Shared/AddShop';
import { useGlobalContext } from '../../context';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import ShopProfile from '../ShopProfile';
import List from './List';
import PageSkeleton from './PageSkeleton';
import SearchBar from './SearchBar';
import { filterShops, filtersInit } from './helper';

export default function ShopList() {
  const { currentUser, dispatchCurrentUser } = useGlobalContext();
  const { seller, shop: currentShop } = currentUser;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState(filtersInit);
  const [shops, setShops] = useState([]);

  const setCurrentShop = (data) => {
    const currShopSellerId = typeof currentShop?.seller === 'string' ? currentShop?.seller : currentShop?.seller?._id;

    if (data?.data?.shops?.length && (!currentShop?._id || currShopSellerId !== seller?._id)) {
      dispatchCurrentUser({ type: 'shop', payload: { shop: data?.data?.shops[0] } });
    }
  };

  const query = useQuery(
    [Api.ALL_SHOP, { sellerId: seller?._id }],
    () => AXIOS.get(Api.ALL_SHOP, { params: { sellerId: seller?._id } }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setShops(data?.data?.shops);
          setCurrentShop(data);
        }
      },
    }
  );

  useEffect(() => {
    setCurrentShop(query?.data);
  }, []);

  useEffect(() => {
    setShops(filterShops(query?.data?.data?.shops, filters));
  }, [filters.searchKey, filters.status, filters.sort]);

  return (
    <Box>
      <PageTop title="Shop List" />
      <SearchBar
        searchPlaceHolder={`Search ${shops?.length} shops`}
        onAdd={() => setOpen(true)}
        filters={filters}
        setFilters={setFilters}
      />
      <Typography variant="inherit" fontSize={14} lineHeight="16px" fontWeight={600} color="#737373" pt={10.5} pb={5.5}>
        SHOPS
      </Typography>
      {query.isLoading ? (
        <PageSkeleton />
      ) : (
        <>
          <List shops={shops} loading={loading} />
          {shops?.length ? <ShopProfile setLoading={setLoading} loading={loading} /> : null}
          <Drawer open={open} anchor="right">
            <AddShop onClose={() => setOpen(false)} />
          </Drawer>
        </>
      )}
    </Box>
  );
}
