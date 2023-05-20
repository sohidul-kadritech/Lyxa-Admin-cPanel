import { Box, Stack, Typography, useTheme } from '@mui/material';
import { ReactComponent as StarIcon } from '../../../assets/icons/star.svg';

export default function Review({ reviews = {} }) {
  const theme = useTheme();

  return (
    <Stack>
      {reviews?.map((review, index, { length }) => (
        <Box
          key={index}
          sx={{
            paddingBottom: '22px',
            borderBottom: index === length - 1 ? undefined : '1px solid #EEEEEE',
            paddingTop: index === 0 ? undefined : '28px',
          }}
        >
          <Typography variant="body4" fontWeight={600} pb={2.5} display="block">
            {review?.type === 'shop' && 'Order Rating'}
            {review?.type === 'rider' && 'Rider Rating'}
          </Typography>
          <Typography
            variant="body4"
            fontWeight={600}
            display="flex"
            color={theme.palette.success.main}
            sx={{
              alignItems: 'center',
              gap: 1,
            }}
          >
            <StarIcon />
            {review?.rating}
          </Typography>
          <Typography variant="body4" color="#737373" fontWeight={400} pt={7}>
            Tag your experience
          </Typography>
          <Typography
            variant="body4"
            lineHeight="20px"
            color="#fff"
            sx={{
              display: 'inline-block',
              padding: '6px 15px',
              borderRadius: '30px',
              background: theme.palette.primary.main,
              marginTop: '10px',
            }}
          >
            {review?.reviewTitle}
          </Typography>
          <Typography variant="body4" color="#737373" fontWeight={400} pt={7}>
            Tell us more here
          </Typography>
          <Typography variant="body4" pt={2.5}>
            {review?.reviewDescription}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
