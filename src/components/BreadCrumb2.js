// mui
import { Box, Breadcrumbs, Chip, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';

const contianerSx = {
  pt: 5,
  pb: 5,
};

const chipSx = {
  height: '26px',
};

export default function BreadCrumbs({ items, sx }) {
  const history = useHistory();
  const { length } = items;

  return (
    <Box sx={{ ...contianerSx, ...(sx || {}) }}>
      <Typography variant="h1" pb={2.5}>
        {items[length - 1].label}
      </Typography>
      <Breadcrumbs separator=">">
        {items.map((item) => (
          <Chip
            key={item.to}
            label={item.label}
            sx={chipSx}
            onClick={() => {
              history.push(item.to);
            }}
          />
        ))}
      </Breadcrumbs>
    </Box>
  );
}
