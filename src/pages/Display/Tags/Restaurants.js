// third party

// project import
import { Box } from '@mui/material';
import { useQuery } from 'react-query';
import ShopPreview from '../../../components/Common/ShopPreview';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

export default function Restaurants({ onClose, tagId }) {
  const shopsQuery = useQuery([`shops-by-tag-and-cusine`, { id: tagId }], () =>
    AXIOS.get(Api.GET_SHOP_BY_TAGS_AND_CUSINES, {
      params: {
        id: tagId,
      },
    })
  );

  console.log(shopsQuery.data);

  return (
    <SidebarContainer title="Categories: Resturants" onClose={onClose}>
      {/* shop */}
      <Box pt={16} pb={16}>
        <Box
          pt={4}
          pb={4}
          sx={{
            borderBottom: '1px solid #EEEEEE',
          }}
        >
          <ShopPreview />
        </Box>
        <Box
          pt={4}
          pb={4}
          sx={{
            borderBottom: '1px solid #EEEEEE',
          }}
        >
          <ShopPreview />
        </Box>
        <Box pt={4} pb={4}>
          <ShopPreview />
        </Box>
      </Box>
    </SidebarContainer>
  );
}
