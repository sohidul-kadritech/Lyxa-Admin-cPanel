import { Accordion, AccordionSummary, styled } from '@mui/material';

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: '0',
  background: 'transparent',
  borderBottom: '1px solid #EEEEEE',

  '& .MuiSvgIcon-root': {
    color: theme.palette.text.primary,
  },

  '& .MuiAccordionSummary-content': {
    marginTop: '13px',
    marginBottom: '13px',
  },
}));

export const StyledAccordion = styled(Accordion)(() => ({
  background: 'transparent',

  '&:before': {
    display: 'none',
  },

  '& .MuiAccordionDetails-root': {
    paddingBottom: '30px',
    paddingLeft: '30px',
  },
}));

export const createCatagory = (data, type) => {
  if (type === 'bestseller') {
    const sortedProducts = [];

    data?.bestSellerItems?.forEach((obj) => {
      const cId = obj?._id?.category?._id;
      const pId = obj?._id?._id;

      data?.productsGroupByCategory?.forEach((pair) => {
        if (pair?.category?.category?._id === cId) {
          pair?.sortedProducts?.forEach((product) => {
            if (product?._id === pId) {
              sortedProducts.push(product);
            }
          });
        }
      });
    });

    return {
      category: {
        _id: 'bestsellerItems',
        name: 'Best sellers',
        isUnsortable: true,
        isShopBestSellers: true,
      },
      sortedProducts,
    };
  }

  const sortedProducts = [];

  data?.shopFavouriteItems?.forEach((obj) => {
    const cId = obj?.product?.category?._id;
    const pId = obj?.product?._id;

    data?.productsGroupByCategory?.forEach((pair) => {
      if (pair?.category?.category?._id === cId) {
        pair?.sortedProducts?.forEach((product) => {
          if (product?._id === pId) {
            sortedProducts.push(product);
          }
        });
      }
    });
  });

  return {
    category: {
      _id: 'shopfavoriteItems',
      name: 'Favourites',
      isUnsortable: true,
      isShopFavorites: true,
    },
    sortedProducts,
  };
};
