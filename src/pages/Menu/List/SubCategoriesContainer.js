/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
// import
import { Stack } from '@mui/material';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { Container, Draggable } from 'react-smooth-dnd';
import dropSort from '../../../helpers/dropSort';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import SubCategoryItem from './SubCategoryItem';

const noBorder = {
  '& .MuiAccordionSummary-root': {
    borderBottom: 'none',
  },
};

// eslint-disable-next-line no-unused-vars
export default function SubCategoriesContainer({
  subCategories,
  gOpen,
  asSearchResult,
  secondaryCurrency,
  editable,
  OnCheckProduct,
  suggestedProducts,
}) {
  const [render, setRender] = useState(false);

  const subCategorySortingMutation = useMutation((data) => AXIOS.post(Api.SUB_CATEGORY_SORTING, data));

  const onDrop = ({ removedIndex, addedIndex }) => {
    subCategorySortingMutation.mutate({
      subCategories: dropSort(removedIndex, addedIndex, subCategories).map((subCategory, index) => ({
        id: subCategory?.subCategory?._id,
        sortingOrder: index + 1,
      })),
    });

    setRender(!render);
  };

  if (subCategories?.length === 0) {
    return <></>;
  }

  // if(asSearchResult && )

  return (
    <>
      {editable && (
        <Container lockAxis="y" dragHandleSelector=".drag-handler-sub-category" onDrop={onDrop}>
          {subCategories?.map((subCategory, index, { length }) => {
            if (asSearchResult && !subCategory?.subCategory.matched) {
              return null;
            }

            return (
              <Draggable key={subCategory?.subCategory?._id}>
                <SubCategoryItem
                  secondaryCurrency={secondaryCurrency}
                  gOpen={gOpen}
                  subCategory={subCategory}
                  sx={index === length - 1 ? noBorder : {}}
                  asSearchResult={asSearchResult}
                />
              </Draggable>
            );
          })}
        </Container>
      )}

      {!editable && (
        <Stack>
          {subCategories?.map((subCategory, index, { length }) => {
            if (asSearchResult && !subCategory?.subCategory.matched) {
              return null;
            }

            return (
              <SubCategoryItem
                key={subCategory?.subCategory?._id}
                secondaryCurrency={secondaryCurrency}
                gOpen={gOpen}
                subCategory={subCategory}
                sx={index === length - 1 ? noBorder : {}}
                asSearchResult={asSearchResult}
                editable={editable}
                OnCheckProduct={OnCheckProduct}
                suggestedProducts={suggestedProducts}
              />
            );
          })}
        </Stack>
      )}
    </>
  );
}
