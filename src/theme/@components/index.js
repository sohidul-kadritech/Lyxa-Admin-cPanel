import Button from './Button';
import Menu from './Menu';
import Modal from './Modal';
import PaginationItem from './PaginationItem';
import Paper from './Paper';
import Popover from './Popover';
import Tabs from './Tabs';
import Tooltip from './Tooltip';
import Typography from './Typography';

export default function Components(theme) {
  return {
    MuiButton: Button(),
    MuiPaper: Paper(),
    MuiTabs: Tabs(),
    MuiMenu: Menu(theme),
    MuiPopover: Popover(),
    MuiTypography: Typography(theme),
    MuiPaginationItem: PaginationItem(theme),
    MuiTooltip: Tooltip(),
    MuiModal: Modal(),
  };
}
