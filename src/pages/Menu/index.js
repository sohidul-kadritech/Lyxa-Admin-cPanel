/* eslint-disable no-unsafe-optional-chaining */
// third party
import { Box, Drawer } from '@mui/material';
import { createContext, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Container, Draggable } from 'react-smooth-dnd';

// project import
import PageTop from '../../components/Common/PageTop';
import Wrapper from '../../components/Wrapper';
import dropSort from '../../helpers/dropSort';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import AddCategory from './AddCategory';
import AddProduct from './AddProduct';
import CategoryContainer from './CategoryContainer';
import Searchbar from './Searchbar';
import { createCatagory } from './helpers';

export const ProductsContext = createContext({});

export default function MenuPage() {
  const history = useHistory();
  const shop = useSelector((store) => store.Login.admin);

  const [render, setRender] = useState(false);
  const [sidebar, setSidebar] = useState(null);

  const [newProductCategory, setNewProductCategory] = useState(null);
  const [editProduct, setEditProduct] = useState({});
  const [productReadonly, setProductReadonly] = useState(false);

  // products
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const productsQuery = useQuery(
    ['category-wise-products', { shopId: shop?._id }],
    () =>
      AXIOS.get(Api.GET_CATEGORY_WISE_PRODUCT, {
        params: {
          shopId: shop?._id,
        },
      }),
    {
      staleTime: 1000 * 60 * 5,
      onSuccess: (data) => {
        setCategories((prev) => data?.data?.productsGroupByCategory || prev);
        setFavorites((prev) => data?.data?.shopFavouriteItems || prev);
      },
    }
  );

  const favoriteMutation = useMutation(
    (data) =>
      AXIOS.post(Api.EDIT_SHOP_FAVOVRITES, {
        shopId: shop?._id,
        ...data,
      }),
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  const handleFavouriteChange = (product) => {
    // remove item
    if (favorites?.find((item) => item?.product?._id === product?._id)) {
      const newList = [];
      let i = 1;

      setFavorites((prev) =>
        prev?.filter((item) => {
          if (item?.product?._id !== product?._id) {
            newList.push({
              product: item?.product?._id,
              sortingOrder: i,
            });

            i++;
          }
          return item?.product?._id !== product?._id;
        })
      );

      favoriteMutation.mutate({
        products: newList,
      });
      return;
    }

    // item already full
    if (favorites?.length >= 3) {
      successMsg('Favourites items is already full');
      return;
    }

    // add item
    const l = favorites?.length + 1 || 0;
    setFavorites((prev) => [...prev, { sortingOrder: l, product }]);

    const newList = favorites?.map((item, index) => ({
      product: item?.product?._id,
      sortingOrder: index + 1,
    }));
    newList.push({ product: product?._id, sortingOrder: l });

    favoriteMutation.mutate({
      products: newList,
    });
  };

  const onProductMenuClick = (menu, product) => {
    if (menu === 'marketing') history.push('/marketing');

    if (menu === 'edit') {
      setEditProduct(product);
      setSidebar('add-item');
    }

    if (menu === 'favourite') {
      handleFavouriteChange(product);
    }
  };

  // sort products
  const categorySortingMutation = useMutation((data) => AXIOS.post(Api.SORT_CATEGORIES, data));

  const onDrop = ({ removedIndex, addedIndex }) => {
    categorySortingMutation.mutate({
      categories: dropSort(removedIndex, addedIndex, categories).map((category, index) => ({
        id: category?.category?.category?._id,
        sortingOrder: index + 1,
      })),
    });
    setRender(!render);
  };

  const ContextObj = useMemo(
    () => ({
      favorites,
      setFavorites,
      editProduct,
      setEditProduct: (product) => {
        setEditProduct(product);
        setSidebar('add-item');
        setProductReadonly(true);
      },
    }),
    []
  );

  return (
    <ProductsContext.Provider value={ContextObj}>
      <Wrapper
        sx={{
          paddingTop: 0,
          height: 'auto',
        }}
      >
        <Box className="page-content2">
          <PageTop title="Menu" />
          <Searchbar
            searchPlaceHolder="Search 24 items"
            onMenuClick={(value) => {
              setSidebar(value);
            }}
            onCollapse={() => {}}
          />
          {/* best seller */}
          <CategoryContainer
            category={createCatagory(productsQuery?.data?.data || {}, 'bestseller')}
            onProductMenuClick={onProductMenuClick}
            shopFavourites={favorites}
          />
          <CategoryContainer
            category={createCatagory(favorites, 'favorites')}
            onProductMenuClick={onProductMenuClick}
            shopFavourites={favorites}
          />
          <Container onDrop={onDrop} lockAxis="y" dragHandleSelector=".drag-handler">
            {categories.map((category) => (
              <Draggable key={category?.category?._id}>
                <CategoryContainer
                  category={category}
                  onProductMenuClick={onProductMenuClick}
                  isOridanryCategory
                  shopFavourites={favorites}
                  setNewProductCategory={(categoryId) => {
                    setNewProductCategory(categoryId);
                    setSidebar('add-item');
                  }}
                />
              </Draggable>
            ))}
          </Container>
        </Box>
        {/* sidebar */}
        <Drawer open={Boolean(sidebar)} anchor="right">
          {sidebar === 'add-item' && (
            <AddProduct
              newProductCategory={newProductCategory}
              productReadonly={productReadonly}
              editProduct={editProduct}
              onClose={() => {
                setSidebar(null);
                setNewProductCategory(null);
                setEditProduct({});
                setProductReadonly(false);
              }}
            />
          )}
          {sidebar === 'add-category' && (
            <AddCategory
              onClose={() => {
                setSidebar(null);
              }}
            />
          )}
        </Drawer>
      </Wrapper>
    </ProductsContext.Provider>
  );
}
