// import
import { Container, Draggable } from 'react-smooth-dnd';
import SubCategoryItem from './SubCategoryItem';

export default function SubCategoriesContainer({ subCategories }) {
  return (
    <Container>
      {subCategories.map((subCategory) => (
        <Draggable key={subCategory?.subCategory?._id}>
          <SubCategoryItem category={subCategory} />
        </Draggable>
      ))}
    </Container>
  );
}
