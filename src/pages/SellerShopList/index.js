/* eslint-disable prettier/prettier */
// third party
import { Box, Drawer, Typography } from '@mui/material';

// project import
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
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

export default function SellerShopList() {
  const { currentUser, dispatchCurrentUser } = useGlobalContext();
  const { seller, shop: currentShop } = currentUser;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [queryEnabled, setQueryEnabled] = useState(true);

  const [filters, setFilters] = useState(filtersInit);
  const [shops, setShops] = useState([]);

  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location?.search), [location?.search]);

  const setCurrentShop = (data) => {
    const currShopSellerId = typeof currentShop?.seller === 'string' ? currentShop?.seller : currentShop?.seller?._id;

    // if no shop set or set shop is not of this seller or set not query shop
    if (!currentShop?._id || currShopSellerId !== seller?._id || searchParams.get('shopId') !== currentShop?._id) {
      let shop = {};

      // default first shop in list
      if (data?.data?.shops?.length) {
        shop = data?.data?.shops[0] || shop;
      }

      // queried shop
      if (searchParams.get('shopId')) {
        const searchedShop = data?.data?.shops?.find((s) => s?._id === searchParams.get('shopId'));
        shop = searchedShop || shop;
      }

      dispatchCurrentUser({ type: 'shop', payload: { shop } });
    }
  };

  const query = useQuery(
    [Api.GET_SINGLE_SELLER_ALL_SHOP, { sellerId: seller?._id }],
    () => AXIOS.get(Api.GET_SINGLE_SELLER_ALL_SHOP, { params: { sellerId: seller?._id } }),
    {
      enabled: queryEnabled,
      onSuccess: (data) => {
        if (data?.status) {
          setQueryEnabled(false);

          setShops(data?.data?.shops || []);
          setCurrentShop(data);
        }
      },
    },
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
            <AddShop onClose={() => setOpen(false)} refetch={query?.refetch} />
          </Drawer>
        </>
      )}
    </Box>
  );
}
