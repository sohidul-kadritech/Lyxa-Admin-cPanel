/* eslint-disable max-len */
export const getProfilePhotoAndAltName = (currentUser, userType) => {
  let profilePhoto;
  let altName = '';
  let name;

  if (userType === 'admin') {
    // not added yet
    profilePhoto = currentUser?.admin?.profile_photo;
    name = currentUser?.admin?.name;
  }

  if (userType === 'shop') {
    profilePhoto = currentUser?.shop?.shopLogo;
    name = currentUser?.shop?.shopName;
  }

  if (userType === 'seller') {
    profilePhoto = currentUser?.seller?.profile_photo;
    name = currentUser?.seller?.company_name;
  }

  name?.split(' ')?.forEach((s, i) => {
    if (i < 2) {
      altName += s[0];
    }
  });

  return { profilePhoto, altName, name };
};

export const shouldFetchApi = (userType) => {
  const ignoreAdmin = ['shop', 'sales', 'accountManager', 'seller'];

  return ignoreAdmin.indexOf(userType) === -1;
};
