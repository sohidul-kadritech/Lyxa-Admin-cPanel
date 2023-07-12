/* eslint-disable no-unused-vars */
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import CloseButton from '../../../components/Common/CloseButton';

function AccountManagerInfo({
  isDropdown = true,
  accountManager = { name: 'Account Name', addresss: 'City, State, Zip Code', phone_number: 'xxxxxxxxxxx' },
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const theme = useTheme();
  const dropdownProps = {
    position: 'absolute',
    top: '40px',
    left: '-25px',
    borderRadius: '7px',
    border: `1px solid ${theme.palette.custom.border}`,
    width: '350px',
    minHeight: '100%',
    zIndex: 99,
  };

  useEffect(() => {
    setDropdownOpen(false);
  }, [accountManager]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Stack
        direction="row"
        alignItems="center"
        sx={{ cursor: 'pointer' }}
        onClick={() => {
          setDropdownOpen((prev) => !prev);
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'primary.main',
            fontSize: '15px',
            fontWeight: '600',
            marginLeft: '8px',
            cursor: 'pointer',
          }}
        >
          @{accountManager?.name} (Account Manager)
        </Typography>
        {isDropdown ? (
          dropdownOpen ? (
            <ExpandLessIcon sx={{ color: 'primary.main' }} />
          ) : (
            <ExpandMoreIcon sx={{ color: 'primary.main' }} />
          )
        ) : null}
      </Stack>

      {isDropdown && (
        <Box sx={dropdownOpen ? { ...dropdownProps, opacity: '1' } : { ...dropdownProps, opacity: '0' }}>
          <Accordion
            expanded={dropdownOpen}
            onChange={() => {
              setDropdownOpen((prev) => !prev);
            }}
            sx={{
              '&::before': {
                display: 'none',
              },

              '&.Mui-expanded': {
                margin: '8px 0px',
              },
            }}
          >
            <AccordionSummary
              sx={{
                display: 'none',
              }}
              expandIcon={<ExpandMoreIcon />}
            ></AccordionSummary>
            <AccordionDetails
              sx={{
                padding: '0px 25px 15px 20px',
              }}
            >
              {/* {children} */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  position: 'sticky',
                  top: 0,
                  paddingTop: '20px',
                  paddingBottom: '15px',
                  zIndex: '99999',
                  background: '#fff',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    fontSize: '19px',
                    lineHeight: '23px',
                  }}
                >
                  Account Manager
                </Typography>
                <CloseButton
                  disableRipple
                  onClick={() => {
                    setDropdownOpen(false);
                  }}
                  sx={{
                    color: 'text.primary',
                  }}
                />
              </Stack>
              <Stack gap={3}>
                <Stack gap={1}>
                  <Typography sx={{ fontWeight: 400, fontSize: '19px' }}> Account Manager</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '19px' }}> {accountManager?.name}</Typography>
                </Stack>
                <Stack gap={1}>
                  <Typography sx={{ fontWeight: 400, fontSize: '19px' }}>Phone Number</Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: `19px`,
                      color: theme.palette.primary.main,
                      cursor: 'pointer',
                      paddingBottom: 2,
                      '&:hover': {
                        textDecoration: 'underline',
                        // borderBottom: `1px solid ${theme.palette.primary.main}`,
                      },
                    }}
                    onClick={() => {
                      window.open(`tel:${accountManager?.phone_number}`);
                    }}
                    // href={`tel:${accountManager?.phone_number}`}
                  >
                    {accountManager?.phone_number}
                  </Typography>
                  {/* <a href={`tel:${accountManager?.phone_number}`}> {accountManager?.phone_number}</a> */}
                </Stack>
                <Stack gap={1}>
                  <Typography sx={{ fontWeight: 400, fontSize: '19px' }}> Email</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '19px' }}> {accountManager?.email}</Typography>
                </Stack>
              </Stack>
              {/* <Typography>{accountManager?.addresss}</Typography> */}
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
}

export default AccountManagerInfo;
