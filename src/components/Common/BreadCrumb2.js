// mui
import { Box, Breadcrumbs, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const contianerSx = {
  pt: 7.5,
  pb: 5,
};

const linkStyle = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#000',
  display: 'inline-block',
  borderBottom: '2px solid #15BFCA',
};

export default function BreadCrumbs({ items, sx }) {
  const { length } = items;

  return (
    <Box sx={{ ...contianerSx, ...(sx || {}) }}>
      <Typography variant="h1" pb={2.5}>
        {items[length - 1].label}
      </Typography>
      <Breadcrumbs separator=">">
        {items.map((item) => (
          <Link key={item.to} to={item.to} style={linkStyle}>
            {item.label}
          </Link>
        ))}
      </Breadcrumbs>
    </Box>
  );
}
