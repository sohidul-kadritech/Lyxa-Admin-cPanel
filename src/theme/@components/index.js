import Button from './Button';
import Menu from './Menu';
import Paper from './Paper';
import Tabs from './Tabs';

export default function Components() {
  return {
    MuiButton: Button(),
    MuiPaper: Paper(),
    MuiTabs: Tabs(),
    MuiMenu: Menu(),
  };
}
