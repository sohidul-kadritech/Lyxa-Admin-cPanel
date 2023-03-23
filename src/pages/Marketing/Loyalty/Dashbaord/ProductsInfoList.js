import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';

const StyledInfoTable = styled(Table)(({ theme }) => ({
  '& > thead': {
    background: 'none',
  },

  '& .MuiTableCell-root': {
    borderBottom: '0px',
    padding: '8px 8px 8px 0px',
    color: theme.palette.text.heading,
  },

  '& .MuiTableCell-head': {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '24px',
    paddingBottom: '16px',
  },

  '& .MuiTableCell-body': {
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '24px',
  },
}));

export default function ProductsInfoList({ items, onViewMore }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: '14px 10px 10px 20px',
      }}
    >
      <Typography
        variant="h6"
        pb={5}
        sx={{
          fontWeight: '700',
          fontSize: '16px',
          lineHeight: '24px',
        }}
      >
        Top selling items
      </Typography>
      <TableContainer component={Paper}>
        <StyledInfoTable>
          <TableHead>
            <TableRow>
              <TableCell>Item name</TableCell>
              <TableCell align="left">Points Used</TableCell>
              <TableCell align="left">Items sold</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.points}</TableCell>
                <TableCell
                  align="left"
                  sx={{
                    width: '110px',
                  }}
                >
                  {row.sold}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledInfoTable>
      </TableContainer>
      <Box textAlign="right" pt={6}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<VisibilityIcon />}
          onClick={onViewMore}
          sx={{
            fontWeight: '500',
            fontSize: '12px',
            lineHeight: '1',
            background: theme.palette.background.secondary,
            color: theme.palette.secondary.main,
            padding: '8px 17.5px',

            '&:hover': {
              color: theme.palette.secondary.main,
              background: theme.palette.background.secondaryHover,
            },
          }}
        >
          See analytics
        </Button>
      </Box>
    </Box>
  );
}
