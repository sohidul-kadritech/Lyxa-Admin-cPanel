import { Box, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import SidebarContainer from '../../../../../components/Common/SidebarContainerSm';
import * as Api from '../../../../../network/Api';
import AXIOS from '../../../../../network/axios';
import ProductCard from './ProductCard';

export default function BundleProducts({ onClose, rewardBundle }) {
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code);

  const productsQuery = useQuery(
    [
      'get-reward-category-wise-product',
      {
        rewardCategoryId: rewardBundle?._id,
      },
    ],
    () =>
      AXIOS.get(Api.GET_REWARD_CATEGORY_WISE_PRODUCTS, {
        params: {
          page: 1,
          pageSize: 50,
          pagingRange: 5,
          sortBy: 'desc',
          rewardCategoryId: rewardBundle?._id,
        },
      })
  );

  console.log(productsQuery);

  return (
    <SidebarContainer title="Categories: Food" onClose={onClose}>
      <Box pt={11}>
        {productsQuery.data?.data?.products?.map((product, index, array) => (
          <ProductCard
            key={product?._id}
            product={product}
            currency={currency}
            sx={{
              paddingTop: '15px',
              paddingBottom: '15px',
              borderBottom: index === array.length - 1 ? 'none' : '1px solid #EEEEEE',
            }}
          />
        ))}
        {!productsQuery.data?.data?.products?.length && <Typography variant="h6">No products found</Typography>}
      </Box>
    </SidebarContainer>
  );
}
