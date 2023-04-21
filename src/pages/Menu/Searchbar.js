/* eslint-disable no-unused-vars */
import { Add } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { ReactComponent as CollapseIcon } from '../../assets/icons/collapse.svg';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';
import { getAddMenuOptions } from './helpers';

// styled button
function StyledButton({ ...props }) {
  return (
    <Button variant="contained" color="primary" size="small" startIcon={<Add />} {...props}>
      Add
    </Button>
  );
}

function SearchBar({ searchValue, setSearchValue, searchPlaceHolder, onCollapse, onMenuClick, shopType, ...props }) {
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
        menuItems={getAddMenuOptions(shopType)}
        ButtonComponent={StyledButton}
      />
    </Stack>
  );
}

export default SearchBar;
