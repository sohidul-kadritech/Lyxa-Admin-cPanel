/* eslint-disable react/jsx-no-useless-fragment */
// import
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

export default function SubCategoriesContainer({ subCategories, gOpen }) {
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

  return (
    <Container lockAxis="y" dragHandleSelector=".drag-handler-sub-category" onDrop={onDrop}>
      {subCategories.map((subCategory, index, { length }) => (
        <Draggable key={subCategory?.subCategory?._id}>
          <SubCategoryItem gOpen={gOpen} subCategory={subCategory} sx={index === length - 1 ? noBorder : {}} />
        </Draggable>
      ))}
    </Container>
  );
}
