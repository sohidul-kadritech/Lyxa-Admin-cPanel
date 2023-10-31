/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Avatar, Button, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { successMsg } from '../../../helpers/successMsg';
import FormateBaseCurrency from '../../Common/FormateBaseCurrency';
import { dealTypeToLabelMap } from './AdjustMentProduct';
import { Attributes } from './Attriubtes';
import { SingleItemcalculatePrice, getProductPriceForAdjustMent } from './helpers';

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
    }

    console.log({
      selectedAttributes,
      product,
      price: SingleItemcalculatePrice({
        quantity: 1,
        selectedAttributes,
        ...product,
      }),
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
              {FormateBaseCurrency?.get(getProductPriceForAdjustMent(product, product?.marketing?.type)?.finalPrice)}
            </Typography>

            {getProductPriceForAdjustMent(product, product?.marketing?.type)?.shouldShowBoth && (
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
                  getProductPriceForAdjustMent(product, product?.marketing?.type)?.originalPrice,
                )}
              </Typography>
            )}
          </Stack>
          {product?.marketing?.type && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                lineHeight: '14px',
                fontSize: '12px',
                color: 'text.secondary2',
              }}
            >
              {dealTypeToLabelMap[product?.marketing?.type]}
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
                  if (onClickProduct) onClickProduct({ attribute: data, product });

                  setSelectedAttributes((prev) => {
                    // finding new attributes is already exist or not
                    const findAtributesIndex = prev?.findIndex((atr) => atr?._id === data?.attribute?._id);

                    // if exist go here
                    if (findAtributesIndex > -1) {
                      // finding new attributes item is exist or not
                      const findIndexAttributeItem = prev[findAtributesIndex]?.attributeItems?.findIndex(
                        (item) => item?._id === data?.attribute?.attributeItems[0]?._id,
                      );

                      // if new attirubtes is exist go here
                      if (findIndexAttributeItem > -1) {
                        if (prev[findAtributesIndex]?.attributeItems?.length > 1)
                          prev[findAtributesIndex]?.attributeItems.splice(findIndexAttributeItem, 1);
                        else prev?.splice(findAtributesIndex, 1);
                      } else if (prev[findAtributesIndex]?.select === 'multiple') {
                        prev[findAtributesIndex].attributeItems = [
                          ...prev[findAtributesIndex]?.attributeItems,
                          data?.attribute?.attributeItems[0],
                        ];
                      } else {
                        prev[findAtributesIndex].attributeItems = [data?.attribute?.attributeItems[0]];
                      }

                      return [...prev];
                    }

                    return [...prev, { ...data?.attribute, items: [] }];
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
