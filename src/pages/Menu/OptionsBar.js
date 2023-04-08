/* eslint-disable no-unused-vars */
import { Add } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { ReactComponent as CollapseIcon } from '../../assets/icons/collapse.svg';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';

// styled button
function StyledButton({ ...props }) {
  return (
    <Button variant="contained" color="secondary" size="small" startIcon={<Add />} {...props}>
      Add
    </Button>
  );
}

const menuItems = [
  {
    label: 'Add item',
    value: 'add-item',
  },
  {
    label: 'Add category',
    value: 'add-category',
  },
];

function OptionsBar({ searchValue, setSearchValue, searchPlaceHolder, onCollapse, onMenuClick }) {
  return (
    <Stack direction="row" alignItems="center" gap="15px" pb={6.5}>
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
        color="secondary"
        size="small"
        sx={{
          minWidth: 'auto',
        }}
      >
        <CollapseIcon />
      </Button>
      <ThreeDotsMenu handleMenuClick={onMenuClick} menuItems={menuItems} ButtonComponent={StyledButton} />
    </Stack>
  );
}

export default OptionsBar;
