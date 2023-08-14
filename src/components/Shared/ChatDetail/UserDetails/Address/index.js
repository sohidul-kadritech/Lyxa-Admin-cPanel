import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { StyledProfileBox } from '../helpers';
import AddressItem from './AddressItem';

export default function Address({ addressList = [] }) {
  const [open, setOpen] = useState(false);

  const { recent, others } = useMemo(() => {
    let recent;
    const others = [];

    addressList?.forEach((item) => {
      if (item?.primary) recent = item;
      else others?.push(item);
    });

    return { recent, others };
  }, []);

  return (
    <StyledProfileBox
      titleComponent={
        <Stack direction="row" alignContent="center" justifyContent="space-between">
          <Typography variant="body4" display="block" pb={2} fontWeight={600}>
            Address
          </Typography>
          <Box
            sx={{
              cursor: 'pointer',
            }}
            onClick={() => setOpen(!open)}
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </Box>
        </Stack>
      }
    >
      {recent ? (
        <AddressItem address={recent} isLast isFirst />
      ) : (
        <Typography variant="inherit" fontStyle="italic">
          No recent address found
        </Typography>
      )}
      <Accordion
        expanded={open}
        sx={{
          '&::before': {
            display: 'none',
          },
        }}
      >
        <AccordionSummary sx={{ display: 'none' }}></AccordionSummary>
        <AccordionDetails sx={{ padding: '0', paddingTop: '10px' }}>
          <Stack>
            {others?.map((item, i, { length: l }) =>
              item?.primary ? null : (
                <AddressItem address={item} key={item._id} isFirst={i === 0} isLast={i === l - 1} />
              )
            )}
            {others?.length === 0 && (
              <Typography variant="inherit" fontStyle="italic">
                No address found
              </Typography>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </StyledProfileBox>
  );
}
