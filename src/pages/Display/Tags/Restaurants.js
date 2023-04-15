// project import
import { Box, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import ShopPreview from '../../../components/Common/ShopPreview';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import PageSkeleton from './RestaurantsSkeleton';

// eslint-disable-next-line no-unused-vars
const skeletons = new Array(4).fill(0);

export default function Restaurants({ onClose, tagId }) {
  const shopsQuery = useQuery([`shops-by-tag-and-cusine`, { id: tagId }], () =>
    AXIOS.get(Api.GET_SHOP_BY_TAGS_AND_CUSINES, {
      params: {
        id: tagId,
      },
    })
  );

  if (shopsQuery.isLoading) {
    return (
      <SidebarContainer title="Categories: Resturants" onClose={onClose}>
        <PageSkeleton />
      </SidebarContainer>
    );
  }

  return (
    <SidebarContainer title="Categories: Resturants" onClose={onClose}>
      {/* shop */}
      {shopsQuery?.data?.data?.shop?.map((shop) => (
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
      {!shopsQuery?.data?.data?.shop?.length && (
        <Typography
          variant="h6"
          pt={4}
          pb={4}
          sx={{
            borderBottom: '1px solid #EEEEEE',
            borderTop: '1px solid #EEEEEE',
          }}
        >
          No shops found
        </Typography>
      )}
    </SidebarContainer>
  );
}
