import { West } from '@mui/icons-material';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import BreadCrumbs from './BreadCrumb2';
import PageButton from './PageButton';

export default function PageTop({ breadcrumbItems, backTo, backButtonLabel, onAdd, addButtonLabel, title, subtitle }) {
  const theme = useTheme();

  return (
    <Box pt={9} pb={7.5}>
      {(backButtonLabel || addButtonLabel) && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" pb={3.5}>
          {backButtonLabel && <PageButton label={backButtonLabel} to={backTo} startIcon={<West />} />}
          {addButtonLabel && (
            <Button
              color="secondary"
              variant="contained"
              sx={{
                borderRadius: '8px',
                padding: '11px 30px',
              }}
              onClick={onAdd}
            >
              {addButtonLabel}
            </Button>
          )}
        </Stack>
      )}
      {breadcrumbItems && <BreadCrumbs items={breadcrumbItems} />}
      {title && (
        <>
          <Typography
            variant="h4"
            color={theme.palette.text.primary}
            sx={{
              pb: subtitle ? 2 : 0,
            }}
          >
            {title}
          </Typography>
          {subtitle && <Typography variant="body3">{subtitle}</Typography>}
        </>
      )}
    </Box>
  );
}
