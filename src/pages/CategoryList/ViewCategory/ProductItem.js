import { Avatar, Box, Stack, Typography, styled } from '@mui/material';

const StyledContainer = styled(Stack)(() => ({
  paddingTop: '20px',
  paddingBottom: '20px',
  borderBottom: '1px solid #eee',

  '&.first': {
    paddingTop: '0px',
  },

  '&.last': {
    // paddingBottom: '0px',
    borderBottom: 'none',
  },
}));

export default function ProductItem({ product, isFirst, isLast }) {
  const url = product?.images?.length ? product?.images[0] : '';

  return (
    <StyledContainer
      className={`${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`}
      direction="row"
      alignItems="center"
      gap={3}
    >
      <Avatar src={url} variant="rounded" sx={{ width: '66px', height: '52px' }}>
        {product?.name?.charAt(0)}
      </Avatar>
      <Box>
        <Typography variant="body2" fontWeight={600}>
          {product?.name}
        </Typography>
      </Box>
    </StyledContainer>
  );
}
