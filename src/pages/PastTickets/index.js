import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import TabPanel from '../../components/Common/TabPanel';
import TablePagination from '../../components/Common/TablePagination';
import ChatDetails from '../../components/Shared/ChatDetail';
import SlideInContainer from '../OngoingTickets/SlideInContainer';
import { order } from '../OngoingTickets/mock';
import TicketTable from './TicketTable';
import { pastTickets } from './mock';

const tabValueToShowingForMap = { 0: 'pastOrder', 1: 'pastAccount' };

export default function PastTickets() {
  const [currentTab, setCurrentTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chat = { order };

  return (
    <Box
      sx={{
        height: 'calc(100vh - 83px)',
        maxWidth: 'calc(100vw - 100px)',
      }}
    >
      <SlideInContainer type="static" open={sidebarOpen}>
        <Box
          pt={9}
          pb={9}
          sx={{
            height: '100%',
            overflow: 'scroll',
          }}
        >
          <Typography variant="h4" pb={10}>
            Dashboard
          </Typography>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
              // setSidebarOpen(false);
            }}
            sx={{
              '& .MuiTab-root': {
                padding: '8px 12px',
                textTransform: 'none',
              },
            }}
          >
            <Tab label="Orders" />
            <Tab label="Account" />
          </Tabs>

          <Box pt={9}>
            <TabPanel index={0} value={currentTab} noPadding>
              <TicketTable
                ticketType="order"
                rows={pastTickets(10)}
                onSelect={() => {
                  setSidebarOpen(true);
                }}
              />
              <TablePagination
                currentPage={1}
                lisener={() => {
                  // setQueryParams((prev) => ({ ...prev, page }));
                }}
                totalPage={5}
              />
            </TabPanel>
            <TabPanel index={1} value={currentTab} noPadding>
              <TicketTable
                rows={pastTickets(10)}
                ticketType="account"
                onSelect={() => {
                  setSidebarOpen(true);
                }}
              />
              <TablePagination
                currentPage={1}
                lisener={() => {
                  // setQueryParams((prev) => ({ ...prev, page }));
                }}
                totalPage={5}
              />
            </TabPanel>
          </Box>
        </Box>
      </SlideInContainer>
      <SlideInContainer type="dynamic" open={sidebarOpen}>
        <ChatDetails
          showingFor={tabValueToShowingForMap[currentTab]}
          chat={chat}
          onClose={() => setSidebarOpen(false)}
        />
      </SlideInContainer>
    </Box>
  );
}
