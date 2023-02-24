import Button from './Button';
import Menu from './Menu';
import Paper from './Paper';
import Popover from './Popover';
import Tabs from './Tabs';
import Typography from './Typography';

export default function Components(theme) {
  return {
    MuiButton: Button(),
    MuiPaper: Paper(),
    MuiTabs: Tabs(),
    MuiMenu: Menu(theme),
    MuiPopover: Popover(),
    MuiTypography: Typography(theme),
  };
}
