// third party
import { Edit } from '@mui/icons-material';
import WestIcon from '@mui/icons-material/West';
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
  fontWeight: '500',
  lineHeight: '24px',
  borderRadius: '30px',
  padding: '12px 30px',
  height: 'auto',
}));

export default function Page1() {
  const theme = useTheme();

  return (
    <Wrapper>
      <Box className="page-content" sx={{ height: '100vh', paddingLeft: '0px', paddingRight: '0px' }}>
        {/* top */}
        <Box
          sx={{
            pb: 5,
          }}
        >
          <PageButton label="Back to Marketing" startIcon={<WestIcon />} />
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
            {/* second */}
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
            {/* third */}
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
                  Categories
                </Typography>
                {/* categories container */}
                <Stack>
                  {/* item */}
                  <Stack>
                    <Stack alignItems="center" direction="row" gap="30px">
                      <img
                        src={HandleIcon}
                        alt="icon"
                        style={{
                          width: '14px',
                        }}
                      />
                      <StyledChip label="Food" />
                    </Stack>
                    <Stack direction="row" justifyContent="flex-end" gap={3}>
                      <StyledSwitch />
                      <IconButton variant="contained">
                        <Edit />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
              <Grid xs={12} md={6}></Grid>
            </Grid>
            {/*  */}
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
                // borderBottom: '1px dashed #E5E5E5',
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
