import { ExpandMore } from '@mui/icons-material';
import { Avatar, Box, Stack, Tooltip, Typography } from '@mui/material';

export default function UserAvatar({
  imgUrl,
  imgAlt,
  imgStyle,
  imgFallbackCharacter,
  name,
  subTitle,
  subTitleProps,
  toolTip,
  titleProps,
  expandIcon,
  onClickExpand,
}) {
  return (
    <Stack direction="row" alignItems="center" gap={5}>
      <Avatar alt={imgAlt} src={imgUrl} variant={imgStyle} sx={{ width: 36, height: 36 }}>
        {imgFallbackCharacter || name?.charAt(0)}
      </Avatar>
      <Stack gap={1.5} flex={1}>
        <Tooltip title={toolTip}>
          <Typography variant="body4" component="p" {...titleProps}>
            {name}
          </Typography>
        </Tooltip>
        {subTitle && (
          <Typography
            variant="body4"
            {...subTitleProps}
            sx={{
              fontSize: '13px',
              lineHeight: '15px',
              color: '#737373',
              ...subTitleProps?.sx,
            }}
          >
            {subTitle}
          </Typography>
        )}
      </Stack>
      {expandIcon && (
        <Box
          sx={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onClickExpand();
          }}
        >
          <ExpandMore />
        </Box>
      )}
    </Stack>
  );
}
