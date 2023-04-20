import { Box } from '@mui/material';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { Container, Draggable } from 'react-smooth-dnd';
import dropSort from '../../../helpers/dropSort';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import Product from './Product';

export default function ProductsContainer({
  products,
  onProductMenuClick,
  fromSearch,
  isInsideFavorites,
  isInsideBestSellers,
}) {
  const [render, setRender] = useState(false);
  const sortingMutation = useMutation((data) => AXIOS.post(Api.SORT_PRODUCTS, data));

  const onDrop = ({ removedIndex, addedIndex }) => {
    sortingMutation.mutate({
      products: dropSort(removedIndex, addedIndex, products).map((product, index) => ({
        id: product?._id,
        sortingOrder: index + 1,
      })),
    });

    setRender(!render);
  };

  if (fromSearch) {
    <Box onDrop={onDrop} lockAxis="y" dragHandleSelector=".drag-handler-chlid">
      {products.map((product, index, array) => (
        <Product
          key={product?._id}
          product={product}
          sx={{
            borderBottom: index === array.length - 1 ? 'none' : '1px solid #EEEEEE',
            cursor: 'pointer',
          }}
          onMenuClick={onProductMenuClick}
        />
      ))}
    </Box>;
  }

  return (
    <Container onDrop={onDrop} lockAxis="y" dragHandleSelector=".drag-handler-chlid">
      {products.map((product, index, array) => (
        <Draggable key={product?._id}>
          <Product
            product={product}
            isInsideFavorites={isInsideFavorites}
            isInsideBestSellers={isInsideBestSellers}
            sx={{
              borderBottom: index === array.length - 1 ? 'none' : '1px solid #EEEEEE',
              cursor: 'pointer',
            }}
            onMenuClick={onProductMenuClick}
          />
        </Draggable>
      ))}
    </Container>
  );
}
