import { Box, Drawer } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Container, Draggable } from 'react-smooth-dnd';
import PageTop from '../../components/Common/PageTop';
import Wrapper from '../../components/Wrapper';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import AddCategory from './AddCategory';
import AddProduct from './AddProduct';
import CategoryContainer from './CategoryContainer';
import OptionsBar from './OptionsBar';
import { createCatagory } from './helpers';

export default function MenuPage() {
  const adminShop = useSelector((store) => store.Login.admin);
  // eslint-disable-next-line no-unused-vars
  const [render, setRender] = useState(false);
  // const [globalOpen, setGlobalOpen] = useState(null);

  // sidebar
  const [sidebar, setSidebar] = useState(null);

  // products
  const [categories, setCategories] = useState([]);
  console.log(categories);

  const productsQuery = useQuery(
    ['category-wise-products', { shopId: adminShop?._id }],
    () =>
      AXIOS.get(Api.GET_CATEGORY_WISE_PRODUCT, {
        params: {
          shopId: adminShop?._id,
        },
      }),
    {
      staleTime: 1000 * 60 * 5,
      onSuccess: (data) => {
        setCategories(data?.data?.productsGroupByCategory || []);
      },
    }
  );

  // sort products
  const categorySortingMutation = useMutation((data) => AXIOS.post(Api.SORT_CATEGORIES, data));

  const onDrop = ({ removedIndex, addedIndex }) => {
    if (removedIndex === null || addedIndex === null) return;
    const category = categories.splice(removedIndex, 1);

    categories.splice(addedIndex, 0, category[0]);
    setRender((prev) => !prev);

    categorySortingMutation.mutate({
      categories: categories.map((category, index) => ({
        id: category?.category?.category?._id,
        sortingOrder: index + 1,
      })),
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
        <OptionsBar
          searchPlaceHolder="Search 24 items"
          onMenuClick={(value) => {
            setSidebar(value);
          }}
          onCollapse={() => {}}
        />
        {/* best seller */}
        <CategoryContainer category={createCatagory(productsQuery?.data?.data || {}, 'bestseller')} />
        {/* <CategoryContainer category={createCatagory(productsQuery?.data?.data || {}, 'favorites')} /> */}
        <Container onDrop={onDrop} lockAxis="y" dragHandleSelector=".drag-handler">
          {categories.map((category) => (
            <Draggable key={category?.category?._id}>
              <CategoryContainer category={category} isOridanryCategory />
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
