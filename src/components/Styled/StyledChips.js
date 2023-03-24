import { Chip, styled } from '@mui/material';

const StyledChip = styled(Chip)(({ theme }) => ({
  background: theme.palette.background.secondary,
  borderRadius: '30px',
  padding: '12px 30px',
  height: 'auto',
  gap: '12px',

  '& .MuiChip-label': {
    padding: '0',
    fontFamily: 'Inter',
    fontWeight: '500',
    lineHeight: '24px',
  },

  '& .MuiSvgIcon-root': {
    fontSize: '17px',
    color: '#3F4254',
    margin: '0',

    '&:hover': {
      color: '#3F4254',
      opacity: '.7',
    },
  },
}));

export default StyledChip;
