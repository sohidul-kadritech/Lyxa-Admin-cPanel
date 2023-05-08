// project import
import { Box, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import ShopPreview from '../../components/Common/ShopPreview';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import PageSkeleton from './RestaurantsSkeleton';

// eslint-disable-next-line no-unused-vars
const skeletons = new Array(4).fill(0);

const typeToApiMap = {
  tag: Api.GET_SHOP_BY_TAGS_AND_CUSINES,
  list: Api.GET_LIST_CONTAINER_SHOPS,
  filter: Api.GET_FILTER_CONTAINER_SHOPS,
};

export default function Restaurants({ onClose, id, type }) {
  const shopsQuery = useQuery([typeToApiMap[type], { id }], () =>
    AXIOS.get(typeToApiMap[type] || '', {
      params: {
        id,
      },
    })
  );

  const prop = type === 'tag' ? 'shop' : 'shops';
  const data = shopsQuery?.data?.data || [];

  if (shopsQuery.isLoading) {
    return (
      <SidebarContainer title="Resturants" onClose={onClose}>
        <PageSkeleton />
      </SidebarContainer>
    );
  }

  return (
    <SidebarContainer title="Resturants" onClose={onClose}>
      {/* shop */}
      {data[prop]?.map((shop) => (
        <Box
          pt={4}
          pb={4}
          sx={{
            borderBottom: '1px solid #EEEEEE',
          }}
          key={shop?._id}
        >
          <ShopPreview shop={shop} loading={shopsQuery?.isLoading} />
        </Box>
      ))}
      {!data[prop]?.length && (
        <Typography
          variant="h6"
          pt={4}
          pb={4}
          sx={{
            borderBottom: '1px solid #EEEEEE',
            borderTop: '1px solid #EEEEEE',
            color: '#737373',
          }}
        >
          No shops found
        </Typography>
      )}
    </SidebarContainer>
  );
}
