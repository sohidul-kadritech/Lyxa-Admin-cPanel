import { Avatar, Stack, Typography } from '@mui/material';

export default function UserAvatar({ imgUrl, imgAlt, imgStyle, imgFallbackCharacter, name, subTitle }) {
  return (
    <Stack direction="row" alignItems="center" gap={5}>
      <Avatar alt={imgAlt} src={imgUrl} variant={imgStyle} sx={{ width: 36, height: 36 }}>
        {imgFallbackCharacter}
      </Avatar>
      <Stack gap={1.5}>
        <Typography variant="body4">{name}</Typography>
        {subTitle && (
          <Typography
            variant="body4"
            sx={{
              fontSize: '13px',
              lineHeight: '15px',
              color: '#737373',
            }}
          >
            {subTitle}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}
