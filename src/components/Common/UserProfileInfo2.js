import { Avatar, Box, Stack, Typography } from '@mui/material';
import CameraIconButton from './CameraIconButton';
import Rating from './Rating';

export default function UserProfileInfo2({ onDrop, name, image, reviews, autoGenId, rating }) {
  return (
    <Stack direction="row" gap="20px">
      <Box sx={{ position: 'relative' }}>
        <Avatar alt="Shop" variant="circular" src={image} sx={{ width: 100, height: 100 }}>
          {name
            ?.split(' ')
            .reduce((prev, cur) => prev + cur.charAt(0), '')
            .slice(0, 3)}
        </Avatar>
        <CameraIconButton
          sx={{
            position: 'absolute',
            bottom: '0px',
            right: '-5px',
          }}
          onFileSelect={(e) => {
            onDrop(e.target.files);
          }}
        />
      </Box>
      <Stack justifyContent="center">
        <Typography variant="h2" sx={{ fontSize: '30px', fontWeight: 500 }}>
          {name}
        </Typography>
        <Typography
          pt={1}
          variant="inherit"
          sx={{
            color: 'text.secondary2',
            fontSize: '20px',
            fontWeight: 500,
          }}
        >
          # {autoGenId}
        </Typography>
        <Stack direction="row" alignItems="center" pt={1} gap={1}>
          <Rating amount={rating} />
          <Typography variant="body1" color="text.secondary2">
            ({reviews?.length <= 100 ? `${reviews?.length}` : `100+`} Reviews)
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
