/* eslint-disable react/jsx-no-useless-fragment */
import { Stack, Typography } from '@mui/material';

export function InfoCardForPayout({
  title,
  value,
  currency,
  isNegative,
  sx,
  isExpandable,
  expandSx,
  showIfZero = false,
}) {
  const show = Number(value) !== 0 || showIfZero === true;
  return (
    <>
      {show ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            borderBottom: `1px solid #eeeeee`,
            padding: !isExpandable ? '8px 0px' : `8px 0px 8px ${expandSx || '0px'}`,
            ...(sx || {}),
          }}
        >
          <Typography variant="body" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {currency && (
            <Typography
              variant="body"
              sx={{ fontWeight: isExpandable ? 400 : 600, color: isNegative ? 'danger.main' : 'text.primary' }}
            >
              {isNegative ? `- ${currency} ${value}` : `${currency} ${value}`}
            </Typography>
          )}

          {!currency && (
            <Typography
              variant="body"
              sx={{ fontWeight: isExpandable ? 400 : 600, color: isNegative ? 'danger.main' : 'text.primary' }}
            >
              {isNegative ? `- ${value}` : `${value}`}
            </Typography>
          )}
        </Stack>
      ) : (
        <></>
      )}
    </>
  );
}
