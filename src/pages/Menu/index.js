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
import { ShopDeals } from '../../helpers/ShopDeals';
import { deepClone } from '../../helpers/deepClone';
import dropSort from '../../helpers/dropSort';
import { local_product_search } from '../../helpers/localSearch';
import { successMsg } from '../../helpers/successMsg';
import { Throttler } from '../../helpers/throttle';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import AddCategory from './AddCategory';
import AddProduct from './AddProduct';
import AddSubCategory from './AddSubCategory';
import CategoryContainer from './List/CategoryContainer';
import PageSkeleton from './PageSkeleton';
import { ProductsContext } from './ProductContext';
import Searchbar from './Searchbar';
import { OngoingTag, createCatagory } from './helpers';

export default function MenuPage() {
  const searchThrottler = new Throttler(200);

  const history = useHistory();
  const shop = useSelector((store) => store.Login.admin);
  const Deals = useMemo(() => new ShopDeals(shop), []);

  const [render, setRender] = useState(false);
  const [sidebar, setSidebar] = useState(null);
  const [category_open, set_category_open] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const [newProductCategory, setNewProductCategory] = useState(null);
  const [editProduct, setEditProduct] = useState({});
  const [productReadonly, setProductReadonly] = useState(false);

  // products
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [bestSellers, setBestSellers] = useState({});

  const [editCategory, setEditCategory] = useState({});
  const [searchCategories, setSearchCategories] = useState([]);

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
        setFavorites((prev) => createCatagory(data?.data?.shopFavouriteItems || [], 'favorites') || prev);
        setBestSellers((prev) => createCatagory(data?.data || {}, 'bestseller') || prev);
      },
    }
  );

  useEffect(() => {
    if (productsQuery?.data?.status) {
      setCategories((prev) => productsQuery?.data?.data?.productsGroupByCategory || prev);
      setFavorites((prev) => createCatagory(productsQuery?.data?.data?.shopFavouriteItems || [], 'favorites') || prev);
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
    if (favorites.sortedProducts?.find((item) => item?._id === product?._id)) {
      const updateToApiList = [];
      let i = 1;

      setFavorites((prev) => {
        const newList = prev?.sortedProducts?.filter((item) => {
          if (item?._id !== product?._id) {
            updateToApiList.push({
              product: item?._id,
              sortingOrder: i,
            });

            i++;

            return true;
          }

          return false;
        });

        return {
          ...prev,
          sortedProducts: newList,
        };
      });

      favoriteMutation.mutate({
        products: updateToApiList,
      });

      return;
    }

    // item already full
    if (favorites?.sortedProducts?.length >= 3) {
      successMsg('Favourites items is already full');
      return;
    }

    // add item
    const newFavouritesList = [...favorites?.sortedProducts, product];

    setFavorites((prev) => ({
      ...prev,
      sortedProducts: newFavouritesList,
    }));

    const updateToApiList = newFavouritesList.map((item, index) => ({
      product: item?._id,
      sortingOrder: index + 1,
    }));

    favoriteMutation.mutate({
      products: updateToApiList,
    });
  };

  const onProductMenuClick = (menu, product) => {
    if (menu === 'marketing') history.push('/marketing');

    if (menu === 'edit') {
      setEditProduct(deepClone(product));
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
      bestSellers,
    }),
    [favorites]
  );

  return (
    <ProductsContext.Provider value={ContextObj}>
      <PageTop
        title={`Menu (${shop?.shopName})`}
        tag={Deals.deals.hasActiveDeal ? <OngoingTag label={Deals.get_promotion_str()} /> : undefined}
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
        }}
      />
      {productsQuery?.isLoading && <PageSkeleton />}
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
            shopType={shop?.shopType}
          />
          {searchValue === '' && (
            <>
              {shop.shopType === 'food' && (
                <>
                  <CategoryContainer
                    category={bestSellers}
                    onProductMenuClick={onProductMenuClick}
                    gOpen={category_open}
                  />
                  <CategoryContainer
                    category={favorites}
                    onProductMenuClick={onProductMenuClick}
                    gOpen={category_open}
                  />
                </>
              )}

              <Container onDrop={onDrop} lockAxis="y" dragHandleSelector=".drag-handler">
                {categories.map((category) => (
                  <Draggable key={category?.category?._id}>
                    <CategoryContainer
                      gOpen={category_open}
                      category={category}
                      setEditCategory={(editCategory) => {
                        console.log(editCategory);
                        setEditCategory(editCategory);
                        setSidebar('add-category');
                      }}
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
            </>
          )}

          {searchValue !== '' && (
            <>
              <Box>
                {searchCategories.map((category) => (
                  <CategoryContainer
                    fromSearch
                    key={category?.category?._id}
                    gOpen={category_open}
                    category={category}
                    onProductMenuClick={onProductMenuClick}
                    isOridanryCategory
                    setNewProductCategory={(categoryId) => {
                      setNewProductCategory(categoryId);
                      setSidebar('add-item');
                    }}
                  />
                ))}
              </Box>
              {!searchCategories?.length && (
                <Box>
                  <Typography variant="h5" textAlign="center">
                    No results found
                  </Typography>
                </Box>
              )}
            </>
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
            editCategory={editCategory}
            onClose={() => {
              setSidebar(null);
              setEditCategory({});
            }}
          />
        )}
        {sidebar === 'add-sub-category' && (
          <AddSubCategory
            onClose={() => {
              setSidebar(null);
            }}
          />
        )}
      </Drawer>
    </ProductsContext.Provider>
  );
}
