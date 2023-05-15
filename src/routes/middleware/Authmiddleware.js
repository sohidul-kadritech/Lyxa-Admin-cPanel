import { Redirect } from 'react-router-dom';
import { useGlobalContext } from '../../context/GlobalContext';

export default function Authmiddleware({ children }) {
  const { currentUser } = useGlobalContext();
  console.log('=====>', currentUser);

  if (!currentUser?.userType) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  return children;
}
