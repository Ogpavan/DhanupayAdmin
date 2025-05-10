// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function PrivateRoute({ children }) {
  // Fetch the token from cookies
  // const token = Cookies.get("token");

  // // If no token is found, redirect to the login page
  // if (!token) {
  //   return <Navigate to="/" replace />;
  // }

  // Render the children if authenticated
  return children;
}
