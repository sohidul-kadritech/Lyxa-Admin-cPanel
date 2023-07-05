import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import SearchBar from '../../../components/Common/CommonSearchbar';
import PageList from '../../../components/Common/PageList';
import PageTop from '../../../components/Common/PageTop';

const getPageList = () => [
  {
    label: 'Marketing',
    to: 'settings/marketing',
  },
  {
    label: 'Zones',
    to: '/settings/zone',
  },
  {
    label: 'Products',
    to: '/settings/products',
  },
  {
    label: 'Categories List',
    to: '/settings/categories/list',
  },

  {
    label: 'Rating',
    to: '/settings/ratings',
  },
  {
    label: 'Support Reasons',
    to: '/settings/support-reasons',
  },
  {
    label: 'Cancel Order Reasons',
    to: '/settings/cancel-reason',
  },
  {
    label: 'Notifications',
    to: '/settings/notifications',
  },
  {
    label: 'Default Chat Message',
    to: '/admin/default-chat-message',
  },
  {
    label: 'Percentages',
    to: '/percentage-setting',
  },
  {
    label: 'App Settings',
    to: '/settings/app-settings',
  },
  {
    label: 'Admin Log',
    to: '/add-wallet/admin-log-history',
  },
  {
    label: 'Database Collection',
    to: '/admin/database/collections',
  },
  {
    label: 'Privacy',
    to: '/privacy',
  },
  {
    label: 'Terms & Conditions',
    to: '/terms-and-conditions',
  },
  {
    label: 'Request New Area',
    to: '/admin/requested-area',
  },
  {
    label: 'Transaction',
    to: '/admin/transactions',
  },
  {
    label: 'Chat',
    to: '/customer-support',
  },
  {
    label: 'Invoice Configuration',
    to: '#',
  },
];

const filterPages = (searchKey, pages) => {
  if (searchKey === '') return pages;

  return pages.filter((page) =>
    page?.label
      ?.toLowerCase()
      .includes(searchKey.toLowerCase() || page?.to?.toLowerCase().includes(searchKey.toLowerCase()))
  );
};

export default function AdminSettings() {
  const [list, setList] = useState(getPageList());
  const [queryParams, setQueryParams] = useState({ searchKey: '' });

  useEffect(() => {
    setList(filterPages(queryParams?.searchKey, getPageList()));
  }, [queryParams?.searchKey]);

  return (
    <Box pb={10}>
      <PageTop title="Settings" subtitle="Customize admin settings" />
      <Box pb={6.5}>
        <SearchBar
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          showFilters={{ search: true }}
          searchPlaceHolder="Search Page"
        />
      </Box>
      <PageList items={list} />
    </Box>
  );
}
