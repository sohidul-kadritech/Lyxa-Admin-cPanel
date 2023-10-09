import { validateList } from '../helpers';

// add new bundle
export const addNewBundleItem = (bundle, setBundle, oldbundle, objectKey, setHasChanged, type = 'number') => {
  if (validateList(bundle, oldbundle, type) && type === 'number') {
    setBundle((prev) => ({ ...prev, [objectKey]: [...oldbundle, Number(bundle)] }));
    setHasChanged(true);
    return true;
  }

  if (validateList(bundle, oldbundle, type) && type === 'text') {
    setHasChanged(true);
    setBundle((prev) => ({ ...prev, [objectKey]: [...oldbundle, bundle] }));
    return true;
  }
  return false;
};
