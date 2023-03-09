/* eslint-disable no-unused-vars */
import { Stack, styled, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const ListContainer = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',

  '& a': {
    color: 'rgba(0, 0, 0, 1)',
    textDecoration: 'underline!important',
  },
}));

export default function DetailList({ list, itemSx }) {
  return (
    <Stack direction="column" gap={4}>
      {list.map((item, index, array) => (
        <ListContainer
          key={item.label}
          gap={5}
          direction="row"
          sx={itemSx}
          className={`${index === array.length - 1 ? 'last-item' : ''} `}
        >
          <Typography
            className="label"
            variant="body1"
            sx={{
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            {item.label}
          </Typography>
          <Typography className={`value ${item?.classes}`} variant="body1">
            {item.link ? <Link to={item.to}>{item.value}</Link> : item.value}
          </Typography>
        </ListContainer>
      ))}
    </Stack>
  );
}
