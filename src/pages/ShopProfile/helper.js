/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { Avatar, Box, Button, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import { ReactComponent as CameraIcon } from '../../assets/icons/camera.svg';
import Rating from '../../components/Common/Rating';
import { getFirstMonday } from '../../components/Styled/StyledDateRangePicker/Presets';
import { getImageUrl } from '../../helpers/images';

export const getQueryParamsInit = (params) => ({
  endDate: moment(),
  startDate: getFirstMonday('week'),
  searchKey: '',
  sortBy: 'DESC',
  ...params,
});

export const menuOtions = (userType, currentRoute, adminType) => {
  const options = [];

  if (adminType !== 'customerService') {
    options?.push({
      label: 'Edit Shop',
      value: 'edit',
      disabled: adminType === 'customerService',
    });
  }
  if (userType !== 'shop' && currentRoute?.search('shop/dashboard') === -1) {
    options?.push({
      label: 'Access as Shop',
      value: 'access-shop',
    });
  }

  return options;
};

export const createShopData = async (shopData) => {
  const img_url_logo = await getImageUrl(shopData.shopLogo[0]);
  const img_url_banner = await getImageUrl(shopData.shopBanner[0]);

  if (!img_url_logo) {
    return {
      status: false,
      msg: 'Error uploading shop logo image!',
    };
  }
  if (!img_url_banner) {
    return {
      status: false,
      msg: 'Error uploading shop banner image',
    };
  }

  shopData.shopAddress = shopData.address;
  delete shopData.address;

  return {
    id: shopData?._id,
    shopName: shopData?.shopName,
    email: shopData?.email,
    password: shopData?.password,
    phone_number: shopData?.phone_number,
    shopStatus: shopData?.shopStatus,
    bank_name: shopData?.bank_name,
    account_name: shopData?.account_name,
    account_number: shopData?.account_number,
    bank_address: shopData?.bank_address,
    bank_postal_code: shopData?.bank_postal_code,
    account_swift: shopData?.account_swift,
    shopAddress: {
      address: shopData?.shopAddress?.address,
      latitude: shopData?.shopAddress?.latitude,
      longitude: shopData?.shopAddress?.longitude,
      country: shopData?.shopAddress?.country,
      state: shopData?.shopAddress?.state,
      city: shopData?.shopAddress?.city,
      pin: shopData?.shopAddress?.pin,
      primary: false,
      note: shopData?.shopAddress?.note,
    },
    shopLogo: img_url_logo,
    shopBanner: img_url_banner,
  };
};

export function CoverPhotoButton({ label, onDrop, loading }) {
  const theme = useTheme();

  return (
    <Button
      disabled={loading}
      variant="contained"
      aria-label="upload picture"
      component="label"
      startIcon={<CameraIcon />}
      sx={{
        position: 'absolute',
        color: theme.palette.text.primary,
        bottom: 15,
        right: 15,
        backgroundColor: 'white',
        fontWeight: '600',
        fontSize: '16px',
        gap: 2,
        padding: '12px 24px',

        '& .MuiButton-startIcon': {
          margin: '0',
        },

        '&:hover': {
          background: '#d5d5d5',
        },

        '&.Mui-disabled': {
          backgroundColor: 'white',
          opacity: '0.8',
          color: '#363636!important',
        },
      }}
    >
      <input hidden onChange={(e) => onDrop([e.target.files[0]])} accept="image/*" type="file" />
      {label}
    </Button>
  );
}

export function AverageOrderValue(totalProductsAmount, totalOrder) {
  return (totalProductsAmount / totalOrder || 0).toFixed(2);
}

export function TagsAndCuisines(tags, cuisines) {
  console.log({ tags, cuisines });
  return ` ${cuisines?.map((cuisines) => cuisines.name).join(', ')}${
    tags?.length && cuisines?.length ? ', ' : ''
  }${tags?.join(', ')}`;
}

export function convertTimeToAmPm(time = []) {
  const date = new Date();
  const [hours, minutes] = time.split(':');
  date.setHours(hours, minutes, 0, 0);
  const suffix = hours > 12 ? 'P.M' : 'A.M';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${suffix}`;
}

export function OpeningHours({ normalHours }) {
  const openingHoursSx = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#363636',
  };

  const dayStructure = (day) => {
    if (day.toLowerCase() === 'saturday') return 'Sat.';
    if (day.toLowerCase() === 'sunday') return 'Sun.';
    if (day.toLowerCase() === 'monday') return 'Mon.';
    if (day.toLowerCase() === 'tuesday') return 'Tue.';
    if (day.toLowerCase() === 'wednesday') return 'Wed.';
    if (day.toLowerCase() === 'thursday') return 'Thu.';
    if (day.toLowerCase() === 'friday') return 'Fri.';

    return '';
  };

  return (
    <Stack direction="column" gap="10px">
      {normalHours?.map((day, i) => (
        <Box key={i}>
          <Stack direction="row">
            <Typography sx={openingHoursSx} width="40px" variant="inherit">
              {dayStructure(day?.day)}
            </Typography>
            {day.isActive ? (
              <Box>
                {day?.openingHours?.map((hours, index) => (
                  <Typography sx={openingHoursSx} variant="inherit" key={`${index}`}>
                    {convertTimeToAmPm(hours.open)} - {convertTimeToAmPm(hours.close)}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography sx={openingHoursSx} variant="inherit">
                Closed
              </Typography>
            )}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

export const calculatePercantagesOfRating = (reviews) => {
  const ratingCounts = {};
  const totalReviews = reviews.length;

  // Count the occurrences of each rating
  for (const review of reviews) {
    const rating = review?.rating;
    if (ratingCounts[rating]) {
      ratingCounts[rating]++;
    } else {
      ratingCounts[rating] = 1;
    }
  }

  // Calculate and return the percentages
  const percentages = {};
  for (const rating in ratingCounts) {
    percentages[`${rating}`] = ((ratingCounts[rating] / totalReviews) * 100 || 0).toFixed(2);
  }

  return percentages;
};

// eslint-disable-next-line no-unused-vars
function PercentageOfRate({ rate, percentage, color }) {
  return (
    <Stack direction="row" alignItems="center" gap={4}>
      <Rating amount={rate} titleSx={{ fontSize: '14px', fontWeight: 600 }} />
      <Box flex={1} sx={{ background: '#f5f5f5', position: 'relative', height: '3px', left: 0, borderRadius: '3px' }}>
        <Box
          sx={{
            background: color,
            position: 'absolute',
            width: `${percentage}%`,
            height: '100%',
            left: 0,
            top: 0,
            borderRadius: '3px',
          }}
        />
      </Box>
      <Typography variant="body">{percentage}%</Typography>
    </Stack>
  );
}

export function ShopReviewDetails({ shop }) {
  const ratings = calculatePercantagesOfRating(shop?.reviews);
  return (
    <Stack gap={4}>
      <Stack direction="row" gap={2} alignItems="center">
        <Avatar src={shop?.shopLogo} sx={{ width: '50px', height: '50px' }}>
          {shop?.shopName[0]}
        </Avatar>
        <Stack>
          <Rating amount={shop?.rating} titleSx={{ fontSize: '18px', fontWeight: 600 }} />
          <Typography variant="body" sx={{ color: '#737373' }}>
            Based on feedback from {shop?.reviews?.length || 0} reviews
          </Typography>
        </Stack>
      </Stack>
      <Stack gap={2}>
        <PercentageOfRate rate={1} percentage={ratings['1'] || 0} color="#CD6366" />
        <PercentageOfRate rate={2} percentage={ratings['2'] || 0} color="#CD6366" />
        <PercentageOfRate rate={3} percentage={ratings['3'] || 0} color="#F2C14B" />
        <PercentageOfRate rate={4} percentage={ratings['4'] || 0} color="#507B4B" />
        <PercentageOfRate rate={5} percentage={ratings['5'] || 0} color="#507B4B" />
      </Stack>
    </Stack>
  );
}

export const getMarketingLabel = (shop, appSettings, showPromotionString = false) => {
  const maxDiscount = {
    shop: shop?.maxDiscount,
    admin: appSettings?.maxDiscount,
  };

  const currency = {
    base: appSettings?.baseCurrency,
    secondary: appSettings?.secondaryCurrency,
  };

  const deals = {
    free_delivery: false,
    free_deliveryCreator: '',
    reward: {
      isEntireMenu: false,
      isActive: false,
    },
    double_menu: {
      isActive: false,
      isEntireMenu: false,
      createdBy: '',
    },
    percentage: {
      discountPercentages: [],
      isEntireMenu: false,
      isActive: false,
      createdBy: '',
      maxDiscount: '',
      currency: currency?.base?.symbol,
    },
    featured: false,
    hasActiveDeal: false,
  };

  const promotion = {};
  let promotionString = 'Ongoing ';

  shop?.marketings?.forEach((obj) => {
    if (obj?.type === 'free_delivery') {
      deals.free_delivery = obj?.isActive;
      deals.free_deliveryCreator = obj?.creatorType;
      deals.hasActiveDeal = obj?.isActive || deals.hasActiveDeal;
      // string for free delivery
      promotionString += `Free Delivery (${obj?.creatorType}), `;
      // label for specific
      promotion[obj?.type] = {
        label: `Free Delivery Promotion (${obj?.creatorType})`,
        isActive: obj?.isActive,
      };
    } else if (obj?.type === 'featured') {
      deals.featured = obj?.isActive;
      deals.hasActiveDeal = obj?.isActive || obj?.isActive;
      // string for featured
      promotionString += `Featured, `;
      // label for specific
      promotion[obj?.type] = {
        label: `Featured Promotion`,
        isActive: obj?.isActive,
      };
    } else {
      deals[obj?.type].isActive = obj?.isActive;
      deals[obj?.type].createdBy = obj?.creatorType;
      deals[obj?.type].isEntireMenu = obj?.itemSelectionType === 'multiple';

      if (obj?.type === 'percentage') {
        deals.percentage.discountPercentages = [...(obj?.discountPercentages || [])];
        deals.percentage.maxDiscount = maxDiscount[obj?.creatorType];

        let temp = '';

        if (deals.percentage.discountPercentages.length > 0) {
          deals.percentage.discountPercentages.sort().reverse();
          const item = deals.percentage.discountPercentages[0];
          temp = `${item}% `;
        }

        if (deals.percentage.isEntireMenu) {
          // string for percentage on entire menu
          promotionString += `${
            deals.percentage.maxDiscount > 0
              ? `${temp}off up to ${deals?.percentage?.currency}${deals?.percentage?.maxDiscount}`
              : `Up to ${temp}off`
          } on Entire Menu (${obj?.creatorType}), `;

          temp = (
            <>
              {deals.percentage.maxDiscount > 0 ? (
                <b style={{ fontWeight: '700' }}>
                  {temp}off Up to {deals?.percentage?.currency}
                  {deals?.percentage?.maxDiscount}
                </b>
              ) : (
                <b style={{ fontWeight: '700' }}>Up to {temp}off</b>
              )}{' '}
              on Entire Menu ({obj?.creatorType})
            </>
          );
        } else {
          // string for percentage on selected items
          promotionString += `${
            deals.percentage.maxDiscount > 0
              ? `${temp}off up to ${deals?.percentage?.currency}${deals?.percentage?.maxDiscount}`
              : `Up to ${temp}off`
          } on selected items (${obj?.creatorType}), `;

          temp = (
            <>
              {deals.percentage.maxDiscount > 0 ? (
                <b style={{ fontWeight: '700' }}>
                  {temp}off Up to {deals?.percentage?.currency} {deals?.percentage?.maxDiscount}
                </b>
              ) : (
                <b style={{ fontWeight: '700' }}>Up to {temp}off</b>
              )}{' '}
              on Selected Items ({obj?.creatorType})
            </>
          );
        }

        // percentage
        // label for specific
        promotion[obj?.type] = {
          label: temp,
          isActive: obj?.isActive,
        };
      }

      if (obj?.type === 'double_menu') {
        let temp = 'Buy 1 Get 1 Promotion';

        if (deals.percentage.isEntireMenu) {
          temp = `${temp}on Entire Menu`;
        } else {
          temp = 'Buy 1 Get 1 Promotion on Selected Items';
        }

        // string for double deal
        promotionString += `${temp.replace('Promotion', '')} (${obj?.creatorType}), `;

        // double menu
        promotion[obj?.type] = {
          label: `${temp} (${obj?.creatorType})`,
          isActive: obj?.isActive,
        };
      }

      if (obj?.type === 'reward') {
        let temp = 'Reward Promotion';

        if (deals.reward.isEntireMenu) {
          temp = `${temp}on Entire Menu`;
        } else {
          temp = 'Reward Promotion on Selected Items';
        }

        // string for double deal
        promotionString += `${temp.replace('Promotion', '')}, `;

        // reward
        promotion[obj?.type] = {
          label: `${temp} (${obj?.creatorType})`,
          isActive: obj?.isActive,
        };
      }

      if (deals[obj?.type].isActive) {
        deals.hasActiveDeal = true;
      }
    }
  });

  if (showPromotionString) {
    return `${promotionString} promotions`;
  }

  return promotion;
};

// get deals with on selected items
export const GetDealsWithOnselectedItems = (categoryItems, details, symble = '$') => {
  const result = [];
  let double_deal_Count = 0;
  let total_Product_Count = 0;
  let percentage_Count = 0;
  const percentageHolder = [];
  categoryItems?.map((item) => {
    item?.data?.map((child) => {
      total_Product_Count++;
      if (child?.marketing?.isActive) {
        if (child?.marketing?.type === 'double_menu') {
          double_deal_Count++;
        } else if (child?.marketing?.type === 'percentage') {
          percentage_Count++;
          const checkDuplicate = percentageHolder.includes(child?.discountPercentage);
          if (!checkDuplicate) {
            percentageHolder.push(child?.discountPercentage);
          }
        }
      }
    });
  });
  if (double_deal_Count) {
    if (double_deal_Count === total_Product_Count) {
      result.push({
        first: `Buy 1 get 1`,
        third: ` on entire menu`,
      });
    } else {
      result.push({
        first: 'Buy 1 get 1',
        third: ` on selected items`,
      });
    }
  }
  if (percentage_Count) {
    percentageHolder.sort().reverse();
    const item = percentageHolder[0];
    if (percentage_Count == total_Product_Count) {
      result.push({
        first: percentageHolder?.length === 1 ? `${item}% off` : `Up to ${item}% off`,
        second: details?.maxDiscount > 0 ? ` up to ${symble}${details?.maxDiscount}` : undefined,
        third: ` on entire menu`,
      });
    } else {
      result.push({
        first: percentageHolder?.length === 1 ? `${item}% off` : `Up to ${item}% off`,
        second: details?.maxDiscount > 0 ? ` up to ${symble}${details?.maxDiscount}` : undefined,
        third: ` on selected items`,
      });
    }
  }
  return result;
};
