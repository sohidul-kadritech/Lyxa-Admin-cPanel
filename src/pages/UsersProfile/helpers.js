export const sortAddress = (address = []) => {
  address.sort((a, b) => {
    if (a.primary === b.primary) {
      return 0;
    }
    if (a.primary) {
      return -1;
    }
    return 1;
  });

  return address;
};
