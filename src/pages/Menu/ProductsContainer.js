import { useState } from 'react';
import { useMutation } from 'react-query';
import { Container, Draggable } from 'react-smooth-dnd';
import dropSort from '../../helpers/dropSort';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import Product from './Product';

export default function ProductsContainer({ products, onProductMenuClick }) {
  const [render, setRender] = useState(false);
  const sortingMutation = useMutation((data) => AXIOS.post(Api.SORT_PRODUCTS, data));

  const onDrop = ({ removedIndex, addedIndex }) => {
    dropSort(removedIndex, addedIndex, products, (products) => {
      setRender(!render);
      sortingMutation.mutate({
        products: products?.map((product, index) => ({
          id: product?._id,
          sortingOrder: index + 1,
        })),
      });
    });
  };

  return (
    <Container onDrop={onDrop} lockAxis="y" dragHandleSelector=".drag-handler-chlid">
      {products.map((product, index, array) => (
        <Draggable key={product?._id}>
          <Product
            product={product}
            sx={{
              borderBottom: index === array.length - 1 ? 'none' : '1px solid #EEEEEE',
            }}
            onMenuClick={onProductMenuClick}
          />
        </Draggable>
      ))}
    </Container>
  );
}
