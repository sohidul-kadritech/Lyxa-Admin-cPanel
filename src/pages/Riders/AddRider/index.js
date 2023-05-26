import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ReactComponent as DropIcon } from '../../../assets/icons/down.svg';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../components/Form/StyledFormField';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { createRiderData, riderInit, riderShiftOptions, riderTypeOptions, validateRider } from './helpers';

export default function AddRider({ onClose }) {
  const [rider, setRider] = useState({ ...riderInit });
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const zonesQuery = useQuery([Api.GET_ALL_ZONE], () => AXIOS.get(Api.GET_ALL_ZONE));

  // input handler
  const commonChangeHandler = (e) => {
    setRider((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onDrop = (acceptedFiles, feild) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    if (newFiles?.length) {
      setRider((prev) => ({ ...prev, [feild]: newFiles }));
    }
  };

  // add rider
  const addRiderMutation = useMutation((data) => AXIOS.post(Api.ADD_DELIVERY_MAN, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);

      if (data?.status) {
        queryClient.invalidateQueries([Api.ALL_DELIVERY_MAN]);
        onClose();
      }

      setLoading(false);
    },

    onError: (error) => {
      console.log(error);
      successMsg(error?.message);
      setLoading(false);
    },
  });

  //  upload data
  const onSubmit = async () => {
    const isValid = validateRider(rider);

    if (!isValid?.status) {
      successMsg(isValid.msg);
      return;
    }

    setLoading(true);
    const riderData = await createRiderData(rider);

    if (riderData.error) {
      successMsg(riderData.msg);
      setLoading(false);
      return;
    }

    console.log(riderData);
    addRiderMutation.mutate(riderData);
  };

  return (
    <SidebarContainer title="Add Rider" onClose={onClose}>
      {/* name */}
      <StyledFormField
        label="Name"
        intputType="text"
        inputProps={{
          type: 'text',
          name: 'name',
          value: rider.name,
          onChange: commonChangeHandler,
        }}
      />
      {/* Phone Number */}
      <StyledFormField
        label="Phone Number"
        intputType="text"
        inputProps={{
          type: 'number',
          name: 'number',
          value: rider.number,
          onChange: commonChangeHandler,
        }}
      />
      {/* E-mail address */}
      <StyledFormField
        label="E-mail address"
        intputType="text"
        inputProps={{
          type: 'email',
          name: 'email',
          value: rider.email,
          onChange: commonChangeHandler,
        }}
      />
      {/* Password */}
      <StyledFormField
        label="Password"
        intputType="text"
        inputProps={{
          type: 'password',
          name: 'password',
          value: rider.password,
          onChange: commonChangeHandler,
        }}
      />{' '}
      {/* Re-enter Password */}
      <StyledFormField
        label="Re-enter Password"
        intputType="text"
        inputProps={{
          type: 'password',
          name: 'confirm_password',
          value: rider.confirm_password,
          onChange: commonChangeHandler,
        }}
      />
      {/* Address */}
      <StyledFormField
        label="Address"
        intputType="text"
        inputProps={{
          type: 'text',
          name: 'deliveryBoyAddress',
          value: rider.deliveryBoyAddress,
          onChange: commonChangeHandler,
        }}
      />
      {/* Vehicle Type */}
      <StyledFormField
        label="Vehicle Type"
        intputType="text"
        inputProps={{
          type: 'text',
          name: 'vehicleType',
          value: rider.vehicleType,
          onChange: commonChangeHandler,
        }}
      />
      {/* Vehicle Number */}
      <StyledFormField
        label="Vehicle Number"
        intputType="text"
        inputProps={{
          type: 'number',
          name: 'vehicleNumber',
          value: rider.vehicleNumber,
          onChange: commonChangeHandler,
        }}
      />
      {/* Shift */}
      <StyledFormField
        label="Shift"
        intputType="select"
        inputProps={{
          name: 'shift',
          value: rider.shift,
          items: riderShiftOptions,
          onChange: commonChangeHandler,
        }}
      />
      {/* Area Covered */}
      <StyledFormField
        label="Area Covered"
        intputType="select"
        inputProps={{
          name: 'zoneId',
          value: rider.zoneId,
          items: zonesQuery?.data?.data?.zones || [],
          getLabel: (option) => option?.zoneName,
          getValue: (option) => option?._id,
          getDisplayValue: (currentValue) =>
            zonesQuery?.data?.data?.zones?.find((zone) => zone?._id === currentValue)?.zoneName,
          onChange: commonChangeHandler,
        }}
      />
      {/* Rider Type */}
      <StyledFormField
        label="Rider Type"
        intputType="select"
        inputProps={{
          name: 'deliveryBoyType',
          value: rider.deliveryBoyType,
          items: riderTypeOptions,
          onChange: commonChangeHandler,
        }}
      />
      {/* Photo */}
      <StyledFormField
        label="Photo"
        intputType="file"
        inputProps={{
          onDrop: (acptFiles) => onDrop(acptFiles, 'image'),
          accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
          maxSize: 1000 * 1000,
          text: 'Drag and drop or chose photo',
          files: rider.image || [],
          helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
        }}
      />
      {/* National ID */}
      <StyledFormField
        label="National ID"
        intputType="file"
        inputProps={{
          onDrop: (acptFiles) => onDrop(acptFiles, 'nationalIdDocument'),
          accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
          maxSize: 1000 * 1000,
          text: 'Drag and drop or chose photo',
          files: rider.nationalIdDocument || [],
          helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
        }}
      />
      {/* Vehicle document */}
      <StyledFormField
        label="Vehicle document"
        intputType="file"
        inputProps={{
          onDrop: (acptFiles) => onDrop(acptFiles, 'vehicleRegistrationDocument'),
          accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
          maxSize: 1000 * 1000,
          text: 'Drag and drop or chose photo',
          files: rider.vehicleRegistrationDocument || [],
          helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
        }}
      />
      {/* Contract Paper */}
      <StyledFormField
        label="Contract Paper"
        intputType="file"
        inputProps={{
          onDrop: (acptFiles) => onDrop(acptFiles, 'contractImage'),
          accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
          maxSize: 1000 * 1000,
          text: 'Drag and drop or chose photo',
          files: rider.contractImage || [],
          helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
        }}
      />
      {/* Shift */}
      {/* <StyledFormField
        label="Shift"
        intputType="select"
        inputProps={{
          name: 'shift',
          value: rider.shift,
          items: riderShiftOptions,
          onChange: commonChangeHandler,
        }}
      /> */}
      <Box pt={10} pb={6}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DropIcon />}
          disabled={loading}
          fullWidth
          onClick={onSubmit}
        >
          Save Item
        </Button>
      </Box>
    </SidebarContainer>
  );
}
