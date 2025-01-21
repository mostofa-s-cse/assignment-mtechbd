import { BrowserRouter, Route, Routes } from "react-router-dom";
import appRoutes from "../constants/AppRoutes";
import ProtectedPage from "../components/Layouts/ProtectedPage";
import NoPageFound from "../components/Global/NoPageFound";

const RouteWrapper = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {appRoutes.map((route) => {
          const { path, Element, isProtected, isIndexUrl } = route;
          if (isProtected) {
            return (
              <Route key={path}>
                <Route
                  index={isIndexUrl}
                  path={path}
                  element={
                    <ProtectedPage>
                      <Element />
                    </ProtectedPage>
                  }
                />
              </Route>
            );
          } else {
            return (
              <Route key={path}>
                <Route index={isIndexUrl} path={path} element={<Element />} />
              </Route>
            );
          }
        })}
        <Route>
          <Route path="*" element={<NoPageFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouteWrapper;
