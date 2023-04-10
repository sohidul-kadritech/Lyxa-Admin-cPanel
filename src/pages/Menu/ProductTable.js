import { Container, Draggable } from 'react-smooth-dnd';
import Product from './Product';

export default function ProductTable({ products }) {
  return (
    <Container>
      {products.map((product) => (
        <Draggable key={product?._id}>
          <Product key={product} />
        </Draggable>
      ))}
    </Container>
  );
}
