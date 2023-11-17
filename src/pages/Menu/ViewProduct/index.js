/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import { useGlobalContext } from '../../../context';
import { converEditProduct } from '../helpers';
import ProductDetails from './ProductDetails';
import ProductHeader from './ProductHeader';

function ViewProductInfo({ onClose, productData }) {
  const queryClient = useQueryClient();

  const { currentUser, general } = useGlobalContext();

  const { shop } = currentUser;

  const secondaryCurrency = general?.appSetting?.secondaryCurrency;

  const baseCurrency = general?.appSetting?.baseCurrency;

  const [currentTab, setCurrentTab] = useState(0);

  const [render, setRender] = useState(false);

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  const [hasAttribute, setHasAttribute] = useState('no');

  const [product, setProduct] = useState(converEditProduct(productData));

  //   // addons
  //   const productsQuery = useQuery(
  //     [
  //       'ALL_PRODUCT',
  //       {
  //         page: 1,
  //         pageSize: 100,
  //         sortBy: 'desc',
  //         searchKey: '',
  //         type: 'all',
  //         productVisibility: true,
  //         shop: shop?._id,
  //         status: 'active',
  //       },
  //     ],
  //     () =>
  //       AXIOS.get(Api.ALL_PRODUCT, {
  //         params: {
  //           page: 1,
  //           pageSize: 100,
  //           sortBy: 'desc',
  //           searchKey: '',
  //           type: 'all',
  //           productVisibility: true,
  //           shop: shop?._id,
  //           status: 'active',
  //         },
  //       }),
  //   );

  //   const addons = useMemo(
  //     () =>
  //       productsQuery?.data?.data?.products?.filter(
  //         (p) => !p?.attributes?.length && p?.marketing[0]?.type !== 'double_menu',
  //       ),
  //     [productsQuery?.data?.data?.products],
  //   );

  //   // units
  //   const unitsQuery = useQuery([Api.APP_SETTINGS], () => AXIOS.get(Api.APP_SETTINGS));

  console.log({ productData });

  return (
    <SidebarContainer
      title="Product Information"
      onClose={onClose}
      containerSx={{
        minWidth: '425px',
        maxWidth: '425px',
      }}
    >
      <Stack pb={10}>
        <ProductHeader productData={productData} />
        <ProductDetails productData={productData} />
      </Stack>
    </SidebarContainer>
  );
}

export default ViewProductInfo;
