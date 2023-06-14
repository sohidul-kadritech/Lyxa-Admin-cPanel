import { Box, Skeleton, Stack } from '@mui/material';
import { AvatarSkeleton, Status, Text } from './Elements';

// eslint-disable-next-line no-unused-vars
const getElement = (e) => {
  if (e === 'avatar') return <AvatarSkeleton />;
  if (e === 'text') return <Text />;
  if (e === 'status') return <Status />;

  return <Text />;
};

function Column({ columns }) {
  return (
    <Stack gap={10} direction="row" alignItems="center">
      {columns?.map((e, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
          }}
        >
          {getElement(e)}
        </Box>
      ))}
    </Stack>
  );
}

export default function TableSkeleton({ columns, rows }) {
  return (
    <Stack mb={11} mt={7}>
      <Stack gap={10} direction="row" mb={7}>
        {columns?.map((e, i) => (
          <Skeleton
            key={i}
            height={20}
            sx={{
              flex: 1,
            }}
          />
        ))}
      </Stack>
      <Stack gap={5}>
        {new Array(rows).fill(0).map((item, idx) => (
          <Column key={idx} columns={columns} />
        ))}
      </Stack>
    </Stack>
  );
}
