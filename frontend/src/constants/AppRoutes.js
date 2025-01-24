import SignIn from "../pages/Auth/SignIn";
import Dashboard from "../pages/Dashboard/Dashboard";
import OrderManagement from "../pages/OrderManagement/OrderManagement";
import ProductList from "../pages/Products/ProductList";
import PromotionList from "../pages/Promotion/PromotionList";
import * as urls from "./AppUrls";

const route = [
  //UNPROTECTED ROUTES
  {
    path: urls.SIGNIN,
    Element: SignIn,
    isIndexUrl: true,
    isProtected: false,
  },
  //PROTECTED ROUTES
  {
    path: urls.DASHBOARD,
    Element: Dashboard,
    isIndexUrl: false,
    isProtected: true,
  },

  {
    path: urls.PRODUCTS,
    Element: ProductList,
    isIndexUrl: false,
    isProtected: true,
  },

  {
    path: urls.PROMOTION,
    Element: PromotionList,
    isIndexUrl: false,
    isProtected: true,
  },
  {
    path: urls.ORDER,
    Element: OrderManagement,
    isIndexUrl: false,
    isProtected: true,
  },
];

export default route;
