import { ArrowDownward } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
// import { convertFromHTML } from 'draft-js-import-html';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { useMutation, useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '/settings',
  },
  {
    label: 'Privacy Settings',
    to: '#',
  },
];

// const indexToTypeTracker = {
//   0: 'user',
//   1: 'shop',
//   2: 'delivery',
// };
function PrivacySettings() {
  // eslint-disable-next-line no-unused-vars
  const [currentTab, setCurrentTab] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [type, setType] = useState('user');

  const [editorState, setEditorState] = useState(() => {
    EditorState.createEmpty();
  });

  // eslint-disable-next-line no-unused-vars
  const [condition, setCondition] = useState('');
  // eslint-disable-next-line no-unused-vars
  const { data: conditions, isLoading } = useQuery(
    [API_URL.GET_CONDITION, { type }],
    () =>
      AXIOS.get(API_URL.GET_CONDITION, {
        params: {
          type,
        },
        // eslint-disable-next-line prettier/prettier
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          setLoading(false);
          const value = data.data;
          console.log('value: ', value);
          if (value != null) {
            const contentBlock = htmlToDraft(value || '');
            // const contentBlock2 = convertToRaw(value || '');
            console.log('contentBlock', contentBlock);
            // console.log('contentBlock2', contentBlock2);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              console.log('content state: ', contentState);
              const outputEditorState = EditorState.createWithContent(contentState);
              console.log('outputEditor state: ', outputEditorState);
              //   setEditorState(outputEditorState);
            }
          } else {
            // setEditorState(EditorState.createEmpty());
          }
          console.log(data);
        } else {
          setLoading(false);
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const updateDescription = async (state) => {
    setEditorState(state);
    setCondition(draftToHtml(convertToRaw(state.getCurrentContent())));
  };

  const termsUpdateQuery = useMutation((data) => AXIOS.post(API_URL.UPDATE_CONDITION, data), {
    onSuccess: (data, argx) => {
      console.log('argument: ', argx);
      if (data.status) {
        successMsg(`Terms & Conditions are updated !(${type})`, 'success');
      }
    },
  });

  // eslint-disable-next-line no-unused-vars
  const handleSubmit = () => {
    termsUpdateQuery.mutate({ type, description: condition });
  };

  return (
    <Box>
      <PageTop
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        backTo="/settings"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      {/* <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
          setType(indexToTypeTracker[newValue]);
          setLoading(true);
        }}
      >
        <Tab label="User App"></Tab>
        <Tab label="Shop App"></Tab>
        <Tab label="Rider App"></Tab>
      </Tabs> */}
      {/* {loading ? (
        <TermsAndConditionsSkeleton />
      ) : (
        <Box sx={{ marginTop: '30px' }}>
          <Editor
            onEditorStateChange={updateDescription}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            editorState={editorState}
            defaultEditorState={editorState}
            placeholder="Enter Terms And Conditions"
            onChange={(e) => console.log(e)}
            editorStyle={{
              minHeight: '400px',
              maxHeight: '400px',
            }}
          />
        </Box>
      )} */}

      <Box
      //   sx={{ marginTop: '30px' }}
      >
        <Editor
          onEditorStateChange={updateDescription}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          editorState={editorState}
          defaultEditorState={editorState}
          placeholder="Enter Terms And Conditions"
          onChange={(e) => console.log(e)}
          editorStyle={{
            minHeight: '400px',
            maxHeight: '400px',
          }}
        />
      </Box>

      <Stack flexDirection="row" justifyContent="flex-end" alignContent="flex-end" sx={{ marginTop: '30px' }}>
        <Button
          variant="contained"
          //   onClick={handleSubmit}
          disabled={termsUpdateQuery?.isLoading}
          startIcon={<ArrowDownward />}
        >
          Save Item
        </Button>
      </Stack>
    </Box>
  );
}

export default PrivacySettings;
