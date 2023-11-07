/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
// third party
import { Box, Drawer } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
// import { useHistory } from 'react-router-dom';
import { Container, Draggable } from 'react-smooth-dnd';

// project import
import PageTop from '../../components/Common/PageTop';
import { useGlobalContext } from '../../context';
import { ShopDeals } from '../../helpers/ShopDeals';
import dropSort from '../../helpers/dropSort';
import { local_product_category_search, local_product_category_subCategory_search } from '../../helpers/localSearch';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { getMarketingLabel } from '../ShopProfile/helper';
import AddCategory from './AddCategory';
import AddProduct from './AddProduct';
import EditFavorite from './EditFavorite';
import CategoryItem from './List/CategoryItem';
import { createCatagory } from './List/helpers';
import PageSkeleton from './PageSkeleton';
import { ProductsContext } from './ProductContext';
import Searchbar from './Searchbar';
import AddSubCategory from './SubCategory/AddSubCategory';
import EditSubCategory from './SubCategory/EditSubCategory';
import { OngoingTag } from './helpers';

export default function MenuPage({ editable = true, OnCheckProduct, suggestedProducts }) {
  const { currentUser, general } = useGlobalContext();
  const { shop } = currentUser;
  const Deals = useMemo(() => new ShopDeals(shop, general?.appSetting || {}), []);

  const [render, setRender] = useState(false);

  const [favoriteChanged, setFavoriteChanged] = useState(false);

  const [sidebar, setSidebar] = useState(null);

  const [category_open, set_category_open] = useState(null);

  const [searchValue, setSearchValue] = useState('');

  const [newProductCategory, setNewProductCategory] = useState(null);

  const [editProduct, setEditProduct] = useState({});

  const [productReadonly, setProductReadonly] = useState(false);

  const [updatedProduct, setUpdatedProduct] = useState({});

  // products
  const [categories, setCategories] = useState([]);

  const [favorites, setFavorites] = useState({});

  const [bestSellers, setBestSellers] = useState({});

  const [editCategory, setEditCategory] = useState({});

  const [newSubCategoryId, setNewSubCategoryId] = useState(null);

  const [editSubCategory, setEditSubCategory] = useState({});

  const [secondaryCurrency, setSecondaryCurrency] = useState({});

  const getAppSettingsData = useQuery([Api.APP_SETTINGS], () => AXIOS.get(Api.APP_SETTINGS), {
    onSuccess: (data) => {
      if (data.status) {
        setSecondaryCurrency({
          secondaryCurrency: data?.data?.appSetting?.secondaryCurrency,
          exchangeRate: data?.data?.appSetting?.exchangeRate,
        });
      }
    },
  });

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
        setFavorites((prev) => createCatagory(data?.data || {}, 'favorites', shop?.shopFavourites?.title) || prev);
        setBestSellers((prev) => createCatagory(data?.data || {}, 'bestseller') || prev);
      },
    },
  );

  useEffect(() => {
    if (productsQuery?.data?.status) {
      setCategories((prev) => productsQuery?.data?.data?.productsGroupByCategory || prev);
      setFavorites(
        (prev) => createCatagory(productsQuery?.data?.data || {}, 'favorites', shop?.shopFavourites?.title) || prev,
      );
      setBestSellers((prev) => createCatagory(productsQuery?.data?.data || {}, 'bestseller') || prev);
    }
  }, [currentUser?.shop, favoriteChanged]);

  // product search
  const onSearch = (str) => {
    setSearchValue(str);

    if (shop?.shopType === 'food') {
      setCategories(local_product_category_search(str, categories));
    } else {
      setCategories(local_product_category_subCategory_search(str, categories));
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
      bestSellers,
      updatedProduct,
      setUpdatedProduct,
      editProduct,
      setEditProduct: (product, readonly) => {
        setEditProduct(product);
        setSidebar('add-item');
        setProductReadonly(readonly);
      },
      setEditSubCategory: (subCategory) => {
        setEditSubCategory(subCategory);
        setSidebar('edit-sub-category');
      },
    }),
    [favorites, updatedProduct],
  );

  return (
    <ProductsContext.Provider value={ContextObj}>
      {editable && (
        <PageTop
          title={shop?.shopType === 'food' ? `Menu (${shop?.shopName})` : `Product List (${shop?.shopName})`}
          tag={
            Deals.deals.hasActiveDeal ? (
              <OngoingTag label={getMarketingLabel(shop, general?.appSetting, true)} />
            ) : undefined
          }
          titleSx={{
            lineHeight: '28px',
          }}
          sx={{
            position: 'sticky',
            top: '0px',
            zIndex: '999',
            backgroundColor: '#fbfbfb',
          }}
        />
      )}
      {(productsQuery?.isLoading || getAppSettingsData?.isLoading) && <PageSkeleton />}
      {!productsQuery?.isLoading && !getAppSettingsData?.isLoading && (
        <>
          <Searchbar
            editable={editable}
            searchPlaceHolder="Search items"
            onMenuClick={(value) => {
              setSidebar(value);
            }}
            onCollapse={() => {
              set_category_open((prev) => (prev === null ? false : !prev));
            }}
            sx={{
              position: 'sticky',
              top: editable ? '94px' : '50px',
              zIndex: '999',
              backgroundColor: '#fbfbfb',
            }}
            setSearchValue={onSearch}
            subCategory={productsQuery?.data?.data?.productsGroupByCategory}
            searchValue={searchValue}
            shopType={shop?.shopType}
            viewUserType={currentUser?.userType}
          />
          <Box pb={9}>
            {shop.shopType === 'food' && searchValue === '' && editable && (
              <>
                <CategoryItem
                  secondaryCurrency={secondaryCurrency}
                  category={bestSellers}
                  gOpen={category_open}
                  editable={editable}
                />
                <CategoryItem
                  editable={editable}
                  secondaryCurrency={secondaryCurrency}
                  category={favorites}
                  type="favourite"
                  gOpen={category_open}
                  setEditFavorite={() => {
                    if (editable) setSidebar('edit-favorite');
                  }}
                />
              </>
            )}

            <Container onDrop={onDrop} lockAxis="y" dragHandleSelector=".drag-handler">
              {categories.map((category) => {
                if (searchValue !== '' && !category?.category?.category?.matched) {
                  return null;
                }

                return (
                  <Draggable key={category?.category?._id}>
                    <CategoryItem
                      editable={editable}
                      secondaryCurrency={secondaryCurrency}
                      asSearchResult={searchValue !== ''}
                      gOpen={searchValue ? true : category_open}
                      category={category}
                      setEditCategory={(editCategory) => {
                        if (editable) {
                          setEditCategory(editCategory);
                          setSidebar('add-category');
                        }
                      }}
                      isOridanryCategory
                      setNewProductCategory={(categoryId) => {
                        if (editable) {
                          setNewProductCategory(categoryId);
                          setSidebar('add-item');
                        }
                      }}
                      setNewSubCategoryId={(categoryId) => {
                        if (editable) {
                          setNewSubCategoryId(categoryId);
                          setSidebar('add-sub-category');
                        }
                      }}
                      OnCheckProduct={OnCheckProduct}
                      suggestedProducts={suggestedProducts}
                    />
                  </Draggable>
                );
              })}
            </Container>
          </Box>
        </>
      )}
      <Drawer open={Boolean(sidebar)} anchor="right">
        {sidebar === 'add-item' && (
          <AddProduct
            newProductCategory={newProductCategory}
            productReadonly={productReadonly}
            editProduct={editProduct}
            secondaryCurrency={secondaryCurrency}
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
            shopType={shop?.shopType}
            shopId={shop?._id}
            viewUserType="shop"
            editCategory={editCategory}
            onClose={() => {
              setSidebar(null);
              setEditCategory({});
            }}
          />
        )}
        {sidebar === 'edit-favorite' && (
          <EditFavorite
            onClose={() => {
              setSidebar(null);
              setFavoriteChanged((prev) => !prev);
            }}
          />
        )}
        {sidebar === 'add-sub-category' && (
          <AddSubCategory
            newSubCategoryId={newSubCategoryId}
            onClose={() => {
              setSidebar(null);
              setNewSubCategoryId(null);
            }}
          />
        )}
        {sidebar === 'edit-sub-category' && (
          <EditSubCategory
            editSubCategory={editSubCategory}
            onClose={() => {
              setEditSubCategory({});
              setSidebar(null);
            }}
          />
        )}
      </Drawer>
    </ProductsContext.Provider>
  );
}
