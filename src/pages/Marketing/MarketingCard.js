// third party
import { Button, Paper, Stack, styled, Typography } from '@mui/material';

// icons
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const CardBottom = styled(Stack)(() => ({
  '& .MuiButton-root': {
    border: '0px',
    borderTop: `1px solid rgba(221, 91, 99, 0.2)`,
    padding: '12px 15px',

    '&:hover': {
      border: '0px',
      borderTop: `1px solid rgba(221, 91, 99, 0.2)`,
    },

    '&:first-child': {
      borderTop: '0px',
    },
  },
}));

// styles
const cardIconSx = {
  height: '100px',
  width: 'auto',
};

export default function MarketingCard({ title, Icon, onVeiwDetails, addNew, onAddnew }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: '12px',
        textAlign: 'center',
        padding: 3,
        paddingBottom: '0px',
      }}
    >
      <Icon sx={cardIconSx} color="primary" />
      <Typography variant="h3" mt={5} mb={8}>
        {title}
      </Typography>
      <CardBottom mt={3}>
        {addNew && (
          <Button disableElevation variant="outlined" onClick={onAddnew} endIcon={<ChevronRightIcon />}>
            Add New
          </Button>
        )}
        <Button disableElevation variant="outlined" onClick={onVeiwDetails} endIcon={<ChevronRightIcon />}>
          View Detatils
        </Button>
      </CardBottom>
    </Paper>
  );
}
