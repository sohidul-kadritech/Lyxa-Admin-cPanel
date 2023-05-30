import { Box, Stack, Typography, useTheme } from '@mui/material';
import { ReactComponent as StarIcon } from '../../../assets/icons/star.svg';

export default function Rating({ review, isFirst, isLast }) {
  const theme = useTheme();

  return (
    <Box
      key={review?._id}
      sx={{
        paddingBottom: '22px',
        borderBottom: isLast ? undefined : '1px solid #EEEEEE',
        paddingTop: isFirst ? undefined : '28px',
      }}
    >
      <Typography variant="body4" fontWeight={600} pb={2.5} display="block">
        {review?.type === 'shop' && 'Order Rating'}
        {review?.type === 'deliveryBoy' && 'Rider Rating'}
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
      <Stack direction="row" alignItems="center" gap={2.5} flexWrap="nowrap">
        {review?.reviewTags?.map((tag, index) => (
          <Typography
            key={index}
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
            {tag}
          </Typography>
        ))}
      </Stack>
      <Typography variant="body4" color="#737373" fontWeight={400} pt={7}>
        Tell us more here
      </Typography>
      <Typography variant="body4" pt={2.5} color={!review?.reviewDes ? '#a7a7a7' : undefined}>
        {review?.reviewDes || 'Empty'}
      </Typography>
    </Box>
  );
}
