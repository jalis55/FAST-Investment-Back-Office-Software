
import { Navigate } from 'react-router-dom';
import Form from '../components/Form';
import useCheckAuthorized from '../CheckAuthorized';  

const Register = () => {
  const isAuthorized = useCheckAuthorized();  // Use the custom hook

  if (isAuthorized === null) {
    return <div>Loading...</div>;  // Show a loading indicator while checking authorization
  }

  if (isAuthorized) {
    return <Navigate to="/" />;  // Redirect to home page if authorized
  }
  return <Form route="/api/user/register/" method="register" />
  
}

export default Register;
