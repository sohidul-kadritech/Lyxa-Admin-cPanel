/* eslint-disable import/no-named-as-default */
import { Edit, ExpandMore } from '@mui/icons-material';
import { AccordionDetails, Box, Stack, Typography, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { ReactComponent as HandleIcon } from '../../../assets/icons/handle.svg';
import StyledIconButton from '../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../components/Styled/StyledSwitch';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { ProductsContext } from '../ProductContext';
import ProductsContainer from './ProductsContainer';
import { StyledAccordion, StyledAccordionSummary } from './helpers';

export default function SubCategoryItem({ subCategory, gOpen, asSearchResult, secondaryCurrency }) {
  const theme = useTheme();

  const { setEditSubCategory } = useContext(ProductsContext);
  const [open, setOpen] = useState(!!subCategory?.sortedProducts?.length);

  useEffect(() => {
    if (gOpen !== null) {
      setOpen(gOpen);
    }
  }, [gOpen]);

  const product = () => {
    if (subCategory?.sortedProducts === undefined) console.log('====>', subCategory);
    return subCategory?.sortedProducts || [];
  };

  // categoryMutation
  const subCategoryMutation = useMutation(
    (data) =>
      AXIOS.post(Api.EDIT_SUB_CATEGORY, {
        ...(subCategory?.subCategory || {}),
        id: subCategory?.subCategory?._id,
        ...data,
      }),
    {
      onSuccess: (data, args) => {
        console.log(data);
        if (data?.status) {
          subCategory.subCategory.status = args.status;
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  return (
    <StyledAccordion
      expanded={open}
      onChange={(e, closed) => {
        setOpen(closed);
      }}
      sx={{
        backgroundColor: '#fbfbfb',
      }}
    >
      <StyledAccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" paddingRight={6}>
          <Stack direction="row" alignItems="center" gap={5}>
            <HandleIcon className={`${asSearchResult ? 'cursor-not-allowed' : 'drag-handler-sub-category grabable'}`} />
            <Stack direction="row" alignItems="center" gap={5}>
              <Box>
                <Typography variant="body4" fontWeight={600} color="textPrimary" display="block" pb={1.5}>
                  {subCategory?.subCategory?.name}
                </Typography>
                <Typography variant="body4" fontWeight={600} color={theme.palette.text.secondary2} display="block">
                  {subCategory?.sortedProducts?.length || 0} Items
                </Typography>
              </Box>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            gap={5}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <>
              <StyledIconButton
                color="primary"
                onClick={() => {
                  setEditSubCategory(subCategory?.subCategory);
                }}
                sx={{
                  '& .MuiSvgIcon-root': {
                    color: 'inherit',
                  },
                }}
              >
                <Edit />
              </StyledIconButton>
              <StyledSwitch
                checked={subCategory?.subCategory?.status === 'active'}
                onChange={(e) => {
                  subCategoryMutation.mutate({
                    status: e.target.checked ? 'active' : 'inactive',
                  });
                }}
              />
            </>
          </Stack>
        </Stack>
      </StyledAccordionSummary>
      <AccordionDetails>
        <ProductsContainer secondaryCurrency={secondaryCurrency} products={product()} asSearchResult={asSearchResult} />
        {/* <Box pl={8.5} pt={6}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              // setNewSubCategoryId(category?.category?.category?._id);
            }}
          >
            Add Product
          </Button>
        </Box> */}
      </AccordionDetails>
    </StyledAccordion>
  );
}
