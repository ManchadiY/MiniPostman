import { Navigate } from "react-router-dom";

function PrivateRouteHandler({ children }) {
  //simple user check usig the token
  const token = sessionStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return children;
}

export default PrivateRouteHandler;
