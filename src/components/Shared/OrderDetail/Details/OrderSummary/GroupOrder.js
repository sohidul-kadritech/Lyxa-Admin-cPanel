/* eslint-disable no-unused-vars */
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import Product from './Product';

const groupProductsByUser = (order) => {
  const data = {};
  order?.productsDetails?.forEach((product) => {
    if (data[product?.owner?._id] !== undefined) {
      data[product?.owner?._id]?.products?.push(product);
    } else {
      data[product?.owner?._id] = {};
      data[product?.owner?._id].user = product?.owner;
      data[product?.owner?._id].products = [product];
    }
  });

  return Object.values(data);
};

export default function GroupOrder({ order }) {
  const groups = useMemo(() => groupProductsByUser(order), []);

  return (
    <Box pt={1}>
      {groups?.map((grp, gi, { length: gl }) => (
        <Box key={grp?.user?._id} pb={gi === gl - 1 ? 0 : 5}>
          <Stack direction="row" alignItems="center" pb={2} gap={1.5}>
            <Avatar
              src={grp?.user?.profile_photo}
              sx={{
                width: '32px',
                height: '32px',
              }}
            >
              {grp?.user?.name?.charAt(0)}
            </Avatar>
            <Typography variant="inherit" fontSize={15} fontWeight={600}>
              {grp?.user?.name}
            </Typography>
          </Stack>
          <Box>
            {grp?.products?.map((product, i, { length: l }) => (
              <Product
                product={product}
                key={product._id}
                isFirst={i === 0}
                isLast={i === l - 1}
                shopExchangeRate={order?.shop?.shopExchangeRate}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
