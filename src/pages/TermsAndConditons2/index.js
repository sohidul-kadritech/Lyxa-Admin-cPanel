import { ArrowDownward } from '@mui/icons-material';
import { Box, Button, Stack, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import PageTop from '../../components/Common/PageTop';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '#',
  },
  {
    label: 'Terms & Conditions',
    to: '#',
  },
];
function TermsAndConditions() {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <Box>
      <PageTop
        // title="Zone"
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
        }}
      >
        <Tab label="User App"></Tab>
        <Tab label="Shop App"></Tab>
        <Tab label="Rider App"></Tab>
        <Tab label="Admin Console"></Tab>
      </Tabs>

      <Box sx={{ marginTop: '30px' }}>
        <Editor
          //   onEditorStateChange={updateDescription}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          //   editorState={editorState}
          //   defaultEditorState={editorState}
          placeholder="Enter Terms And Conditions"
        />
      </Box>

      <Stack flexDirection="row" justifyContent="flex-end" alignContent="flex-end" sx={{ marginTop: '30px' }}>
        <Button variant="contained" startIcon={<ArrowDownward />}>
          Save Item
        </Button>
      </Stack>
    </Box>
  );
}

export default TermsAndConditions;
