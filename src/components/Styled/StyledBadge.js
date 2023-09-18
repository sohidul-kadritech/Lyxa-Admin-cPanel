import { Badge, styled } from '@mui/material';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 3,
    top: 30,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function StyledBadgeContainer({ children, ...props }) {
  return (
    <StyledBadge {...props} color="primary">
      {children}
    </StyledBadge>
  );
}
