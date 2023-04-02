import { Stack } from '@mui/material';
import StyledTable2 from '../../../components/Styled/StyledTable2';

export default function ProductTable({ ...props }) {
  return (
    <StyledTable2
      // columns={allColumns.filter((column) => column.showFor.includes(marketingType))}
      sx={{
        '& .MuiDataGrid-main': {
          overflow: 'visible!important',
        },

        '& .MuiDataGrid-cell': {
          position: 'relative',
          overflow: 'visible!important',
        },

        // '& .MuiDataGrid-virtualScroller': {
        //   paddingBottom: itemSelectType === 'multiple' ? '45px' : '0px',
        //   overflowX: 'scroll!important',
        // },
      }}
      // rows={createGroupedDataRow(products || [])}
      getRowId={(row) => row?._id}
      components={{
        NoRowsOverlay: () => (
          <Stack height="100%" alignItems="center" justifyContent="center">
            No Products Added
          </Stack>
        ),
      }}
      rowHeight={64}
      autoHeight={false}
      getRowHeight={({ model }) => {
        if (model.isCategoryHeader) {
          return 42;
        }
        return 64;
      }}
      {...props}
    />
  );
}
