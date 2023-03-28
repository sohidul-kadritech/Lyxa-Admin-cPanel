// third party
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Box, Button, Modal, Paper, Stack, styled, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { useState } from 'react';

// project import
import BreadCrumbs from '../../../components/Common/BreadCrumb2';
import PageButton from '../../../components/Common/PageButton';
import StyledSelect2 from '../../../components/Styled/StyledSelect2';
import StyledAreaChartfrom from '../../../components/StyledCharts/StyledAreaChart';
import StyledBarChart from '../../../components/StyledCharts/StyledBarChart';
import Wrapper from '../../../components/Wrapper';
import LoyaltySettings from '../Settings';
import InfoCard from './InfoCard';
import { areaChartData, barChartData, lineChartData, ProductsInfoListData } from './mock';
import ProductsInfoList from './ProductsInfoList';
import { IncreaseDecreaseTag, ViewMoreTag } from './Tags';

const breadCrumbItems = [
  {
    label: 'Marketing',
    to: '/marketing',
  },
  {
    label: ' Loyalty Points',
    to: '/unknown',
  },
];

const StyledBox = styled(Box)(({ theme }) => ({
  background: '#fff',
  border: `1px solid ${theme.palette.custom.border}`,
  borderRadius: '7px',
}));

const selectMockOptions = [
  {
    label: 'Week',
    value: 'week',
  },
  {
    label: 'Month',
    value: 'month',
  },
  {
    label: 'Year',
    value: 'year',
  },
];

export default function LoyaltyProgramDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Wrapper
      sx={{
        paddingTop: '70px',
        paddingBottom: '110px',
        background: '#FBFBFB !important',
        height: '100%',
        overflowY: 'scroll',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" pt={8}>
        <PageButton label="Back to Marketing" to="/marketing" startIcon={<KeyboardBackspaceIcon />} />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Manage Promotions
        </Button>
      </Stack>
      <BreadCrumbs items={breadCrumbItems} />
      <Grid container spacing={6.5} pb={3}>
        <Grid sm={6} md={4} lg={4}>
          <StyledBox>
            <InfoCard title="Ongoing Promotions on Items" value={14} Tag={<ViewMoreTag />} />
          </StyledBox>
        </Grid>
        <Grid sm={6} md={4} lg={4}>
          <StyledBox>
            <InfoCard title="Ongoing Promotions on Items" value={14} Tag={<IncreaseDecreaseTag status="increase" />} />
          </StyledBox>
        </Grid>
        <Grid sm={6} md={4} lg={4}>
          <StyledBox>
            <InfoCard title="Ongoing Promotions on Items" value={14} Tag={<IncreaseDecreaseTag />} />
          </StyledBox>
        </Grid>
        <Grid sm={12} md={12} lg={5}>
          <StyledBox>
            <ProductsInfoList
              items={ProductsInfoListData}
              onVeiwMore={() => {
                console.log('Clicked');
              }}
            />
          </StyledBox>
        </Grid>
        <Grid sm={12} md={12} lg={7}>
          <StyledBox
            sx={{
              padding: '18px 18px 23px 20px',
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
              <Typography variant="body1" fontWeight={600}>
                Loyalty points usage
              </Typography>
              <StyledSelect2 items={selectMockOptions} defaultValue="week" />
            </Stack>
            <Box
              sx={{
                height: '325px',
              }}
            >
              <StyledBarChart data={barChartData} />
            </Box>
          </StyledBox>
        </Grid>
        <Grid sm={12}>
          <StyledBox
            sx={{
              padding: '18px 18px 23px 20px',
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
              <Typography variant="body1" fontWeight={600}>
                Orders
              </Typography>
              <StyledSelect2 items={selectMockOptions} defaultValue="week" />
            </Stack>
            <Box
              sx={{
                height: '245px',
              }}
            >
              <StyledAreaChartfrom data={areaChartData} />
            </Box>
          </StyledBox>
        </Grid>
        <Grid sm={12} md={12} lg={6}>
          <StyledBox
            sx={{
              padding: '18px 18px 23px 20px',
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
              <Typography variant="body1" fontWeight={600}>
                Customers
              </Typography>
              <StyledSelect2 items={selectMockOptions} defaultValue="week" />
            </Stack>
            <Box
              sx={{
                height: '325px',
              }}
            >
              <StyledBarChart data={barChartData} />
            </Box>
          </StyledBox>
        </Grid>
        <Grid sm={12} md={12} lg={6}>
          <StyledBox
            sx={{
              padding: '18px 18px 23px 20px',
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
              <Typography variant="body1" fontWeight={600}>
                Amount spent
              </Typography>
              <StyledSelect2 items={selectMockOptions} defaultValue="week" />
            </Stack>
            <Box
              sx={{
                height: '325px',
              }}
            >
              <StyledAreaChartfrom data={lineChartData} />
            </Box>
          </StyledBox>
        </Grid>
      </Grid>
      <Modal
        sx={{
          minHeight: '0',
          maxHeight: '90%',
          top: '5%',
        }}
        open={isModalOpen}
      >
        <Paper
          sx={{
            maxWidth: 'calc(100vw - 100px)',
            position: 'relative',
            borderRadius: '10px',
            height: '100%',
          }}
        >
          <LoyaltySettings
            closeModal={() => {
              setIsModalOpen(false);
            }}
          />
        </Paper>
      </Modal>
    </Wrapper>
  );
}
