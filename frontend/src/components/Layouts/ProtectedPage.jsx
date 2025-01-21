import { SIGNIN } from "../../constants/AppUrls";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedPage = ({ children }) => {
  const location = useLocation();

  const isAuth = useSelector((state) => state.auth.isAuth);

  if (!isAuth) {
    return <Navigate to={SIGNIN} state={{ from: location.pathname }} />;
  } else {
    return children;
  }
};

export default ProtectedPage;
