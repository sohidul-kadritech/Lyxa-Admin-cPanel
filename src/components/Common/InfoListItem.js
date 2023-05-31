import { Stack, Typography } from '@mui/material';

export default function InfoListItem({ icon: Icon, title, isFirst, containerSx, titleSx, dotColor }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="start"
      className={isFirst ? 'first-info' : ''}
      gap="6px"
      sx={{
        position: 'relative',
        padding: '0 20px',

        '&::before': {
          content: "''",
          position: 'absolute',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: dotColor || 'text.primary',
          display: 'block',
          left: '0px',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        },

        '&.first-info': {
          paddingLeft: 0,

          '&::before': {
            display: 'none',
          },
        },
        ...containerSx,
      }}
    >
      {Icon && <Icon />}
      <Typography variant="h4" fontWeight={500} sx={titleSx}>
        {title}
      </Typography>
    </Stack>
  );
}
