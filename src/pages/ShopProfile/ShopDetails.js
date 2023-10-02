import { AccessTimeFilled, Email, Loyalty, Star } from '@mui/icons-material';
import HashIcon from '@mui/icons-material/Tag';
import { Box, Stack } from '@mui/material';
import { ReactComponent as AreaCovered } from '../../assets/icons/areaCovered.svg';
import { ReactComponent as AverageIcon } from '../../assets/icons/averageIcon.svg';
import { ReactComponent as CalenderIcon } from '../../assets/icons/calender.svg';
import { ReactComponent as DeliveryIcon } from '../../assets/icons/delivery-icon3.svg';
import { ReactComponent as Dietary } from '../../assets/icons/dietary.svg';
import { ReactComponent as InfoIcon } from '../../assets/icons/info.svg';
import { ReactComponent as Location } from '../../assets/icons/location.svg';
import { ReactComponent as Phone } from '../../assets/icons/phone.svg';
import { ReactComponent as TagIcon } from '../../assets/icons/tag2.svg';
import { ReactComponent as Warning } from '../../assets/icons/warning-icon.svg';
import ProfileSidebarInfo from '../../components/Common/ProfileSidebarInfo';
import ClickableAddress from '../../components/Shared/ClickableAddress';
import { AverageOrderValue, OpeningHours, ShopReviewDetails, TagsAndCuisines } from './helper';

export default function ShopDetails({ shop }) {
  return (
    <Stack gap="40px" flexDirection="column">
      <ProfileSidebarInfo label="Seller" value={shop?.seller?.company_name} icon={CalenderIcon} />
      <ProfileSidebarInfo
        label="Unique ID"
        value={shop?.autoGenId}
        icon={HashIcon}
        valueSx={{
          textTransform: 'none',
        }}
      />
      <ProfileSidebarInfo label="Shop Type" value={shop?.shopType} icon={CalenderIcon} />
      {shop?.shopBrand && <ProfileSidebarInfo label="Shop Brand" value={shop?.shopBrand} icon={Loyalty} />}

      <ProfileSidebarInfo
        label="Location"
        value={
          <ClickableAddress latitude={shop?.address?.latitude} longitude={shop?.address?.longitude}>
            {shop?.address?.address}
          </ClickableAddress>
        }
        icon={Location}
      />

      <ProfileSidebarInfo label="Delivery by" value={shop?.haveOwnDeliveryBoy ? 'Store' : 'Lyxa'} icon={DeliveryIcon} />
      <ProfileSidebarInfo label="Phone number" value={shop?.phone_number} icon={Phone} />
      <ProfileSidebarInfo
        label="Email"
        value={shop?.email}
        icon={Email}
        valueSx={{
          textTransform: 'none',
        }}
      />
      <ProfileSidebarInfo label="Payment Options" value={shop?.paymentOption?.join(', ')} icon={InfoIcon} />
      <ProfileSidebarInfo
        label={shop?.shopType === 'food' ? 'Tags & cuisines' : 'Tags'}
        value={TagsAndCuisines(shop?.tags, shop?.cuisineType)}
        icon={TagIcon}
      />
      {shop?.shopType !== 'pharmacy' && (
        <ProfileSidebarInfo
          label="Dietary"
          value={shop?.dietary?.length > 0 ? shop?.dietary?.join(', ') : 'No dietary found'}
          icon={Dietary}
        />
      )}

      <ProfileSidebarInfo label="Area Covered" value={shop?.shopZone?.zoneName || 'No zone found'} icon={AreaCovered} />

      <ProfileSidebarInfo
        label="Average Ord. Value"
        value={AverageOrderValue(shop?.orderValue?.productAmount, shop?.orderValue?.count)}
        icon={AverageIcon}
      />
      <ProfileSidebarInfo label="Status" value={shop?.shopStatus} icon={Warning} />
      <Box>
        <ProfileSidebarInfo
          label="Opening Hours"
          icon={AccessTimeFilled}
          valueComponent={<OpeningHours normalHours={shop?.normalHours} />}
        />
      </Box>
      <Box sx={{ paddingBottom: '40px' }}>
        <ProfileSidebarInfo label="Reviews" icon={Star} valueComponent={<ShopReviewDetails shop={shop} />} />
      </Box>
    </Stack>
  );
}
