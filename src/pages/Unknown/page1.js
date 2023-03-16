// third party
import { Add, Close, Edit, West } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  styled,
  Typography,
  Unstable_Grid2 as Grid,
  useTheme,
} from '@mui/material';

// project import
import HandleIcon from '../../assets/icons/handle.svg';
import PageButton from '../../components/Common/PageButton';
import StyledSwitch from '../../components/Common/StyledSwitch';
import NumberInput from '../../components/Form/NumberInput';
import Wrapper from '../../components/Wrapper';

const StyledChip = styled(Chip)(({ theme }) => ({
  background: theme.palette.background.secondary,
  borderRadius: '30px',
  padding: '12px 30px',
  height: 'auto',
  gap: '8px',

  '& .MuiChip-label': {
    padding: '0',
    fontFamily: 'Inter',
    fontWeight: '500',
    lineHeight: '24px',
  },

  '& .MuiSvgIcon-root': {
    fontSize: '17px',
    color: '#3F4254',

    '&:hover': {
      color: '#3F4254',
      opacity: '.7',
    },
  },
}));

const StyledIconButton = styled(IconButton)(() => ({
  background: '#F3F6F9',
  borderRadius: '6px!important',
  width: '32px',
  height: '32px',

  '&:hover': {
    background: '#e9eff5',
  },

  '& .MuiSvgIcon-root': {
    fontSize: '16px',
  },
}));

const categoryItems = [
  {
    label: 'Food',
    id: 1,
  },
  {
    label: 'Drinks',
    id: 2,
  },
  {
    label: 'Energy',
    id: 3,
  },
  {
    label: 'Mood Booster',
    id: 4,
  },
];

const rewardBundles = [25, 30, 40, 60, 100];

export default function Page1() {
  const theme = useTheme();

  return (
    <Wrapper>
      <Box
        className="page-content"
        sx={{ height: '100vh', paddingLeft: '0px', paddingRight: '0px', overflowY: 'scroll' }}
      >
        {/* top */}
        <Box
          sx={{
            pb: 5,
          }}
        >
          <PageButton label="Back to Marketing" startIcon={<West />} />
          <Typography
            variant="h4"
            color={theme.palette.text.heading}
            sx={{
              pt: 5,
              pb: 2,
            }}
          >
            Loyalty Points
          </Typography>
        </Box>
        {/* settings */}
        <Box
          sx={{
            background: '#fff',
            borderRadius: '6px',
            pl: 10,
            pr: 10,
          }}
        >
          <Grid container>
            {/* value per points */}
            <Grid
              xs={12}
              container
              sx={{
                borderBottom: '1px dashed #E5E5E5',
                pt: 6,
                pb: 8,
              }}
            >
              <Grid xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} pb={1.5}>
                  Points earned value
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    maxWidth: '345px',
                  }}
                >
                  <Typography variant="body1">Value of 1 Point</Typography>
                  <NumberInput type="text" value="$1" />
                </Stack>
              </Grid>
              <Grid xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} pb={1.5}>
                  Points used value
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    maxWidth: '345px',
                  }}
                >
                  <Typography variant="body1">Value of 1 Point</Typography>
                  <NumberInput type="text" value="$1" />
                </Stack>
              </Grid>
            </Grid>
            {/* distributed cost */}
            <Grid
              xs={12}
              container
              sx={{
                borderBottom: '1px dashed #E5E5E5',
                pt: 6,
                pb: 8,
              }}
            >
              <Grid xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} pb={1.5}>
                  Distributed Cost
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    maxWidth: '345px',
                  }}
                >
                  <Typography variant="body1">Lyxa</Typography>
                  <NumberInput type="text" value="100%" />
                </Stack>
              </Grid>
              <Grid xs={12} md={6}>
                <Stack
                  justifyContent="flex-end"
                  sx={{
                    height: '100%',
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      maxWidth: '345px',
                    }}
                  >
                    <Typography variant="body1"> Shop</Typography>
                    <NumberInput type="text" value="99%" />
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            {/* categories */}
            <Grid
              xs={12}
              container
              sx={{
                borderBottom: '1px dashed #E5E5E5',
                pt: 6,
                pb: 8,
              }}
            >
              <Grid xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} pb={6.5}>
                  Categories
                </Typography>
                {/* categories container */}
                <Stack gap={2.5} pb={6}>
                  {/* item */}
                  {categoryItems.map((item) => (
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      {/* left */}
                      <Stack key={item.id} alignItems="center" direction="row" gap="30px">
                        <img
                          src={HandleIcon}
                          alt="icon"
                          style={{
                            width: '14px',
                          }}
                        />
                        <StyledChip label={item.label} />
                      </Stack>
                      {/* right */}
                      <Stack direction="row" justifyContent="flex-end" gap={11}>
                        <StyledSwitch />
                        <Stack direction="row" gap={2.5}>
                          <StyledIconButton color="secondary">
                            <Edit />
                          </StyledIconButton>
                          <StyledIconButton color="secondary">
                            <Close />
                          </StyledIconButton>
                        </Stack>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
                <Button
                  color="secondary"
                  variant="text"
                  startIcon={<Add />}
                  sx={{
                    fontWeight: '500',
                    fontSize: '14px',
                    lineHeight: '17px',
                    padding: '0px',

                    '&:hover': {
                      background: 'transparent',
                    },
                  }}
                >
                  Add category
                </Button>
              </Grid>
              <Grid xs={12} md={6}></Grid>
            </Grid>
            {/* reward bundle */}
            <Grid
              xs={12}
              container
              sx={{
                borderBottom: '1px dashed #E5E5E5',
                pt: 6,
                pb: 8,
              }}
            >
              <Grid xs={12}>
                <Stack direction="row" gap={2} alignItems="center" pb={4}>
                  <Typography variant="h6" fontWeight={600}>
                    Reward Bundle
                  </Typography>
                  <Button
                    disableRipple
                    color="secondary"
                    variant="text"
                    startIcon={<Add />}
                    sx={{
                      fontWeight: '500',
                      fontSize: '14px',
                      lineHeight: '17px',
                      color: '#417C45',
                      padding: '0px',

                      '&:hover': {
                        background: 'transparent',
                      },
                    }}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" gap={4}>
                  {rewardBundles.map((item) => (
                    <StyledChip
                      key={item}
                      label={item}
                      deleteIcon={<Close />}
                      onDelete={() => {
                        console.log('delete me');
                      }}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
            <Grid
              xs={12}
              container
              sx={{
                borderBottom: '1px dashed #E5E5E5',
                pt: 6,
                pb: 8,
              }}
            >
              <Grid xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} pb={1.5}>
                  Spending Limits
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    maxWidth: '345px',
                  }}
                >
                  <Typography variant="body1">Minimum spending limit/week</Typography>
                  <NumberInput type="text" value="$1" />
                </Stack>
              </Grid>
            </Grid>
            {/* fourth */}
            <Grid
              xs={12}
              container
              sx={{
                pt: 6,
                pb: 8,
              }}
            >
              <Grid xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} pb={1.5}>
                  Expiration
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    maxWidth: '345px',
                  }}
                >
                  <Typography variant="body1">Number of days</Typography>
                  <NumberInput type="text" value="10" />
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        {/* buttons */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          gap={4}
          sx={{
            mt: 9,
          }}
        >
          <Button variant="outlined" color="secondary">
            Discard
          </Button>
          <Button variant="contained" color="secondary">
            Save Changes
          </Button>
        </Stack>
      </Box>
    </Wrapper>
  );
}
