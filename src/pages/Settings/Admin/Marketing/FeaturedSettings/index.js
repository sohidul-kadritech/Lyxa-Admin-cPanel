// third party
import { Box, Button, Drawer, Stack, Typography, styled } from '@mui/material';

// project import
import { useState } from 'react';
import PageTop from '../../../../../components/Common/PageTop';
import EditField from './Edit';
import SettingsTable from './Table';
import { settingsData } from './mock';

const breadcrumbItems = [
  { label: 'Settings', to: '/admin/settings2' },
  { label: 'Marketing', to: '/admin/settings2/marketing' },
  { label: 'Featured', to: '#' },
];

const StyledBox = styled(Box)(() => ({
  background: '#fff',
  padding: '24px 30px 30px',
  borderRadius: '8px',
}));

export default function FeaturedSettings() {
  const [sidebar, setSidebar] = useState(false);
  const [editItem, setEditItem] = useState({});

  const onEdit = (item) => {
    setEditItem(item);
    setSidebar(true);
  };

  return (
    <>
      <Box>
        <PageTop
          breadcrumbItems={breadcrumbItems}
          backButtonLabel="Back to Marketing"
          backTo="/admin/settings2/marketing"
        />
        <Stack gap={6}>
          <StyledBox>
            <Typography variant="h6" fontWeight={700} pb={5}>
              Food
            </Typography>
            <SettingsTable rows={settingsData} onEdit={onEdit} />
          </StyledBox>
          <StyledBox>
            <Typography variant="h6" fontWeight={700} pb={5}>
              Grocery
            </Typography>
            <SettingsTable rows={settingsData} onEdit={onEdit} />
          </StyledBox>
          <StyledBox>
            <Typography variant="h6" fontWeight={700} pb={5}>
              Pharmacy
            </Typography>
            <SettingsTable rows={settingsData} onEdit={onEdit} />
          </StyledBox>
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-end"
          gap={4}
          sx={{
            mt: 9,
            pb: 12,
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              // discardChanges();
            }}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            color="primary"
            // disabled={updateSettingsMutation.isLoading}
            onClick={() => {
              // updateSettings();
            }}
          >
            Save Changes
          </Button>
        </Stack>
      </Box>
      <Drawer open={Boolean(sidebar)} anchor="right">
        <EditField
          editItem={editItem}
          onClose={() => {
            setSidebar(false);
          }}
        />
      </Drawer>
    </>
  );
}
