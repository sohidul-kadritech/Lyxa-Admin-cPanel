const createTab = (payload) => ({
  shopId: payload.shop?._id,
  shopName: payload.shop?.shopName,
  shop: payload.shop,
  currentLocation: payload.location,
});

export const tabsInit = {
  currentTabId: null,
  allTabs: [],
};

export const tabsReducer = (state, { type, payload }) => {
  if (type === 'add-tab') {
    const newTab = createTab(payload);

    if (state.allTabs.find((tab) => tab.shopId === newTab.shopId)) return { ...state, currentTabId: newTab?.shopId };

    return {
      ...state,
      currentTabId: newTab.shopId,
      allTabs: [newTab, ...state.allTabs],
    };
  }

  if (type === 'change-current-tab-location') {
    return {
      ...state,
      allTabs: state.allTabs.map((tab) => {
        if (tab?.shopId === state.currentTabId) return { ...tab, currentLocation: payload.location };
        return tab;
      }),
    };
  }

  if (type === 'change-current-tab') return { ...state, currentTabId: payload.tabId };

  if (type === 'remove-tab') return { ...state, allTabs: state.allTabs.filter((tab) => tab.shopId !== payload.tabId) };

  return state;
};
