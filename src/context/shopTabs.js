const createTab = (payload) => {
  console.log('creating tabs', { payload });
  return {
    shopId: payload?.shop?._id,
    shopName: payload?.shop?.shopName,
    shop: payload?.shop,
    seller: payload?.seller || {},
    currentLocation: payload?.location,
    from: payload.from,
  };
};

export const shopTabsInit = {
  currentTabId: null,
  allTabs: [],
};

export const shopTabsReducer = (state, { type, payload }) => {
  if (type === 'add-tab') {
    /*
      1. Check if shop is already in tabs to avoid duplicates.
      2. Check for case when shop is already accessed directly from admin and is inside tabs.
      But again trying to access shop from insde seller.
      3. Else add a new tab and set it active tab.
    */

    const newTab = createTab(payload);
    console.log('new tabs', { payload, newTab });
    const duplicateTab = state.allTabs.find((tab) => tab.shopId === newTab.shopId);

    if (duplicateTab && !duplicateTab?._id) {
      duplicateTab.seller = payload.seller;
      duplicateTab.from = payload.from;
      return { ...state, currentTabId: duplicateTab?.shopId };
    }

    if (duplicateTab) {
      return { ...state, currentTabId: duplicateTab?.shopId };
    }

    return {
      ...state,
      currentTabId: newTab.shopId,
      allTabs: [newTab, ...state.allTabs],
    };
  }

  // change active tab location
  if (type === 'change-current-tab-location') {
    return {
      ...state,
      allTabs: state?.allTabs?.map((tab) => {
        if (tab?.shopId === state.currentTabId) return { ...tab, currentLocation: payload.location };
        return tab;
      }),
    };
  }

  if (type === 'change-current-tab') return { ...state, currentTabId: payload.tabId };

  if (type === 'remove-tab') return { ...state, allTabs: state.allTabs.filter((tab) => tab.shopId !== payload.tabId) };

  return state;
};
