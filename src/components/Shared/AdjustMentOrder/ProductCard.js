/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Avatar, Button, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { successMsg } from '../../../helpers/successMsg';
import FormateBaseCurrency from '../../Common/FormateBaseCurrency';
import { Attributes } from './Attriubtes';
import { checkAnyMarketing, getProductPriceForAdjustMent } from './helpers';

export const dealTypeToLabel = (type, product) => {
  const template = {
    percentage: 'Discount',
    double_menu: 'Buy 1 Get 1',
    reward: 'Reward',
  };

  console.log({ product });

  if (type === 'percentage') {
    return `${product?.discountPercentage}% Up to ${FormateBaseCurrency.get(product?.discount)} ${template[type]}`;
  }
  if (type === 'reward') {
    return `${template[type]} ${product?.reward?.points} Pts`;
  }

  return template[type];
};

const attributeContainerSx = (open) => {
  const tempSx = {
    position: 'relative',
    top: '0px',
    width: '100%',
    opacity: 0,
    overflow: 'auto',
    maxHeight: '0px',
    pointerEvents: 'none',
    transition: 'all 0.3s linear',
    // maxHeight: '150px',
  };

  if (open) {
    delete tempSx?.visibility;
    delete tempSx?.pointerEvents;
    return { ...tempSx, top: '0px', opacity: 1, maxHeight: '250px' };
  }

  return tempSx;
};

export function ProductCard({ product, onClickProduct }) {
  const [openAttribute, setOpenAttriute] = useState(false);
  // selected products
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const theme = useTheme();

  console.log({ marketing: checkAnyMarketing(product) });

  const onClickAddButton = () => {
    let requiredAttributeCount = 0;
    let selectedRequiredAttributeCount = 0;
    product?.attributes?.forEach((attribute) => {
      if (attribute?.required) {
        requiredAttributeCount++;
      }
    });

    selectedAttributes?.forEach((attribute) => {
      if (attribute?.required) {
        selectedRequiredAttributeCount++;
      }
    });

    if (requiredAttributeCount !== selectedRequiredAttributeCount) {
      successMsg('Required attributes should not empty');

      return;
    }

    onClickProduct({
      product: {
        ...product,
        selectedAttributes: [...selectedAttributes],
      },
    });
  };
  return (
    <Stack
      py={1}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s linear',
        padding: '8px 20px',
        '&:hover': {
          backgroundColor: 'rgba(177, 177, 177, 0.2)',
        },
      }}
    >
      {/* products */}
      <Stack
        onClick={() => {
          if (product?.attributes?.length > 0) {
            setOpenAttriute(!openAttribute);
            return;
          }

          if (onClickProduct) onClickProduct({ product });
        }}
        direction="row"
        gap={2.5}
        alignItems="center"
      >
        <Avatar
          src={product?.images[0]}
          alt="product-image"
          sx={{
            width: '30px',
            height: '30px',
          }}
        >
          {product?.name.charAt(0).toUpperCase()}
        </Avatar>
        <Stack>
          <Stack direction="row" gap={2.5} alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {product?.name}
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, fontSize: '14px', fontStyle: 'italic', color: 'text.secondary2' }}
            >
              {FormateBaseCurrency?.get(
                getProductPriceForAdjustMent(product, checkAnyMarketing(product)?.type)?.finalPrice,
              )}
            </Typography>

            {getProductPriceForAdjustMent(product, checkAnyMarketing(product)?.type)?.shouldShowBoth && (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  fontSize: '14px',
                  fontStyle: 'italic',
                  color: 'text.secondary2',
                  textDecoration: 'line-through',
                }}
              >
                {FormateBaseCurrency?.get(
                  getProductPriceForAdjustMent(product, checkAnyMarketing(product)?.type)?.originalPrice,
                )}
              </Typography>
            )}
          </Stack>
          {checkAnyMarketing(product) && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                lineHeight: '14px',
                fontSize: '12px',
                color: 'text.secondary2',
              }}
            >
              {dealTypeToLabel(checkAnyMarketing(product)?.type, product)}
            </Typography>
          )}
        </Stack>
      </Stack>

      <Stack sx={{ ...attributeContainerSx(openAttribute) }} gap={2} mt={product?.attributes?.length > 0 ? 2 : 0}>
        {/* attributes */}
        {product?.attributes?.length > 0 && (
          <Stack gap={2.5} paddingBottom="20px">
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '14px', color: 'text.secondary' }}>
              Attributes
            </Typography>
            {product?.attributes?.map((attribute, i) => (
              <Attributes
                selectedAttributes={selectedAttributes}
                onClickProduct={(data) => {
                  // if (onClickProduct) onClickProduct({ attribute: data, product });

                  setSelectedAttributes((prev) => {
                    // finding new attributes is already exist or not
                    const findAtributesIndex = prev?.findIndex((atr) => atr?._id === data?.attribute?._id);

                    // if exist go here
                    if (findAtributesIndex > -1) {
                      // finding new attributes item is exist or not
                      const findIndexAttributeItem = prev[findAtributesIndex]?.selectedItems?.findIndex(
                        (item) => item?._id === data?.attribute?.selectedItems[0]?._id,
                      );

                      // if new attirubtes is exist go here
                      if (findIndexAttributeItem > -1) {
                        if (prev[findAtributesIndex]?.selectedItems?.length > 1)
                          prev[findAtributesIndex]?.selectedItems.splice(findIndexAttributeItem, 1);
                        else prev?.splice(findAtributesIndex, 1);
                      } else if (prev[findAtributesIndex]?.select === 'multiple') {
                        prev[findAtributesIndex].selectedItems = [
                          ...prev[findAtributesIndex]?.selectedItems,
                          data?.attribute?.selectedItems[0],
                        ];
                      } else {
                        prev[findAtributesIndex].selectedItems = [data?.attribute?.selectedItems[0]];
                      }

                      return [...prev];
                    }

                    return [...prev, { ...data?.attribute }];
                  });
                }}
                key={i}
                attribute={attribute}
              />
            ))}

            <Stack direction="row" justifyContent="flex-end">
              <Button
                variant="contained"
                size="small"
                sx={{
                  '&.MuiButton-root': {
                    padding: '4px 0px',
                  },
                }}
                onClick={() => {
                  onClickAddButton();
                }}
              >
                Add
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
