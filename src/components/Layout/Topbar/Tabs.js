import { Box } from '@material-ui/core';
import { Close } from '@mui/icons-material';
import { Button, Stack, styled } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useGlobalContext } from '../../../context/GlobalContext';

const StyledTab = styled(Button)(({ theme }) => ({
  color: `${theme.palette.text.primary}!important`,
  fontSize: '15px',
  fontWeight: '600',
  border: '1px solid #E5E5E5',
  borderBottom: '0',
  padding: 0,
  width: '130px',
  height: '40px',
  borderRadius: '7px 7px 0px 0px',
  zIndex: '99',
  background: '#F2F2F2',

  '&:hover': {
    background: '#F2F2F2',
  },

  '&.active': {
    background: '#fff',
    '&:hover': {
      background: '#fff',
    },
  },
}));

export default function Tabs() {
  const history = useHistory();
  const { tabs, dispatchTabs, dispatchCurrentUser } = useGlobalContext();

  // on switch tab
  const changeTab = (tab) => {
    history.push(tab?.currentLocation);
    dispatchTabs({ type: 'change-current-tab', payload: { tabId: tab?.shopId } });
    dispatchCurrentUser({ type: 'shop', payload: { shop: tab.shop } });
  };

  // on remove tab
  const removeTab = (event, tab) => {
    event.stopPropagation();
    let fallbackTab = null;

    if (tabs.currentTabId !== tab?.shopId) {
      dispatchTabs({ type: 'remove-tab', payload: { tabId: tab?.shopId } });
      return;
    }

    // find if any other tab is available
    if (tabs.allTabs[0]?.shopId !== tab?.shopId) {
      // eslint-disable-next-line prefer-destructuring
      fallbackTab = tabs.allTabs[0];
    } else {
      fallbackTab = tabs.allTabs[1] || fallbackTab;
    }

    // if not, redirect to home page
    if (fallbackTab) {
      changeTab(fallbackTab);
    } else {
      dispatchCurrentUser({ type: 'shop', payload: { shop: {} } });
      history.push('/');
    }

    dispatchTabs({ type: 'remove-tab', payload: { tabId: tab?.shopId } });
  };

  return (
    <Stack direction="row" alignItems="center" gap={1.5} position="relative">
      {tabs.allTabs.map((tab) => (
        <StyledTab
          key={tab?.shopId}
          className={tabs?.currentTabId === tab?.shopId ? 'active' : undefined}
          endIcon={
            <Close
              onClick={(event) => {
                removeTab(event, tab);
              }}
            />
          }
          disableRipple
          onClick={() => {
            changeTab(tab);
          }}
        >
          {tab?.shopName}
        </StyledTab>
      ))}
      <Box
        sx={{
          position: 'absolute',
          left: '0',
          right: '0',
          bottom: '0',
          width: '100%',
          height: '1px',
          background: '#E5E5E5',
          zIndex: '9',
        }}
      ></Box>
    </Stack>
  );
}
