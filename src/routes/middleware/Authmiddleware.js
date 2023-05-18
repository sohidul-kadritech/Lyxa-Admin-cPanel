import { Redirect } from 'react-router-dom';
import { useGlobalContext } from '../../context/GlobalContext';

export default function Authmiddleware({ children }) {
  const { currentUser } = useGlobalContext();

  let lastLoginType = null;

  if (localStorage.getItem('lastLoginType')) {
    lastLoginType = JSON.parse(localStorage.getItem('lastLoginType'));
  }

  const redirectPath = !lastLoginType
    ? '/login/business'
    : lastLoginType === 'seller' || lastLoginType === 'shop'
    ? '/login/business'
    : '/login/team';

  if (!currentUser?.userType) {
    return <Redirect to={{ pathname: redirectPath }} />;
  }

  return children;
}
