/* eslint-disable max-len */
import { getImageUrl } from '../../../helpers/images';

export const riderShiftOptions = [
  {
    value: 'night',
    label: 'Night',
  },
  {
    value: 'day',
    label: 'Day',
  },
];

export const riderTypeOptions = [
  {
    value: 'shopRider',
    label: 'Self Delivery',
  },
  {
    value: 'dropRider',
    label: 'Lyxa Delivery',
  },
];

export const getRiderInit = (riderFor, riderShop) => ({
  name: '',
  email: '',
  password: '',
  confirm_password: '',
  number: '',
  deliveryBoyAddress: '',
  image: [],
  vehicleNumber: '',
  nationalIdDocument: [],
  vehicleRegistrationDocument: [],
  contractImage: [],
  vehicleType: '',
  shift: '',
  zoneId: '',
  deliveryBoyType: riderFor === 'shop' ? 'shopRider' : '',
  shopId: riderFor === 'shop' ? riderShop : null,
  status: 'active',
});

export const validateRider = (rider, isEditRider) => {
  const status = {
    status: false,
    msg: null,
  };
  const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  if (!rider?.name?.trim()) {
    status.msg = 'Rider name cannot be empty!';
    return status;
  }

  if (!rider?.email?.trim()) {
    status.msg = 'Rider email cannot be empty!';
    return status;
  }

  if (!emailRegex.test(rider?.email)) {
    status.msg = 'Rider email is invalid!';
    return status;
  }

  if (!rider?.password && !isEditRider) {
    status.msg = 'Rider password cannot be empty!';
    return status;
  }

  if (rider?.password?.length && rider?.password?.length < 6) {
    status.msg = 'Password must be at least 6 characters';
    return status;
  }

  if (!isEditRider && rider?.confirm_password !== rider?.password) {
    status.msg = 'Confirm password does not match with password';
    return status;
  }

  if (!rider?.number) {
    status.msg = 'Rider number cannot be empty!';
    return status;
  }

  if (!rider?.deliveryBoyAddress?.trim()) {
    status.msg = 'Rider address cannot be empty!';
    return status;
  }

  if (!rider?.image?.length) {
    status.msg = 'Rider image cannot be empty!';
    return status;
  }

  if (!rider?.vehicleNumber?.trim()) {
    status.msg = 'Rider Vehicle Number cannot be empty!';
    return status;
  }

  if (!rider?.nationalIdDocument?.length) {
    status.msg = 'Rider National Id cannot be empty!';
    return status;
  }

  if (!rider?.vehicleRegistrationDocument?.length) {
    status.msg = 'Rider Vehicle Registration cannot be empty!';
    return status;
  }

  if (!rider?.contractImage?.length) {
    status.msg = 'Rider Contract Image cannot be empty!';
    return status;
  }

  if (!rider?.vehicleType?.trim()) {
    status.msg = 'Rider Vehicle Type cannot be empty!';
    return status;
  }

  if (!rider?.shift) {
    status.msg = 'Rider shift cannot be empty!';
    return status;
  }

  if (!rider?.zoneId && rider?.deliveryBoyType !== 'shopRider') {
    status.msg = 'Rider zoneId cannot be empty!';
    return status;
  }

  if (!rider?.deliveryBoyType) {
    status.msg = 'Rider type cannot be empty!';
    return status;
  }

  if (rider?.deliveryBoyType === 'specific' && !rider?.shopId) {
    status.msg = 'Rider shopId cannot be empty!';
    return status;
  }

  if (!rider?.status && rider?._id) {
    status.msg = 'Rider status cannot be empty!';
    return status;
  }

  return { status: true };
};

export const createRiderData = async (rider) => {
  const error = { error: true, msg: '' };

  const image = await getImageUrl(rider?.image[0]);
  const nationalIdDocument = await getImageUrl(rider?.nationalIdDocument[0]);
  const vehicleRegistrationDocument = await getImageUrl(rider?.vehicleRegistrationDocument[0]);
  const contractImage = await getImageUrl(rider?.contractImage[0]);

  if (!image) error.msg = 'Error while uploading Photo';
  if (!nationalIdDocument) error.msg = 'Error while uploading National ID photo';
  if (!vehicleRegistrationDocument) error.msg = 'Error while uploading Vehicle document';
  if (!contractImage) error.msg = 'Error while uploading Contract Image';

  if (error.msg) return error;

  return {
    name: rider?.name?.trim(),
    email: rider?.email?.trim(),
    password: rider?.password || undefined,
    number: rider?.number?.trim(),
    deliveryBoyAddress: rider?.deliveryBoyAddress?.trim(),
    image,
    vehicleNumber: rider?.vehicleNumber?.trim(),
    nationalIdDocument,
    vehicleRegistrationDocument,
    contractImage,
    vehicleType: rider?.vehicleType?.trim(),
    shift: rider?.shift,
    zoneId: rider?.deliveryBoyType === 'shopRider' ? undefined : rider?.zoneId,
    deliveryBoyType: rider?.deliveryBoyType,
    shopId: rider?.deliveryBoyType === 'shopRider' ? rider?.shopId?._id : undefined,
    status: rider?.status,
    id: rider?._id,
  };
};

export const convertEditRiderData = (rider, riderFor, riderShop) => ({
  ...rider,
  image: [{ preview: rider?.image }],
  contractImage: [{ preview: rider?.contractImage }],
  nationalIdDocument: [{ preview: rider?.nationalIdDocument }],
  vehicleRegistrationDocument: [{ preview: rider?.vehicleRegistrationDocument }],
  deliveryBoyAddress: rider?.address,
  zoneId: rider?.zone,
  shopId: riderFor === 'shop' ? riderShop : null,
  password: '',
  id: rider?._id,
});

export const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Deactive', value: 'deactive' },
];
