import { Stack } from '@mui/material';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { AddMenuButton } from '../Faq2';

export function SearchBarForAdminList({ setSearchKey, setCurrentAdmin, setIsEdit, setOpen }) {
  return (
    <Stack
      direction="row"
      justifyContent="start"
      gap="17px"
      sx={{
        marginBottom: '30px',
      }}
      width="444px"
    >
      <StyledSearchBar
        sx={{
          flex: '1',
        }}
        placeholder="Search"
        onChange={(e) => setSearchKey(e.target.value)}
      />
      <AddMenuButton
        onClick={() => {
          setCurrentAdmin(null);
          setIsEdit(false);
          setOpen(true);
        }}
      />
    </Stack>
  );
}
