/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
// third party
import { Box, Drawer, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Container, Draggable } from 'react-smooth-dnd';

// project import
import PageTop from '../../components/Common/PageTop';
import { deepClone } from '../../helpers/deepClone';
import dropSort from '../../helpers/dropSort';
import { local_product_search } from '../../helpers/localSearch';
import { successMsg } from '../../helpers/successMsg';
import { Throttler } from '../../helpers/throttle';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import AddCategory from './AddCategory';
import AddProduct from './AddProduct';
import CategoryContainer from './List/CategoryContainer';
import MenuPageSkeleton from './MenuPageSkeleton';
import { ProductsContext } from './ProductContext';
import Searchbar from './Searchbar';
import { OngoingTag, createCatagory } from './helpers';

export default function MenuPage() {
  const searchThrottler = new Throttler(200);

  const history = useHistory();
  const shop = useSelector((store) => store.Login.admin);

  const [hasMarketing, setHasMarketing] = useState(false);
  const [render, setRender] = useState(false);
  const [sidebar, setSidebar] = useState(null);
  const [category_open, set_category_open] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const [newProductCategory, setNewProductCategory] = useState(null);
  const [editProduct, setEditProduct] = useState({});
  const [productReadonly, setProductReadonly] = useState(false);

  // products
  const [categories, setCategories] = useState([]);
  const [searchCategories, setSearchCategories] = useState([]);
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

  useEffect(() => {
    if (productsQuery?.data?.status) {
      setCategories((prev) => productsQuery?.data?.data?.productsGroupByCategory || prev);
      setFavorites((prev) => productsQuery?.data?.data?.shopFavouriteItems || prev);
    }
    if (shop?.marketings?.some((marketing) => marketing?.isActive && marketing?.status === 'active')) {
      setHasMarketing(true);
    }
  }, []);

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

  // product search
  const onSearch = (str) => {
    setSearchValue(str);

    searchThrottler.exec(() => {
      const categories = deepClone(productsQuery?.data?.data?.productsGroupByCategory || []);
      setSearchCategories(local_product_search(str, categories));
    });
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
    [favorites]
  );

  return (
    <ProductsContext.Provider value={ContextObj}>
      <PageTop
        title="Menu"
        tag={hasMarketing ? <OngoingTag /> : undefined}
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
        }}
      />
      {productsQuery?.isLoading && <MenuPageSkeleton />}
      {!productsQuery?.isLoading && (
        <>
          <Searchbar
            searchPlaceHolder="Search items"
            onMenuClick={(value) => {
              setSidebar(value);
            }}
            onCollapse={() => {
              set_category_open((prev) => (prev === null ? false : !prev));
            }}
            sx={{
              position: 'sticky',
              top: '88px',
              zIndex: '999',
              backgroundColor: '#fbfbfb',
            }}
            setSearchValue={onSearch}
            searchValue={searchValue}
          />
          {searchValue === '' && (
            <>
              <CategoryContainer
                category={createCatagory(productsQuery?.data?.data || {}, 'bestseller')}
                onProductMenuClick={onProductMenuClick}
                gOpen={category_open}
              />
              <CategoryContainer
                category={createCatagory(favorites, 'favorites')}
                onProductMenuClick={onProductMenuClick}
                gOpen={category_open}
              />
            </>
          )}
          <Container onDrop={onDrop} lockAxis="y" dragHandleSelector=".drag-handler">
            {(searchValue !== '' ? searchCategories : categories).map((category) => (
              <Draggable key={category?.category?._id}>
                <CategoryContainer
                  gOpen={category_open}
                  category={category}
                  onProductMenuClick={onProductMenuClick}
                  isOridanryCategory
                  setNewProductCategory={(categoryId) => {
                    setNewProductCategory(categoryId);
                    setSidebar('add-item');
                  }}
                />
              </Draggable>
            ))}
          </Container>
          {searchValue !== '' && !searchCategories?.length && (
            <Box>
              <Typography variant="h5" textAlign="center">
                No results found
              </Typography>
            </Box>
          )}
        </>
      )}
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
    </ProductsContext.Provider>
  );
}
