// project import
import { Box, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import ShopPreview from '../../../components/Common/ShopPreview';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

const skeletons = new Array(4).fill(0);

export default function Restaurants({ onClose, tagId }) {
  const shopsQuery = useQuery([`shops-by-tag-and-cusine`, { id: tagId }], () =>
    AXIOS.get(Api.GET_SHOP_BY_TAGS_AND_CUSINES, {
      params: {
        id: tagId,
      },
    })
  );

  return (
    <SidebarContainer title="Categories: Resturants" onClose={onClose}>
      {/* shop */}
      {(shopsQuery?.data?.data?.shop || skeletons)?.map((shop, index) => (
        <Box
          pt={4}
          pb={4}
          sx={{
            borderBottom: '1px solid #EEEEEE',
          }}
        >
          <ShopPreview key={index} shop={shop} loading={shopsQuery?.isLoading} />
        </Box>
      ))}
      {!shopsQuery.isLoading && !shopsQuery?.data?.data?.shop?.length && (
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
