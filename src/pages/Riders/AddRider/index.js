import { Delete } from '@mui/icons-material';
import { Box, Button, Stack, debounce } from '@mui/material';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ReactComponent as DropIcon } from '../../../assets/icons/down.svg';
import ConfirmModal from '../../../components/Common/ConfirmModal';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../components/Form/StyledFormField';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import PageSkeleton from './PageSkeleton';
import {
  convertEditRiderData,
  createRiderData,
  riderInit,
  riderShiftOptions,
  riderTypeOptions,
  statusOptions,
  validateRider,
} from './helpers';

export default function AddRider({ onClose, editRider }) {
  const queryClient = useQueryClient();
  console.log(editRider);

  const [rider, setRider] = useState(editRider?._id ? convertEditRiderData(editRider) : { ...riderInit });

  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [render, setRender] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [searchKeyShop, setSearchKeyShop] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [searchKeyUser, setSearchKeyUser] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [searchKeyRider, setSearchKeyRider] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [searchedShopOptions, setSearchedShopOptions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [searchedUserOptions, setSearchedUserOptions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [searchedRiderOptions, setSearchedRiderOptions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedShopOptions, setSelectedShopOptions] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedRiderOptions, setSelectedRiderOptions] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedUserOptions, setSelectedUserOptions] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);

  const zonesQuery = useQuery([Api.GET_ALL_ZONE], () => AXIOS.get(Api.GET_ALL_ZONE));

  // input handler
  const commonChangeHandler = (e) => {
    setRider((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onDrop = (acceptedFiles, feild) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        // eslint-disable-next-line prettier/prettier
      }),
    );

    if (newFiles?.length) {
      setRider((prev) => ({ ...prev, [feild]: newFiles }));
    }
  };

  // add rider
  const addRiderMutation = useMutation(
    (data) => AXIOS.post(editRider?._id ? Api.EDIT_DELIVERY_MAN : Api.ADD_DELIVERY_MAN, data),
    {
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
      // eslint-disable-next-line prettier/prettier
    },
  );

  //  upload data
  const onSubmit = async () => {
    const isValid = validateRider(rider, !!editRider?._id);

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

  // const deleteRiderMutation = useMutation(() => AXIOS.post(Api.DELETE_DELIVERY_MAN, { id: editRider?._id }), {
  //   onSuccess: (data) => {
  //     successMsg(data?.message, data?.status ? 'success' : undefined);
  //     if (data?.status) {
  //       onClose();
  //       queryClient.invalidateQueries([Api.ALL_DELIVERY_MAN]);
  //     }
  //   },
  // });

  const shopsQuery = useMutation(
    () =>
      AXIOS.get(Api.ALL_SHOP, {
        params: {
          type: 'all',
          shopStatus: 'all',
          page: 1,
          pageSize: 15,
          searchKey: searchKeyShop,
        },
      }),
    {
      onSuccess: (data) => {
        setSearchedShopOptions((prev) => data?.data?.shops || prev);
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const getShops = useMemo(
    () =>
      debounce((value) => {
        setSearchKeyShop(value);
        shopsQuery.mutate();
      }, 300),
    // eslint-disable-next-line prettier/prettier
    [],
  );

  return (
    <>
      <SidebarContainer title={editRider?._id ? 'Edit Rider' : 'Add Rider'} onClose={onClose}>
        {zonesQuery?.isLoading && <PageSkeleton />}
        {!zonesQuery?.isLoading && (
          <Box>
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
            />
            {/* Re-enter Password */}
            {!editRider?._id && (
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
            )}
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
            {/* name */}
            {rider.deliveryBoyType === 'shopRider' && (
              <Box position="relative">
                <StyledFormField
                  label="Select Shop"
                  intputType="autocomplete"
                  inputProps={{
                    multiple: false,
                    maxHeight: '110px',
                    options: searchedShopOptions,
                    value: selectedShopOptions,
                    placeholder: 'Choose',
                    noOptionsText: shopsQuery?.isLoading ? 'Loading...' : 'No shops',
                    getOptionLabel: (option) => option?.shopName,
                    isOptionEqualToValue: (option, value) => option?._id === value?._id,
                    onChange: (e, v) => {
                      console.log('value: ', v);
                      setSelectedShopOptions(v);
                      setSelectedRiderOptions(null);
                      setSelectedUserOptions(null);
                    },
                    onInputChange: (e) => {
                      getShops(e?.target?.value);
                    },
                    sx: {
                      '& .MuiFormControl-root': {
                        minWidth: '200px',
                      },
                    },
                  }}
                />
              </Box>
            )}
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
            {/* status */}
            <StyledFormField
              label="Status"
              intputType="select"
              inputProps={{
                name: 'status',
                value: rider.status,
                items: statusOptions,
                onChange: commonChangeHandler,
              }}
            />
            <Stack pt={10} pb={6} gap={5}>
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
              <Button
                variant="text"
                disableRipple
                color="error"
                startIcon={<Delete />}
                fullWidth
                onClick={() => {
                  setIsConfirm(true);
                }}
              >
                Delete Rider
              </Button>
            </Stack>
          </Box>
        )}
      </SidebarContainer>
      <ConfirmModal
        message="Do you want to delete this rider ?"
        isOpen={isConfirm}
        blurClose
        onCancel={() => {
          setIsConfirm(false);
        }}
        onConfirm={() => {
          setIsConfirm(false);
        }}
      />
    </>
  );
}
