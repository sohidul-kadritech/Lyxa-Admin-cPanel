import { AccessTimeFilled, Email } from '@mui/icons-material';
import { Box, Stack } from '@mui/material';
import { ReactComponent as AverageIcon } from '../../assets/icons/averageIcon.svg';
import { ReactComponent as CalenderIcon } from '../../assets/icons/calender.svg';
import { ReactComponent as DeliveryIcon } from '../../assets/icons/delivery-icon3.svg';
import { ReactComponent as InfoIcon } from '../../assets/icons/info.svg';
import { ReactComponent as Loacation } from '../../assets/icons/location.svg';
import { ReactComponent as Phone } from '../../assets/icons/phone.svg';
import { ReactComponent as TagIcon } from '../../assets/icons/tag2.svg';
import { ReactComponent as Warning } from '../../assets/icons/warning-icon.svg';
import { AverageOrderValue, ShopProfileBasicInfo, TagsAndCuisines, openingHours } from './helper';

export default function ShopDetails({ shop }) {
  return (
    <Stack gap="40px" flexDirection="column">
      <ShopProfileBasicInfo title="Seller" desc={shop?.shopName} Icon={CalenderIcon} />
      <ShopProfileBasicInfo title="Shop Type" desc={shop?.shopType} Icon={CalenderIcon} />
      <ShopProfileBasicInfo title="Location" desc={shop?.address?.address} Icon={Loacation} />
      <ShopProfileBasicInfo
        title="Delivery by"
        desc={shop?.haveOwnDeliveryBoy ? 'Store' : 'Lyxa'}
        Icon={DeliveryIcon}
      />
      <ShopProfileBasicInfo title="Phone number" desc={shop?.phone_number} Icon={Phone} />
      <ShopProfileBasicInfo title="Email" desc={shop?.email} Icon={Email} />
      <ShopProfileBasicInfo title="Payment Options" desc={shop?.paymentOption?.join(', ')} Icon={InfoIcon} />
      <ShopProfileBasicInfo
        title="Tags & cuisines"
        desc={TagsAndCuisines(shop?.tagsId, shop?.cuisineType)}
        Icon={TagIcon}
      />
      <ShopProfileBasicInfo
        title="Average Ord. Value"
        desc={AverageOrderValue(shop?.orderValue?.productAmount, shop?.orderValue?.count)}
        Icon={AverageIcon}
      />
      <ShopProfileBasicInfo title="Status" desc={shop?.shopStatus} Icon={Warning} />
      <Box sx={{ paddingBottom: '40px' }}>
        <ShopProfileBasicInfo title="Opening Hours" desc={openingHours(shop?.normalHours)} Icon={AccessTimeFilled} />
      </Box>
    </Stack>
  );
}
