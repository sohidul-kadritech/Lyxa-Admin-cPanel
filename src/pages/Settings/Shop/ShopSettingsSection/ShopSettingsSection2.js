import { Box, Typography, useTheme } from '@mui/material';
import { ReactComponent as SupremeIcon } from '../../../../assets/icons/shop-settings-icons/supreme.svg';
import { ShopAction2 } from '../ShopAction/ShopAction2';

export function ShopSettingsSection2({ title, title2, isButton, buttonType, isMethod, options, ...props }) {
  const theme = useTheme();
  console.log(buttonType);
  const boxSx = {
    width: '100%',
    color: '#000',
  };
  const TypoSx = {
    fontSize: '16px',
    fontWeight: 600,
  };

  return (
    <Box sx={boxSx}>
      <Typography sx={TypoSx}>{title}</Typography>
      {isMethod && (
        <Box sx={{ display: 'flex', justifyContent: 'start', gap: '12px', marginTop: '16px', alignContent: 'center' }}>
          <Typography sx={TypoSx}> {title2}</Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'start',
              gap: '10px',
              alignContent: 'center',
              color: theme.palette.error.main,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
              <SupremeIcon />
            </Box>
            <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>SUPERADMIN</Typography>
          </Box>
        </Box>
      )}
      {isButton && (
        <Box>
          <ShopAction2 options={options} {...props} />
        </Box>
      )}
    </Box>
  );
}
