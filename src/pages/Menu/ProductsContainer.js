import { useState } from 'react';
import { useMutation } from 'react-query';
import { Container, Draggable } from 'react-smooth-dnd';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import Product from './Product';

export default function ProductsContainer({ products }) {
  // eslint-disable-next-line no-unused-vars
  const [render, setRender] = useState(false);

  const sortingMutation = useMutation((data) => AXIOS.post(Api.SORT_PRODUCTS, data));

  const onDrop = ({ removedIndex, addedIndex }) => {
    if (removedIndex === null || addedIndex === null) return;
    const category = products.splice(removedIndex, 1);

    products.splice(addedIndex, 0, category[0]);
    setRender((prev) => !prev);

    sortingMutation.mutate({
      products: products?.map((product, index) => ({
        id: product?._id,
        sortingOrder: index + 1,
      })),
    });
  };

  return (
    <Container onDrop={onDrop}>
      {products.map((product, index, array) => (
        <Draggable key={product?._id}>
          <Product
            product={product}
            sx={{
              borderBottom: index === array.length - 1 ? 'none' : '1px solid #EEEEEE',
            }}
          />
        </Draggable>
      ))}
    </Container>
  );
}
