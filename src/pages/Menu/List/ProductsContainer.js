import { useState } from 'react';
import { useMutation } from 'react-query';
import { Container, Draggable } from 'react-smooth-dnd';
import dropSort from '../../../helpers/dropSort';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import ProductItem from './ProductItem';

export default function ProductsContainer({
  products,
  onProductMenuClick,
  isInsideFavorites,
  isInsideBestSellers,
  asSearchResult,
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

  return (
    <Container onDrop={asSearchResult ? () => {} : onDrop} lockAxis="y" dragHandleSelector=".drag-handler-chlid">
      {products.map((product, index, array) => {
        if (asSearchResult && !product.matched) {
          return null;
        }

        return (
          <Draggable key={product?._id}>
            <ProductItem
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
        );
      })}
    </Container>
  );
}
