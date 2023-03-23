// mui
import { Box, Breadcrumbs, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const contianerSx = {
  pt: 2.5,
  pb: 5,
};

const linkStyle = (isActive) => ({
  fontSize: '13px',
  fontWeight: '500',
  lineHeight: '21px',
  display: 'inline-block',
  color: `${isActive ? '#363636' : '#737373'}`,
});

export default function BreadCrumbs({ items, sx }) {
  const { length } = items;

  return (
    <Box sx={{ ...contianerSx, ...(sx || {}) }}>
      <Typography
        variant="h4"
        pb={2}
        sx={{
          fontSize: '19px',
          lineHeight: '23px',
        }}
      >
        {items[length - 1].label}
      </Typography>
      <Breadcrumbs separator="/">
        {items.map((item, index) => (
          <Link key={item.to} to={item.to} style={linkStyle(index === length - 1)}>
            {item.label}
          </Link>
        ))}
      </Breadcrumbs>
    </Box>
  );
}
