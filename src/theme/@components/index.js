import Button from './Button';
import Menu from './Menu';
import Paper from './Paper';
import Popover from './Popover';
import Tabs from './Tabs';

export default function Components(theme) {
  return {
    MuiButton: Button(),
    MuiPaper: Paper(),
    MuiTabs: Tabs(),
    MuiMenu: Menu(theme),
    MuiPopover: Popover(),
  };
}
