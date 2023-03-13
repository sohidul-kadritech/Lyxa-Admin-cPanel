/* eslint-disable no-unused-vars */
import { Stack, styled, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const ListItem = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
  gap: theme.spacing(5),

  '& a': {
    color: 'rgba(0, 0, 0, 1)',
    textDecoration: 'underline!important',
  },
  '& .label': {
    fontWeight: 500,
    flexShrink: '0',
  },
}));

export default function DetailList({ list, sx }) {
  return (
    <Stack direction="column" gap={4}>
      {list
        .filter((item) => !item.hide)
        .map((item, index, array) => (
          <ListItem
            key={item.label}
            direction="row"
            sx={{ ...(sx || {}), ...(item?.itemSx || {}) }}
            className={`${index === array.length - 1 ? 'last-item' : ''} `}
          >
            <Typography className="label" variant="body1">
              {item.label}
            </Typography>
            <Typography className="value" variant="body1">
              {item.link ? <Link to={item.to}>{item.value}</Link> : item.value}
            </Typography>
          </ListItem>
        ))}
    </Stack>
  );
}
