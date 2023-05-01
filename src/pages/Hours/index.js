/* eslint-disable no-unused-vars */
// import { Box } from "@material-ui/core";
import { Box, Button, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import ConfirmModal from '../../components/Common/ConfirmModal';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import Day from './Day';
import Holiday from './Holiday';
import { StyledBox, createMomentTimeFormat, holidayHourInit, validateSettings } from './helpers';

export default function ShopHourSettings() {
  const shop = useSelector((store) => store.Login.admin);

  const [has_unsaved_change, set_has_unsaved_change] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [normalHours, setNormalHours] = useState([]);
  const [holidayHours, setHolidayHours] = useState([]);

  const hourSettingsMutation = useMutation((data) => AXIOS.post(Api.EDIT_SHOP_OPENING_HOURS, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data.status ? 'success' : undefined);

      if (data?.status) {
        shop.normalHours = data?.data?.shop?.normalHours || shop.normalHours;
        shop.holidayHours = data?.data?.shop?.holidayHours || shop.holidayHours;
        set_has_unsaved_change(false);
      }
    },
  });

  const populateStateFromShop = () => {
    setNormalHours(
      shop?.normalHours?.map((day) => ({
        ...day,
        open: createMomentTimeFormat(day?.open),
        close: createMomentTimeFormat(day?.close),
      }))
    );

    setHolidayHours(
      shop?.holidayHours?.map((holiday) => ({
        ...holiday,
        closedStart: createMomentTimeFormat(holiday?.closedStart),
        closedEnd: createMomentTimeFormat(holiday?.closedEnd),
      }))
    );
  };

  useEffect(() => {
    populateStateFromShop();
  }, []);

  // update value
  const updateSettings = () => {
    const data = {};

    data.shopId = shop?._id;

    data.normalHours = normalHours.map((day) => ({
      ...day,
      open: day?.open?.format('hh:mm'),
      close: day?.close?.format('hh:mm'),
    }));

    data.holidayHours = holidayHours?.map((holiday) => ({
      ...holiday,
      date: moment(holiday?.date).format('MM/DD/YYYY'),
      closedStart: holiday?.closedStart?.format('hh:mm'),
      closedEnd: holiday?.closedEnd?.format('hh:mm'),
    }));

    const validation = validateSettings(data);

    if (!validation.status) {
      successMsg(validation.message);
      return;
    }

    hourSettingsMutation.mutate(data);
  };

  return (
    <Box
      sx={{
        paddingTop: '35px',
      }}
    >
      {/* normal hours */}
      <Typography variant="h4" pb={7.5}>
        Normal Hours
      </Typography>
      <StyledBox>
        <Stack gap={3}>
          {normalHours?.map((day, index) => (
            <Day
              day={day}
              onAnyChange={() => {
                set_has_unsaved_change(true);
              }}
              key={`${index}`}
            />
          ))}
        </Stack>
      </StyledBox>

      {/* holiday hours */}
      <Typography variant="h4" pb={7.5} pt={10}>
        Holiday Hours
      </Typography>
      <StyledBox>
        <Typography variant="body1" fontWeight={500}>
          Add a date and indicate if your restaurant is closed all day or a certain number of hours.
        </Typography>
        <Stack>
          {holidayHours?.map((holiday, index, { length }) => (
            <Holiday
              holiday={holiday}
              key={index}
              isEndOfList={index === length - 1}
              onDelete={() => {
                setHolidayHours((prev) => prev.filter((e, i) => i !== index));
                set_has_unsaved_change(true);
              }}
              onAnyChange={() => {
                set_has_unsaved_change(true);
              }}
            />
          ))}
        </Stack>
        <Box pt={holidayHours?.length ? 0 : 6}>
          <Button
            disableRipple
            variant="text"
            color="primary"
            onClick={() => {
              setHolidayHours((prev) => [...prev, { ...holidayHourInit }]);
            }}
          >
            {holidayHours?.length > 0 ? 'Add another date' : 'Add a date'}
          </Button>
        </Box>
      </StyledBox>
      {/* save/discard */}
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
            if (has_unsaved_change) {
              setIsConfirmModalOpen(true);
            }
          }}
          disabled={hourSettingsMutation.isLoading}
        >
          Discard
        </Button>
        <Button variant="contained" color="primary" onClick={updateSettings} disabled={hourSettingsMutation.isLoading}>
          Save Changes
        </Button>
      </Stack>
      <ConfirmModal
        message="Your unsaved changes will be lost. Discard?"
        isOpen={isConfirmModalOpen}
        blurClose
        onCancel={() => {
          setIsConfirmModalOpen(false);
        }}
        onConfirm={() => {
          populateStateFromShop();
          set_has_unsaved_change(false);
          setIsConfirmModalOpen(false);
        }}
      />
    </Box>
  );
}
