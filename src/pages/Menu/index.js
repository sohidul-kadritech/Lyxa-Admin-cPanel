// third party
import { Box, Drawer } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Container, Draggable } from 'react-smooth-dnd';

// project import
import PageTop from '../../components/Common/PageTop';
import Wrapper from '../../components/Wrapper';
import dropSort from '../../helpers/dropSort';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import AddCategory from './AddCategory';
import AddProduct from './AddProduct';
import CategoryContainer from './CategoryContainer';
import Searchbar from './Searchbar';
import { createCatagory } from './helpers';

export default function MenuPage() {
  const shop = useSelector((store) => store.Login.admin);
  const history = useHistory();
  const [sidebar, setSidebar] = useState(null);
  const [render, setRender] = useState(false);

  // products query
  const [categories, setCategories] = useState([]);

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
      },
    }
  );

  // shop favourites
  const shopFavoriteMutation = useMutation((data) => AXIOS.post(Api.EDIT_SHOP_FAVOVRITES, data), {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  /*
    Other menu options are handled within the product compoent for avoiding refetch
  */
  const onProductMenuClick = (menu) => {
    if (menu === 'marketing') history.push('/marketing');

    if (menu === 'edit') history.push('/marketing');

    if (menu === 'favourite') {
      shopFavoriteMutation.mutate({
        shopId: shop?._id,
        isActive: true,
        products: [],
      });
    }
  };

  // sort products
  const categorySortingMutation = useMutation((data) => AXIOS.post(Api.SORT_CATEGORIES, data));

  const onDrop = ({ removedIndex, addedIndex }) => {
    dropSort(removedIndex, addedIndex, categories, (categories) => {
      setRender(!render);
      categorySortingMutation.mutate({
        categories: categories.map((category, index) => ({
          id: category?.category?.category?._id,
          sortingOrder: index + 1,
        })),
      });
    });
  };

  return (
    <Wrapper
      sx={{
        paddingTop: 0,
        height: 'auto',
      }}
    >
      <Box className="page-content2">
        <PageTop title="Menu" />
        <Searchbar
          searchPlaceHolder="Search items"
          onMenuClick={(value) => {
            setSidebar(value);
          }}
          onCollapse={() => {}}
        />
        {/* best seller */}
        <CategoryContainer
          category={createCatagory(productsQuery?.data?.data || {}, 'bestseller')}
          onProductMenuClick={onProductMenuClick}
        />
        <CategoryContainer category={createCatagory(productsQuery?.data?.data || {}, 'favorites')} />
        <Container onDrop={onDrop} lockAxis="y" dragHandleSelector=".drag-handler">
          {categories.map((category) => (
            <Draggable key={category?.category?._id}>
              <CategoryContainer category={category} onProductMenuClick={onProductMenuClick} isOridanryCategory />
            </Draggable>
          ))}
        </Container>
      </Box>
      {/* sidebar */}
      <Drawer open={Boolean(sidebar)} anchor="right">
        {sidebar === 'add-item' && (
          <AddProduct
            onClose={() => {
              setSidebar(null);
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
  );
}
