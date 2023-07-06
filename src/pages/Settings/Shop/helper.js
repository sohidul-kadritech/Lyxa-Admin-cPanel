export const PriceRange = [
  { label: '$', value: 1 },
  { label: '$$', value: 2 },
  { label: '$$$', value: 3 },
  { label: '$$$$', value: 4 },
];

export const PaymentInformationList = [
  { label: 'Cash', value: 'cash' },
  { label: 'POS', value: 'pos' },
  { label: 'Card', value: 'card' },
  { label: 'Wallet', value: 'wallet' },
];

export const DeliverySettings = [
  { label: 'Store', value: true },
  { label: 'Lyxa', value: false },
];

export const maxDiscountOptions = (options) => {
  console.log('options:', options);
  if (options?.length > 0) {
    const generatedOptions = options.map((value) => ({ label: value.toString(), value: value.toString() }));
    console.log('options:', generatedOptions);
    return generatedOptions;
  }
  return [{ label: 'No options', value: '' }];
};

export const DietarySettings = [
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Gluten-free', value: 'gluten-free' },
  { label: 'Low-cal', value: 'low-cal' },
];

export function convertTime(timeString) {
  const hours = timeString.slice(0, 2);
  const minutes = timeString.slice(2, 4);
  return `${hours}:${minutes}`;
}

export function createShopSettingsData(
  shop,
  newMaxDiscount,
  minimumOrder,
  newPayMentInformation,
  newDietary,
  newPriceRange,
  newOrderCapacity,
  newSpecialInstructions,
  newDeliveryFee,
  OwnDeliveryBoy,
  // eslint-disable-next-line prettier/prettier
  adminType,
  newTags,
  shopAcceptedCurrency,
  shopExchangeRate,
  // eslint-disable-next-line prettier/prettier
  newCusines,
) {
  const tags = [];
  const cuisineType = [];
  const tagsId = [];

  console.log('rate of shop: ', shopExchangeRate, shopAcceptedCurrency);

  newTags?.forEach((tag) => {
    tags.push(tag?.name);
    tagsId.push(tag?._id);
  });

  newCusines?.forEach((cuisine) => {
    cuisineType.push(cuisine?._id);
  });

  if (adminType === 'admin')
    return {
      id: shop?._id,
      shopName: shop?.shopName,
      password: '',
      isCuisine: shop?.isCuisine,
      maxDiscount: newMaxDiscount,
      minOrderAmount: minimumOrder,
      email: shop?.email,
      phone_number: shop?.phone,
      shopType: shop?.shopType,
      shopLogo: shop?.shopLogo,
      shopBanner: shop?.shopBanner,
      shopStatus: shop?.shopStatus,
      // shopAcceptedCurrency,
      shopExchangeRate,
      shopDescription: 'desrcriptions',
      tags,
      tagsId,
      cuisineType,
      orderCapacity: newOrderCapacity,
      paymentOption: newPayMentInformation,
      dietary: newDietary,
      liveStatus: shop?.liveStatus,
      dietaryType: shop?.dietaryType,
      expensive: newPriceRange,
      deliveryType: OwnDeliveryBoy ? 'self' : 'drop',
      deliveryFee: newDeliveryFee,
      specialInstructions: newSpecialInstructions,
      shopAddress: {
        address: shop?.address.address,
        latitude: shop?.address.latitude,
        longitude: shop?.address.longitude,
        city: shop?.address.city,
        state: shop?.address.state,
        country: shop?.address.country,
        placeId: shop?.address.placeId,
        pin: shop?.address.pin,
        primary: true,
        note: shop?.address.note,
      },
      bank_name: shop?.bank_name,
      account_name: shop?.account_name,
      account_number: shop?.account_number,
    };

  return {
    tags,
    tagsId,
    cuisineType,
    id: shop?._id,
    shopName: shop?.shopName,
    password: '',
    isCuisine: shop?.isCuisine,
    maxDiscount: newMaxDiscount,
    minOrderAmount: minimumOrder,
    email: shop?.email,
    phone_number: shop?.phone,
    shopType: shop?.shopType,
    shopLogo: shop?.shopLogo,
    shopBanner: shop?.shopBanner,
    shopStatus: shop?.shopStatus,
    shopDescription: 'desrcriptions',
    orderCapacity: newOrderCapacity,
    paymentOption: newPayMentInformation,
    dietary: newDietary,
    liveStatus: shop?.liveStatus,
    dietaryType: shop?.dietaryType,
    expensive: newPriceRange,
    deliveryType: shop?.haveOwnDeliveryBoy ? 'self' : 'drop',
    deliveryFee: shop?.deliveryFee,
    specialInstructions: newSpecialInstructions,
    shopExchangeRate,
    shopAddress: {
      address: shop?.address.address,
      latitude: shop?.address.latitude,
      longitude: shop?.address.longitude,
      city: shop?.address.city,
      state: shop?.address.state,
      country: shop?.address.country,
      placeId: shop?.address.placeId,
      pin: shop?.address.pin,
      primary: true,
      note: shop?.address.note,
    },
    bank_name: shop?.bank_name,
    account_name: shop?.account_name,
    account_number: shop?.account_number,
  };
}
