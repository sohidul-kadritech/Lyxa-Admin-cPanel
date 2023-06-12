import { useHistory } from 'react-router-dom';
import { useGlobalContext } from '../context';

export default function useAccessAsUser() {
  const history = useHistory();
  const { dispatchCurrentUser } = useGlobalContext();

  return (from, to, user) => {
    // from admin to seller
    if (from === 'admin' && to === 'seller') {
      dispatchCurrentUser({ type: 'seller', payload: { seller: user } });
      history.push(`/seller/dashboard/${user._id}`);
    }
  };
}
