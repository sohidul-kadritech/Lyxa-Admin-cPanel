/* eslint-disable no-unused-vars */
import { Box } from '@material-ui/core';
import { Close } from '@mui/icons-material';
import { Button, Stack, styled } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useGlobalContext } from '../../../context';

const StyledTab = styled(Button)(({ theme }) => ({
  color: `${theme.palette.text.primary}!important`,
  fontSize: '15px',
  fontWeight: '600',
  border: '1px solid #E5E5E5',
  borderBottom: '0',
  padding: '0 8px',
  width: '170px',
  height: '40px',
  borderRadius: '7px 7px 0px 0px',
  zIndex: '99',
  background: '#F2F2F2',
  justifyContent: 'space-between',

  '& span': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  '& .MuiButton-endIcon': {
    flexShrink: 0,
  },

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
  const location = useLocation();
  const { shopTabs, dispatchShopTabs, dispatchCurrentUser } = useGlobalContext();

  // on switch tab
  const changeTab = (tab) => {
    history.push(tab?.currentLocation);
    dispatchShopTabs({ type: 'change-current-tab', payload: { tabId: tab?.shopId } });
    dispatchCurrentUser({ type: 'shop', payload: { shop: tab?.shop } });
    dispatchCurrentUser({ type: 'seller', payload: { seller: tab?.seller } });
  };

  // on remove tab
  const removeTab = (event, tab) => {
    event.stopPropagation();

    // is not inside shop dashboard
    if (location?.pathname?.search('/shop/dashboard/') === -1) {
      dispatchShopTabs({ type: 'remove-tab', payload: { tabId: tab?.shopId } });
      return;
    }

    // is not current tab
    if (shopTabs.currentTabId !== tab?.shopId) {
      dispatchShopTabs({ type: 'remove-tab', payload: { tabId: tab?.shopId } });
      return;
    }

    // is current and only tab
    if (shopTabs?.allTabs?.length === 1) {
      // console.log('block triggered');
      // const fallbackpath = userType === 'admin' ? `/seller/dashboard/${seller?._id}/shops/list` : '/shops/list';
      // history.push(fallbackpath);
      history.push(tab?.from);
      dispatchCurrentUser({ type: 'shop', payload: { shop: {} } });
      dispatchShopTabs({ type: 'remove-tab', payload: { tabId: tab?.shopId } });
      return;
    }

    // is current but tab are available
    const fallbackTab = shopTabs?.allTabs[0]?.shopId === tab?.shopId ? shopTabs.allTabs[1] : shopTabs.allTabs[0];
    changeTab(fallbackTab);
    dispatchShopTabs({ type: 'remove-tab', payload: { tabId: tab?.shopId } });
  };

  return (
    <Stack direction="row" alignItems="center" gap={1.5} position="relative">
      {shopTabs?.allTabs?.map((tab) => (
        <StyledTab
          key={tab?.shopId}
          className={shopTabs?.currentTabId === tab?.shopId ? 'active' : undefined}
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
          <span>{tab?.shopName}</span>
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
