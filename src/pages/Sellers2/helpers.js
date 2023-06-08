import { getImageUrl } from '../../helpers/images';
import { successMsg } from '../../helpers/successMsg';

export const getThreedotMenuOptions = [
  {
    label: 'View',
    value: 'view',
  },
  {
    label: 'Edit Seller',
    value: 'edit_seller',
  },
  {
    label: 'Access as Seller',
    value: 'access_as_seller',
  },
  {
    label: 'Update Lyxa Charge',
    value: 'update_lyxa_charge',
  },
  {
    label: 'Go to Financials',
    value: 'go_to_financials',
  },
];

export const sellerShopTabType = {
  0: 'Shop List',
  1: 'Documents',
};

export const validateSellersData = (data, isEdit = false) => {
  console.log('generated Data', data);
  const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  if (!data?.name) {
    successMsg('Provide seller name');
    return false;
  }
  if (!data?.email) {
    successMsg('Provide seller email');
    return false;
  }
  if (data?.email && !emailRegex.test(data?.email)) {
    successMsg('Invalid email');
    return false;
  }
  if (!data?.phone_number) {
    successMsg('Provide seller phone number');
    return false;
  }
  if (!data?.password && !isEdit) {
    successMsg('Provide seller password');
    return false;
  }

  if (!data?.company_name) {
    successMsg('Provide seller company name');
    return false;
  }

  if (!data?.addressSeller?.address) {
    successMsg('Provide seller address');
    return false;
  }
  if (!data?.addressSeller?.pin) {
    successMsg('Provide seller Zip code');
    return false;
  }
  if (!data?.sellerType) {
    successMsg('Select seller type');
    return false;
  }
  if (!data?.sellerStatus) {
    successMsg('Select seller status');
    return false;
  }
  if (!data?.profile_photo?.length) {
    successMsg('Provide seller profile photo');
    return false;
  }
  if (!data?.certificate_of_incorporation?.length) {
    successMsg('Provide seller certification of incorporation');
    return false;
  }
  if (!data?.national_id?.length) {
    successMsg('Provide seller NID');
    return false;
  }
  if (!data?.sellerContractPaper?.length) {
    successMsg('Provide seller contract paper');
    return false;
  }

  return true;
};

export const createSellerData = async (sellerData, isEdit = false) => {
  // const shopLogo = await getImageUrl(shopData.shopLogo[0]);
  // const shopBanner = await getImageUrl(shopData.shopBanner[0]);

  const profile_photo = await getImageUrl(sellerData?.profile_photo[0]);
  const certificate_of_incorporation = await getImageUrl(sellerData?.certificate_of_incorporation[0]);
  const national_id = await getImageUrl(sellerData?.national_id[0]);
  const sellerContractPaper = await getImageUrl(sellerData?.sellerContractPaper[0]);

  if (!profile_photo) {
    return {
      status: false,
      msg: 'Error uploading profile photo image!',
    };
  }

  if (!certificate_of_incorporation) {
    return {
      status: false,
      msg: 'Error uploading certification of incorporation image',
    };
  }

  if (!national_id) {
    return {
      status: false,
      msg: 'Error uploading national id image',
    };
  }
  if (!sellerContractPaper) {
    return {
      status: false,
      msg: 'Error uploading contract paper image',
    };
  }

  if (isEdit) {
    return {
      ...sellerData,
      id: sellerData._id,
      password: sellerData.password ? sellerData.password : '',
      profile_photo,
      certificate_of_incorporation,
      national_id,
      sellerContractPaper,
    };
  }

  return {
    ...sellerData,
    profile_photo,
    certificate_of_incorporation,
    national_id,
    sellerContractPaper,
  };
};

export const sellerTypeOption = [
  {
    label: 'Food',
    value: 'food',
  },
  {
    label: 'Grocery',
    value: 'grocery',
  },
  {
    label: 'Pharmacy',
    value: 'pharmacy',
  },
];

export const previewGenerator = (file) => [{ preview: file }];
