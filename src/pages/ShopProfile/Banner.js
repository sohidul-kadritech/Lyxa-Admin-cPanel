import { Box } from '@mui/material';
import { CoverPhotoButton } from './helper';

export default function ShopBanner({ shop, loading, onDrop }) {
  return (
    <Box
      sx={{
        borderRadius: '7px',
        overflow: 'hidden',
        height: '350px',
        width: '100%',
        position: 'relative',
      }}
    >
      <img
        src={shop?.shopBanner}
        alt="Banner"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <CoverPhotoButton
        loading={loading}
        onDrop={(acceptedFiles) => {
          onDrop(acceptedFiles, 'banner');
        }}
        label="Add Cover Photo"
      />
    </Box>
  );
}
