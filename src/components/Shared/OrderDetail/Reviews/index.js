import { Stack, Typography } from '@mui/material';
import Rating from './Rating';

export default function Review({ reviews = [] }) {
  return (
    <Stack>
      {reviews?.map((review, index, { length }) => (
        <Rating isFirst={index === 0} isLast={index === length - 1} review={review} key={index} />
      ))}
      {reviews.length === 0 && (
        <Stack pt={30} pb={3}>
          <Typography textAlign="center" variant="body1">
            No Reviews
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
