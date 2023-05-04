/* eslint-disable max-len */
// third party
import { Unstable_Grid2 as Grid, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { ReactComponent as InfoIcon } from '../../../assets/icons/info.svg';
import InfoCard from '../../../components/StyledCharts/InfoCard';

function ListItem({ label, value }) {
  return (
    <Typography
      variant="inherit"
      fontSize={13}
      fontWeight={600}
      lineHeight="20px"
      display="flex"
      justifyContent="space-between"
    >
      <span>{label}</span>
      <span>{value}</span>
    </Typography>
  );
}

function CardTitle({ title, tooltip }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
      <Typography variant="body1" fontWeight={600}>
        {title}
      </Typography>
      <Tooltip arrow title={tooltip}>
        <InfoIcon />
      </Tooltip>
    </Stack>
  );
}

// project import
export default function Operations() {
  const theme = useTheme();

  return (
    <Grid container spacing={5}>
      <InfoCard
        title={
          <CardTitle
            title="Store rejected"
            tooltip="How many orders were declined by your store during business hours?"
          />
        }
        value="2"
        isDropdown
        sm={6}
        md={4}
        lg={3}
      >
        <Stack gap={2.5}>
          <ListItem label="Tue 2/20/2020" value="1" />
          <ListItem label="Tue 2/20/2020" value="1" />
        </Stack>
      </InfoCard>

      <InfoCard
        title={
          <CardTitle
            title="Store refunded"
            tooltip="How many orders were reported by customers as having missing or incorrect items, resulting in refund being issued?"
          />
        }
        value="25"
        sm={6}
        md={4}
        lg={3}
      />

      <InfoCard
        title={
          <CardTitle
            title="Store cancelled"
            tooltip="What is the number of orders that your store accepted but subsequently canceled?"
          />
        }
        value="2"
        sm={6}
        md={4}
        lg={3}
      />

      <InfoCard
        title={<CardTitle title="Downtime" tooltip="How much time was your store unavailable during menu hours?" />}
        value="20h 20m"
        isDropdown
        sm={6}
        md={4}
        lg={3}
        valueSx={{ color: `${theme.palette.error.main}!important` }}
      >
        <Stack gap={2.5}>
          <ListItem label="Tue 2/20/2020" value="1h 6m" />
          <ListItem label="Tue 2/20/2020" value="1h 6m" />
          <ListItem label="Tue 2/20/2020" value="1h 6m" />
          <ListItem label="Tue 2/20/2020" value="1h 6m" />
        </Stack>
      </InfoCard>
    </Grid>
  );
}
