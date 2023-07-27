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
import AddCategory from './AddCategory';
import AddProduct from './AddProduct';
import CategoryItem from './List/CategoryItem';
import { createCatagory } from './List/helpers';
import PageSkeleton from './PageSkeleton';
import { ProductsContext } from './ProductContext';
import Searchbar from './Searchbar';
import AddSubCategory from './SubCategory/AddSubCategory';
import EditSubCategory from './SubCategory/EditSubCategory';
import { OngoingTag } from './helpers';

export default function MenuPage() {
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;
  const Deals = useMemo(() => new ShopDeals(shop), []);

  const [render, setRender] = useState(false);
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
        setFavorites((prev) => createCatagory(data?.data || {}, 'favorites') || prev);
        setBestSellers((prev) => createCatagory(data?.data || {}, 'bestseller') || prev);
      },
      // eslint-disable-next-line prettier/prettier
    }
  );

  useEffect(() => {
    if (productsQuery?.data?.status) {
      setCategories((prev) => productsQuery?.data?.data?.productsGroupByCategory || prev);
      setFavorites((prev) => createCatagory(productsQuery?.data?.data || {}, 'favorites') || prev);
      setBestSellers((prev) => createCatagory(productsQuery?.data?.data || {}, 'bestseller') || prev);
    }
  }, [currentUser?.shop]);

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
    [favorites, updatedProduct]
  );

  return (
    <ProductsContext.Provider value={ContextObj}>
      <PageTop
        title={shop?.shopType === 'food' ? `Menu (${shop?.shopName})` : `Product List (${shop?.shopName})`}
        tag={Deals.deals.hasActiveDeal ? <OngoingTag label={Deals.get_promotion_str()} /> : undefined}
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
      {(productsQuery?.isLoading || getAppSettingsData?.isLoading) && <PageSkeleton />}
      {!productsQuery?.isLoading && !getAppSettingsData?.isLoading && (
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
              top: '94px',
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
            {shop.shopType === 'food' && searchValue === '' && (
              <>
                <CategoryItem secondaryCurrency={secondaryCurrency} category={bestSellers} gOpen={category_open} />
                <CategoryItem secondaryCurrency={secondaryCurrency} category={favorites} gOpen={category_open} />
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
                      secondaryCurrency={secondaryCurrency}
                      asSearchResult={searchValue !== ''}
                      gOpen={category_open}
                      category={category}
                      setEditCategory={(editCategory) => {
                        setEditCategory(editCategory);
                        setSidebar('add-category');
                      }}
                      isOridanryCategory
                      setNewProductCategory={(categoryId) => {
                        setNewProductCategory(categoryId);
                        setSidebar('add-item');
                      }}
                      setNewSubCategoryId={(categoryId) => {
                        setNewSubCategoryId(categoryId);
                        setSidebar('add-sub-category');
                      }}
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
            shop={currentUser?.shop}
            newCategoryShopType={currentUser?.shop?.shopType}
            viewUserType="shop"
            editCategory={editCategory}
            onClose={() => {
              setSidebar(null);
              setEditCategory({});
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
