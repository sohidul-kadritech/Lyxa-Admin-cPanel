/* eslint-disable no-unused-vars */
import { Stack, Typography, useTheme } from '@mui/material';

export function Attributes({ attribute, onClickProduct }) {
  const theme = useTheme();
  return (
    <Stack>
      <Stack direction="row" alignItems="center" gap={2}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, fontSize: '14px', fontStyle: 'italic', color: 'text.secondary2' }}
        >
          {attribute?.name}
        </Typography>
        {attribute?.required && (
          <Typography
            variant="body"
            sx={{
              fontWeight: 600,
              fontSize: '10px',
              fontStyle: 'italic',
              color: theme?.palette?.primary?.contrastText,
              background: theme?.palette?.text?.primary,
              padding: '2px 4px',
              borderRadius: '7px',
            }}
          >
            Required
          </Typography>
        )}
        {attribute?.select === 'multiple' && (
          <Typography
            variant="body"
            sx={{
              fontWeight: 600,
              fontSize: '10px',
              fontStyle: 'italic',
              color: theme?.palette?.primary?.contrastText,
              background: theme?.palette?.text?.primary,
              padding: '2px 4px',
              borderRadius: '7px',
            }}
          >
            Multiple
          </Typography>
        )}
      </Stack>

      <Stack
        sx={{
          background: '#fff',
          borderRadius: '10px',
        }}
      >
        {attribute?.items?.map((item, i) => (
          <Typography
            variant="h6"
            key={i}
            onClick={() => {
              if (onClickProduct) onClickProduct({ isMultiple: attribute?.select === 'multiple', attribute: item });
            }}
            sx={{
              fontWeight: 500,
              fontSize: '14px',
              color: 'text.secondary2',
              transition: 'all 0.3s linear',
              paddingLeft: '16px',
              '&:hover': {
                backgroundColor: 'rgba(177, 177, 177, 0.2)',
              },
            }}
          >
            {item?.name}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
}
