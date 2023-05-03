import React from 'react';
// import { useSelector } from 'react-redux';

import { Box } from '@material-ui/core';
import PageTop from '../../../components/Common/PageTop';
import { General } from './General/General';

const index = () => (
  // const { loading } = useSelector((state) => state.orderReducer);
  <Box>
    <PageTop title="Settings" />
    <Box>
      <General />
    </Box>
  </Box>
);
export default index;
