// thrid party
import { Box, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import CloseButton from '../../components/Common/CloseButton';
import TabPanel from '../../components/TabPanel';

const tabPanelSx = {
  padding: '24px 16px',
};

// project import
export default function Deals({ onClose }) {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Paper>
      <Stack direction="row" justifyContent="space-between" pt={9} pb={2}>
        <Typography variant="h2">{currentTab === 0 ? 'Deals' : 'Add'}</Typography>
        <CloseButton
          onClick={() => {
            onClose();
          }}
        />
      </Stack>
      <Box direction="row" justifyContent="space-between" alignItems="center" pr={2}>
        <Tabs
          value={currentTab}
          onChange={(event, value) => {
            setCurrentTab(value);
          }}
        >
          <Tab label="Deals" />
          <Tab label="Add New" />
        </Tabs>
      </Box>
      <TabPanel index={0} value={currentTab} containerSx={tabPanelSx}>
        <Box>Double Deals</Box>
      </TabPanel>
      <TabPanel index={1} value={currentTab} containerSx={tabPanelSx}>
        <Box>Percentage Deals</Box>
      </TabPanel>
      <TabPanel index={2} value={currentTab} containerSx={tabPanelSx}>
        <Box>Free Deals</Box>
      </TabPanel>
      <TabPanel index={3} value={currentTab} containerSx={tabPanelSx}>
        <Box>Others</Box>
      </TabPanel>
      <TabPanel index={4} value={currentTab} containerSx={tabPanelSx}>
        <Box>Add New</Box>
      </TabPanel>
    </Paper>
  );
}
