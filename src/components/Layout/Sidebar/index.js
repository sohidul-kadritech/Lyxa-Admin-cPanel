/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, styled } from '@mui/material';
import { useSelector } from 'react-redux';
import { ReactComponent as Logo } from '../../../assets/icons/lyxa-sidebar-logo.svg';
import MenuList from './MenuList';

const StyledSidebarContaier = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  background: '#fff',
  zIndex: 99999,
  width: '230px',
  overflowY: 'scroll',
  height: '100vh',
  transition: 'transform 225ms ease',
  transform: 'translateX(-100%)',

  '&.show': {
    transform: 'translateX(0)',
  },

  '&.child': {
    position: 'static',
    transform: 'translateX(0%)',
    height: 'calc(100vh - 83px)',
  },
}));

const StyledOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9999,
  opacity: '0',
  visibility: 'hidden',
  pointerEvents: 'none',
  transition: 'opacity 225ms ease',

  '&.show': {
    opacity: '1',
    visibility: 'visible',
    pointerEvents: 'all',
  },
}));

export default function Sidebar({ variant, sidebar, setSidebar, menuItems = [], title }) {
  const { account_type, adminType } = useSelector((store) => store.Login.admin);

  return (
    <Box>
      <StyledSidebarContaier
        className={variant === 'child' ? 'child' : sidebar ? 'show' : undefined}
        sx={{
          background: variant === 'parent' ? 'white' : '#333333',
        }}
      >
        {/* logo */}
        {variant === 'child' && (
          <Box
            sx={{
              textAlign: 'center',
              padding: '27px 0px 20px 0px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
              top: '0px',
              position: 'sticky',
              background: '#333333',
            }}
          >
            <Logo />
            <Typography
              variant="h3"
              sx={{
                color: '#fff',
                fontWeight: '500',
                fontSize: '22px',
                lineHeight: '27px',
                paddingTop: '20px',
                letterSpacing: '0.05em',
              }}
            >
              {title}
            </Typography>
          </Box>
        )}
        <Stack pb={8.5}>
          {menuItems.map((list, index) => (
            <MenuList
              key={index}
              variant={variant}
              menuList={list}
              onLinkClick={() => {
                if (variant === 'parent') setSidebar(false);
              }}
            />
          ))}
        </Stack>
      </StyledSidebarContaier>
      <StyledOverlay
        className={sidebar && variant === 'parent' ? 'show' : undefined}
        onClick={() => {
          setSidebar(false);
        }}
      />
    </Box>
  );
}
