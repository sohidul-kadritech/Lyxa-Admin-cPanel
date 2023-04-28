/* eslint-disable no-unused-vars */
// import { Box } from "@material-ui/core";
import { Box, Button, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { DaySettings, StyledBox } from './helpers';
// import {}

export default function ShopHourSettings() {
  const shop = useSelector((store) => store.Login.admin);

  const [normalHours, setNormalHours] = useState([]);
  const [holidayHours, setHolidayHours] = useState([]);

  const hourSettingsMutation = useMutation((data) => AXIOS.post(Api.EDIT_SHOP_OPENING_HOURS, data), {
    onSuccess: (data) => {},
  });

  useEffect(() => {
    setNormalHours(
      shop?.normalHours?.map((day) => ({
        ...day,
        open: moment().startOf('day').add(day?.open?.slice(0, 2), 'h').add(day?.open?.slice(3), 'm'),
        close: moment().startOf('day').add(day?.close?.slice(0, 2), 'h').add(day?.close?.slice(3), 'm'),
      }))
    );
    setHolidayHours((day) => ({
      ...day,
    }));
  }, []);

  return (
    <Box
      sx={{
        paddingTop: '35px',
      }}
    >
      <Typography variant="h4" pb={7.5}>
        Normal Hours
      </Typography>
      <StyledBox>
        <Stack gap={3}>
          {normalHours?.map((day, index) => (
            <DaySettings day={day} key={`${index}`} />
          ))}
        </Stack>
      </StyledBox>
      <Typography variant="h4" pb={7.5} pt={10}>
        Holiday Hours{' '}
      </Typography>
      <StyledBox>
        <Typography variant="body1" fontWeight={500} pb={6}>
          Add a date and indicate if your restaurant is closed all day or a certain number of hours.
        </Typography>
        <Button
          disableRipple
          variant="text"
          color="primary"
          sx={{
            fontWeight: '600',
          }}
        >
          Add a date
        </Button>
      </StyledBox>
      <Stack
        direction="row"
        justifyContent="flex-end"
        gap={4}
        sx={{
          mt: 9,
          pb: 12,
        }}
      >
        <Button variant="outlined" color="primary" onClick={() => {}}>
          Discard
        </Button>
        <Button variant="contained" color="primary" onClick={() => {}}>
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
}
