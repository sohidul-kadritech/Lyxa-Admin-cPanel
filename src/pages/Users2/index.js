import { Add } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';
import PageTop from '../../components/Common/PageTop';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';

// styled button
function AddMenuButton({ ...props }) {
  return (
    <Button variant="contained" color="primary" size="small" startIcon={<Add />} {...props}>
      Add user
    </Button>
  );
}

function Users2() {
  return (
    <Box>
      <PageTop
        title="Users"
        // tag={Deals.deals.hasActiveDeal ? <OngoingTag label={Deals.get_promotion_str()} /> : undefined}
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />
      <Stack direction="row" justifyContent="start" gap="17px">
        <StyledSearchBar sx={{ width: '319px' }} />
        <AddMenuButton />
      </Stack>

      {/* <Drawer open anchor="right">
        <Typography>hello</Typography>
      </Drawer> */}
    </Box>
  );
}

export default Users2;
