import { Box, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import SidebarContainer from '../../../../../components/Common/SidebarContainerSm';
import { useGlobalContext } from '../../../../../context';
import * as Api from '../../../../../network/Api';
import AXIOS from '../../../../../network/axios';
import ProductCard from './ProductCard';

const skeletons_count = new Array(5).fill(0);

export default function BundleProducts({ onClose, rewardBundle }) {
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code);
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

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

  return (
    <SidebarContainer title="Categories: Food" onClose={onClose}>
      <Box pt={11}>
        {(productsQuery.data?.data?.products || skeletons_count).map((product, index, array) => (
          <ProductCard
            loading={productsQuery?.isLoading}
            key={product?._id || index}
            product={product}
            currency={currency}
            sx={{
              paddingTop: '15px',
              paddingBottom: '15px',
              borderBottom: index === array.length - 1 ? 'none' : '1px solid #EEEEEE',
            }}
          />
        ))}
        {!productsQuery?.isLoading && !productsQuery.data?.data?.products?.length && (
          <Typography
            variant="h6"
            sx={{
              paddingTop: '15px',
              paddingBottom: '15px',
              borderBottom: '1px solid #EEEEEE',
              borderTop: '1px solid #EEEEEE',
            }}
          >
            No products found
          </Typography>
        )}
      </Box>
    </SidebarContainer>
  );
}
