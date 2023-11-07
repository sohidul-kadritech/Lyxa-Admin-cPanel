/* eslint-disable no-dupe-keys */
import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { ReactComponent as CheckedIcon } from '../../../assets/icons/checked-icon.svg';
import { ReactComponent as HandleIcon } from '../../../assets/icons/handle.svg';
import { ReactComponent as UncheckIcon } from '../../../assets/icons/uncheck-icon.svg';
import StyledCheckbox from '../../../components/Styled/StyledCheckbox';
import ThreeDotsMenu from '../../../components/ThreeDotsMenu2';
import { useGlobalContext } from '../../../context';
import { deepClone } from '../../../helpers/deepClone';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { ProductsContext } from '../ProductContext';
import { ProductOverlayTag, getProductMenuOptions, isBestSellerOrFavorite } from '../helpers';
import { getExchangeRate } from './helpers';

export const replaceLastSlugPath = (path, replaceSlug) => {
  // Regular expression to match the last part of the URL
  const regex = /\/[^/]+$/;
  // Replace the last part of the URL with the new slug
  const newUrl = path.replace(regex, replaceSlug);
  return newUrl;
};

export default function ProductItem({
  product,
  isInsideBestSellers,
  isInsideFavorites,
  secondaryCurrency = {},
  asSearchResult,
  editable,
  OnCheckProduct,
  suggestedProducts,
  ...props
}) {
  // console.log({ suggestedProducts });
  const { favorites, setEditProduct, bestSellers, setFavorites, setUpdatedProduct } = useContext(ProductsContext);
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();

  // eslint-disable-next-line no-unused-vars
  const [exchangeCurrency, setExchangeCurrency] = useState(getExchangeRate(secondaryCurrency, product));
  const [render, setRender] = useState(false);
  const { currentUser, general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const { shop } = currentUser;

  useEffect(() => {
    setExchangeCurrency(() => getExchangeRate(secondaryCurrency, product));
  }, [product, secondaryCurrency]);

  // status update
  const productMutation = useMutation(
    (data) =>
      AXIOS.post(Api.EDIT_PRODUCT, {
        ...data,
        action: undefined,
      }),
    {
      onSuccess: (data) => {
        successMsg(data?.message, data?.status ? 'success' : undefined);
        if (data?.status) {
          setRender(render);
          setUpdatedProduct(data?.data?.product || {});
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  // stock update
  const stockMutation = useMutation((data) => AXIOS.post(Api.UPDATE_PRODUCT_STOCK, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);
      if (data?.status) {
        setUpdatedProduct(data?.data?.product || {});
      }
    },
  });

  // favourite update
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
      // eslint-disable-next-line prettier/prettier
    },
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
    const newFavouritesList = [...(favorites?.sortedProducts || []), product];

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

  // handle menu click
  const handleMenuClick = (menu) => {
    if (menu === 'marketing') history.push(replaceLastSlugPath(location?.pathname, '/marketing'));

    if (menu === 'edit') {
      setEditProduct(deepClone(product));
    }

    if (menu === 'favourite') {
      handleFavouriteChange(product);
    }

    if (menu === 'status') {
      productMutation.mutate({
        id: product?._id,
        status: product?.status === 'active' ? 'inactive' : 'active',
        action: 'status',
      });
    }

    if (menu === 'stock') {
      stockMutation.mutate({
        productId: product?._id,
        stockQuantity: product?.stockQuantity < 1 ? 1 : 0,
      });
    }
  };

  const isBestSellerAndFavorite =
    shop?.shopType === 'food'
      ? isBestSellerOrFavorite(bestSellers, favorites, product)
      : { isFavorite: false, isBestSeller: false };

  const isChecked = !!suggestedProducts?.find((prdct) => prdct?._id === product?._id);

  // console.log({ editable });

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      pl={5}
      pr={5}
      onClick={() => {
        if (editable) setEditProduct(product, true);
      }}
      {...props}
    >
      {/* left */}
      <Stack direction="row" alignItems="center" gap={5} pt={3.5} pb={3.5}>
        {editable ? (
          <HandleIcon
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={
              editable ? `${asSearchResult ? 'cursor-not-allowed' : 'drag-handler-product grabable'}` : 'pointer'
            }
          />
        ) : (
          <StyledCheckbox
            size="small"
            checkedIcon={<CheckedIcon />}
            icon={<UncheckIcon />}
            checked={isChecked}
            onChange={() => {
              if (OnCheckProduct) {
                OnCheckProduct(product);
              }
            }}
            sx={{
              padding: '3px 8px',
              borderRadius: '7px',
              color: 'primary.main',
              width: '36px',
              // ...(checkBoxSx || {}),
            }}
          />
        )}
        <Box
          sx={{
            position: 'relative',
          }}
        >
          <Avatar src={product?.images[0]} alt={product?.name} variant="rounded" sx={{ width: 66, height: 52 }}>
            {product?.name?.charAt(0)}
          </Avatar>
          {product?.status === 'inactive' && <ProductOverlayTag label="Deactivated" color="#363636" />}
          {product?.stockQuantity < 1 && product?.status === 'active' && (
            <ProductOverlayTag label="Out of Stock" color="#DD5B63" />
          )}
        </Box>
        <Stack gap={0.5}>
          <Stack direction="row" alignItems="center" justifyContent="start" gap={1.5}>
            <Typography variant="body4" fontWeight={600}>
              {product?.name}
            </Typography>
            {shop.shopType === 'food' && (
              <>
                {isBestSellerAndFavorite.isFavorite && !isInsideFavorites && (
                  <Typography variant="body4" fontWeight={600} fontStyle="italic" color="error">
                    Favourite
                  </Typography>
                )}
                {isBestSellerAndFavorite.isBestSeller && !isInsideBestSellers && (
                  <Typography
                    variant="body4"
                    fontWeight={600}
                    fontStyle="italic"
                    sx={{
                      color: '#5BBD4E',
                    }}
                  >
                    Bestseller
                  </Typography>
                )}
              </>
            )}
          </Stack>
          <Typography variant="body4" color={theme.palette.text.secondary2}>
            {`${product?.seoDescription?.slice(0, 50)}${product?.seoDescription?.length > 50 ? '...' : ''}`}
          </Typography>
          {product?.marketing[0]?.isActive && (
            <Typography variant="body4" color={theme.palette.text.secondary2}>
              {product?.marketing[0]?.type === 'percentage' && `${product?.discountPercentage}% discount`}
              {product?.marketing[0]?.type === 'reward' && `${product?.rewardBundle}% points enabled `}
              {product?.marketing[0]?.type === 'double_menu' && `Buy 1, get 1 free`}
            </Typography>
          )}
        </Stack>
      </Stack>
      {/* right */}
      <Stack direction="row" alignItems="center" gap={4}>
        {exchangeCurrency?.currency?.symbol && (
          <>
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                borderRadius: '30px',
                padding: '12px 24px',
                height: '38px',
                background: theme.palette.background.secondary,
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                  textWrap: 'nowrap',
                }}
              >
                {exchangeCurrency?.currency?.code} {Math.round(exchangeCurrency?.price)}
              </Typography>
            </Stack>

            <Typography variant="body1">~</Typography>
          </>
        )}
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            borderRadius: '30px',
            padding: '12px 24px',
            height: '38px',
            background: theme.palette.background.secondary,
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              textWrap: 'nowrap',
            }}
          >
            {currency} {Number(product?.price).toFixed(2)}
          </Typography>
        </Stack>

        {editable && (
          <Box
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ThreeDotsMenu
              handleMenuClick={handleMenuClick}
              menuItems={getProductMenuOptions(product, favorites, shop?.shopType)}
            />
          </Box>
        )}
      </Stack>
    </Stack>
  );
}
