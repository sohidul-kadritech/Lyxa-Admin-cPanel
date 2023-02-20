// third party
import { Button, Card, CardContent, Typography } from '@mui/material';

// icons
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// styles
const cardIconSx = {
  height: '100px',
  width: 'auto',
};

export default function MarketingTypeCard({ title, Icon, onVeiwDetails }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ textAlign: 'center' }}>
        <Icon sx={cardIconSx} />
        <Typography variant="h6" mt={1} mb={2}>
          {title}
        </Typography>
        <Button
          disableElevation
          variant="outlined"
          onClick={onVeiwDetails}
          sx={{
            dispaly: 'inline-flex',
            justifyContent: 'space-between',
            color: 'rgba(0, 0, 0, 0.87)',
            border: '1px solid rgba(0, 0, 0, 0.87)',
            '&:hover': {
              backgroundColor: 'white',
              border: '1px solid rgba(0, 0, 0, 0.87)',
            },
          }}
          endIcon={<ChevronRightIcon />}
        >
          View Detatils
        </Button>
      </CardContent>
    </Card>
  );
}
