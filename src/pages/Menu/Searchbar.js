/* eslint-disable no-unused-vars */
import { Add } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { ReactComponent as CollapseIcon } from '../../assets/icons/collapse.svg';
import { ReactComponent as FileAddIcon } from '../../assets/icons/file-add-icon.svg';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';
import { bulkItemOptions, getAddMenuOptions } from './helpers';

// styled button
export function AddMenuButton({ ...props }) {
  return (
    <Button variant="contained" color="primary" size="small" startIcon={<Add />} {...props}>
      Add
    </Button>
  );
}

// styled button
function BulkItemsButton({ ...props }) {
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      sx={{
        minWidth: 'auto',
        flexShrink: 0,
        gap: 2,
      }}
      startIcon={<FileAddIcon />}
      {...props}
    >
      {' '}
      Bulk Items
    </Button>
  );
}

function SearchBar({
  searchValue,
  setSearchValue,
  searchPlaceHolder,
  onCollapse,
  onMenuClick,
  shopType,
  viewUserType,
  ...props
}) {
  return (
    <Stack direction="row" alignItems="center" gap="15px" pb={6.5} {...props}>
      <StyledSearchBar
        fullWidth
        placeholder={searchPlaceHolder}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />
      <ThreeDotsMenu handleMenuClick={() => {}} menuItems={bulkItemOptions} ButtonComponent={BulkItemsButton} />
      <Button
        onClick={onCollapse}
        variant="contained"
        color="primary"
        size="small"
        sx={{
          minWidth: 'auto',
        }}
      >
        <CollapseIcon />
      </Button>
      <ThreeDotsMenu
        handleMenuClick={onMenuClick}
        menuItems={getAddMenuOptions(shopType, viewUserType)}
        ButtonComponent={AddMenuButton}
      />
    </Stack>
  );
}

export default SearchBar;
