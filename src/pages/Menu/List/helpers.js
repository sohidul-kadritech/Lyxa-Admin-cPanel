import { Accordion, AccordionSummary, styled } from '@mui/material';

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: '0 20px 0 20px',
  background: 'transparent',
  borderBottom: '1px solid #EEEEEE',
  borderRadius: '8px',

  '&:hover': {
    background: theme.palette.grey[100],
  },

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

  '&.Mui-expanded': {
    margin: '0 !important',
  },

  '& .MuiAccordionDetails-root': {
    // paddingBottom: '30px',
    paddingTop: '0',
    paddingBottom: '0',
    paddingLeft: '30px',
    // paddingRight: '30px',
    paddingRight: '0px',
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
