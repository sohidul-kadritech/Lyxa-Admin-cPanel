// import
import { Container, Draggable } from 'react-smooth-dnd';
import SubCategory from './SubCategory';

export default function SubCategoriesContainer({ subCategories }) {
  return (
    <Container>
      {subCategories.map((subCategory) => (
        <Draggable key={subCategory?.subCategory?._id}>
          <SubCategory category={subCategory} />
        </Draggable>
      ))}
    </Container>
  );
}
