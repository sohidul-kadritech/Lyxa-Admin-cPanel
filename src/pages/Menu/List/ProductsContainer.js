/* eslint-disable react/jsx-no-useless-fragment */
import { useContext, useState } from 'react';
import { useMutation } from 'react-query';
import { Container, Draggable } from 'react-smooth-dnd';
import dropSort from '../../../helpers/dropSort';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { ProductsContext } from '../ProductContext';
import ProductItem from './ProductItem';

export default function ProductsContainer({ products, isInsideFavorites, isInsideBestSellers, asSearchResult }) {
  const [render, setRender] = useState(false);
  const sortingMutation = useMutation((data) => AXIOS.post(Api.SORT_PRODUCTS, data));

  const { updatedProduct } = useContext(ProductsContext);

  const onDrop = ({ removedIndex, addedIndex }) => {
    sortingMutation.mutate({
      products: dropSort(removedIndex, addedIndex, products).map((product, index) => ({
        id: product?._id,
        sortingOrder: index + 1,
      })),
    });

    setRender(!render);
  };

  if (products?.length === 0) {
    return <></>;
  }

  return (
    <Container onDrop={asSearchResult ? () => {} : onDrop} lockAxis="y" dragHandleSelector=".drag-handler-product">
      {products.map((product, index, array) => {
        if (asSearchResult && !product.matched) {
          return null;
        }

        console.log(updatedProduct);

        if (product._id === updatedProduct?._id) {
          // eslint-disable-next-line no-param-reassign
          product = updatedProduct;
          array[index] = updatedProduct;
          console.log('changed');
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
            />
          </Draggable>
        );
      })}
    </Container>
  );
}
