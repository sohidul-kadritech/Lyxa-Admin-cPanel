/* eslint-disable no-use-before-define */
// third party
import { Box, Drawer, Stack, Typography, styled } from '@mui/material';

// project import
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import PageTop from '../../../../../components/Common/PageTop';
import { deepClone } from '../../../../../helpers/deepClone';
import { successMsg } from '../../../../../helpers/successMsg';
import * as Api from '../../../../../network/Api';
import AXIOS from '../../../../../network/axios';
import EditField from './EditField';
import PageLoader from './PageLoader';
import SettingsTable from './SettingsTable';
import { createDateWithType, createUpdateData, featuredSettingsInit } from './helper';

const breadcrumbItems = [
  { label: 'Settings', to: '/settings' },
  { label: 'Marketing', to: '/settings/marketing' },
  { label: 'Featured', to: '#' },
];

const StyledBox = styled(Box)(() => ({
  background: '#fff',
  padding: '24px 30px 30px',
  borderRadius: '8px',
}));

export default function FeaturedSettings() {
  const [sidebar, setSidebar] = useState(false);

  const [editField, setEditField] = useState({});

  const setLocalData = (data = []) => {
    const newData = deepClone(data);
    const init = deepClone(featuredSettingsInit);

    newData.forEach((item) => {
      init[item?.featuredType] = item;
    });

    setSettingsData((prev) => createDateWithType(Object.values(init)) || prev);
  };

  const query = useQuery([Api.GET_ADMIN_FEATURED_SETTINGS], () => AXIOS.get(Api.GET_ADMIN_FEATURED_SETTINGS), {
    onSuccess: (data) => {
      setLocalData(data?.data?.featuredSetting);
    },
  });

  const [settingsData, setSettingsData] = useState(Object.values(deepClone(featuredSettingsInit)));

  useEffect(() => {
    setLocalData(query?.data?.data?.featuredSetting);
  }, []);

  // update
  const updateMutation = useMutation(
    (data) => AXIOS.post(Api.EDIT_ADMIN_FEATURED_SETTINGS, { ...data, action: undefined }),
    {
      onSuccess: (data, args) => {
        if (args.action !== 'status') {
          successMsg(data?.message, data?.status ? 'success' : undefined);
        }

        if (args.action === 'amount' && data?.status) {
          setLocalData(data?.data?.featuredSetting);
          setSidebar(false);
          setEditField({});
        }

        if (args.action === 'full' && data?.status) {
          setLocalData(data?.data?.featuredSetting);
        }
      },
    }
  );

  const updateField = (field, actionType) => {
    const data = {};
    const sObj = createUpdateData(
      deepClone(settingsData?.find((item) => item?.featuredType === field?.featuredType)),
      field
    );

    data.action = actionType;
    data.features = [sObj];
    data.featuredType = [sObj?.featuredType];
    updateMutation.mutate(data);
  };

  // const updateFullSettings = () => {
  //   const data = {};

  //   data.features = createDataForFullUpdate(deepClone(settingsData));
  //   data.featuredType = ['food', 'grocery', 'pharmacy'];
  //   data.action = 'full';

  //   updateMutation.mutate(data);
  // };

  return (
    <>
      <Box pb={6 + 6}>
        <PageTop breadcrumbItems={breadcrumbItems} backButtonLabel="Back to Marketing" backTo="/settings/marketing" />
        {query.isLoading ? (
          <PageLoader />
        ) : (
          <Stack gap={6}>
            {settingsData?.map((item) => (
              <StyledBox key={item?._id}>
                <Typography variant="h6" fontWeight={700} pb={5} textTransform="capitalize">
                  {item?.featuredType}
                </Typography>
                <SettingsTable
                  rows={item?.featuredItems}
                  onEdit={(field) => {
                    setEditField(field);
                    setSidebar(true);
                  }}
                  onStatusChange={(field) => {
                    updateField(field, 'status');
                  }}
                  // set_has_unsaved_change={set_has_unsaved_change}
                />
              </StyledBox>
            ))}
          </Stack>
        )}
        {/* <PageLoader /> */}
      </Box>
      <Drawer open={Boolean(sidebar)} anchor="right">
        <EditField
          loading={updateMutation.isLoading}
          editField={editField}
          updateField={updateField}
          onClose={() => {
            setSidebar(false);
            setEditField({});
          }}
        />
      </Drawer>
      {/* <ConfirmModal
        message="Do you want to discard the changes?"
        isOpen={confirmModal}
        blurClose
        onCancel={() => {
          setConfirmModal(false);
        }}
        onConfirm={() => {
          setConfirmModal(false);
          setLocalData(query?.data?.data?.featuredSetting);
          set_has_unsaved_change(false);
        }}
      /> */}
    </>
  );
}

// save discard button

/* <Stack
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
              if (has_unsaved_change) {
                setConfirmModal(true);
              }
            }}
          >
            Discard
          </Button>
          <Button variant="contained" color="primary" disabled={updateMutation.isLoading} onClick={updateFullSettings}>
            Save Changes
          </Button>
        </Stack> */
