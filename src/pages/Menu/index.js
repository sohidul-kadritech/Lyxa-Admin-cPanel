/* eslint-disable no-unsafe-optional-chaining */
// third party
import { Drawer } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { Container, Draggable } from 'react-smooth-dnd';

// project import
import PageTop from '../../components/Common/PageTop';
import { ShopDeals } from '../../helpers/ShopDeals';
import dropSort from '../../helpers/dropSort';
import { local_product_search } from '../../helpers/localSearch';
// import { successMsg } from '../../helpers/successMsg';
import { Throttler } from '../../helpers/throttle';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import AddCategory from './AddCategory';
import AddProduct from './AddProduct';
import AddSubCategory from './AddSubCategory';
import CategoryItem from './List/CategoryItem';
import { createCatagory } from './List/helpers';
import PageSkeleton from './PageSkeleton';
import { ProductsContext } from './ProductContext';
import Searchbar from './Searchbar';
import { OngoingTag } from './helpers';

export default function MenuPage() {
  const searchThrottler = new Throttler(200);

  // const history = useHistory();
  const shop = useSelector((store) => store.Login.admin);
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
    }
  );

  useEffect(() => {
    if (productsQuery?.data?.status) {
      setCategories((prev) => productsQuery?.data?.data?.productsGroupByCategory || prev);
      setFavorites((prev) => createCatagory(productsQuery?.data?.data || {}, 'favorites') || prev);
      setBestSellers((prev) => createCatagory(productsQuery?.data?.data || {}, 'bestseller') || prev);
    }
  }, []);

  // product search
  const onSearch = (str) => {
    setSearchValue(str);

    searchThrottler.exec(() => {
      setCategories(local_product_search(str, categories));
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
      bestSellers,
      updatedProduct,
      setUpdatedProduct,
      setEditProduct: (product, readonly) => {
        setEditProduct(product);
        setSidebar('add-item');
        setProductReadonly(readonly);
      },
    }),
    [favorites, updatedProduct]
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
          <>
            {shop.shopType === 'food' && searchValue === '' && (
              <>
                <CategoryItem category={bestSellers} gOpen={category_open} />
                <CategoryItem category={favorites} gOpen={category_open} />
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
                    />
                  </Draggable>
                );
              })}
            </Container>
          </>
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
