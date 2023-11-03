/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { ExpandMore } from '@mui/icons-material';
import { AccordionDetails, Avatar, Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useGlobalContext } from '../../../../../context';
import { StyledAccordion, StyledAccordionSummary } from '../../../../Menu/List/helpers';
import ProductsContainer from './ProductsContainer';
import SubcategoryCard from './SubcategoryCard';

function CategoryCard({ category }) {
  const { currentUser } = useGlobalContext();

  const { shop } = currentUser;

  const theme = useTheme();

  const [open, setOpen] = useState(!!category?.sortedProducts?.length || !!category?.subCategories?.length);

  const product = () => {
    if (category?.sortedProducts === undefined) console.log('====>', category);
    return category?.sortedProducts || [];
  };

  return (
    <StyledAccordion
      expanded={open}
      onChange={(e, closed) => {
        setOpen(closed);
      }}
      sx={{
        borderBottom: open ? '1px solid #EEEEEE' : null,
        backgroundColor: '#fbfbfb',
      }}
    >
      <StyledAccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" paddingRight={6}>
          <Stack direction="row" alignItems="center" gap={5}>
            <Stack direction="row" alignItems="center" gap={5}>
              {shop?.shopType !== 'food' && (
                <Avatar
                  src={category?.category?.category?.image}
                  alt={category?.category?.category?.name}
                  variant="rounded"
                  sx={{ width: 66, height: 52 }}
                >
                  {category?.category?.category?.name?.charAt(0) || 'C'}
                </Avatar>
              )}

              <Box>
                <Stack direction="row" alignItems="center" justifyContent="start" gap={1.5} pb={1.5}>
                  {category?.category?.status === 'inactive' && (
                    <Tooltip title={shop?.shopType === 'food' ? 'Deactivated by shop' : 'Deactivated by admin'}>
                      <Box
                        sx={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: '#FFAB09',
                        }}
                      />
                    </Tooltip>
                  )}
                  <Typography variant="body4" fontWeight={600} color="textPrimary" display="block">
                    {category?.category?.name}
                  </Typography>
                </Stack>
                <Typography variant="body4" fontWeight={600} color={theme.palette.text.secondary2} display="block">
                  {/* {shop?.shopType === 'food' &&
                    (isOridanryCategory ? `${category?.sortedProducts?.length} items` : '3 items (max) ')} */}
                  {shop?.shopType !== 'food' && `${category?.subCategories?.length} sub categories`}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </StyledAccordionSummary>
      <AccordionDetails>
        {shop?.shopType === 'food' ? (
          <ProductsContainer
            products={product()}
            // secondaryCurrency={secondaryCurrency}
            // asSearchResult={asSearchResult}
            isInsideFavorites={category?.category?.isShopFavorites}
            isInsideBestSellers={category?.category?.isShopBestSellers}
            // type={type}
          />
        ) : (
          <SubcategoryCard
            // secondaryCurrency={secondaryCurrency}
            // gOpen={gOpen}
            subCategories={category?.subCategories}
            // asSearchResult={asSearchResult}
          />
        )}
      </AccordionDetails>
    </StyledAccordion>
  );
}

export default CategoryCard;
