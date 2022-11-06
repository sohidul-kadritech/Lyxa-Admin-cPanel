import React from "react";
import { Redirect } from "react-router-dom";

// Profile
import UserProfile from "../pages/Authentication/user-profile";

// Pages Calendar
import Calendar from "../pages/Calendar/index";

//Email
import EmailInbox from "../pages/Email/email-inbox";
import EmailRead from "../pages/Email/email-read";
import EmailCompose from "../pages/Email/email-compose";

import Emailtemplatealert from "../pages/EmailTemplate/email-template-alert";
import Emailtemplatebasic from "../pages/EmailTemplate/email-template-basic";
import Emailtemplatebilling from "../pages/EmailTemplate/email-template-billing";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

//  // Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login";
import Login2 from "../pages/AuthenticationInner/Login2";
import Register1 from "../pages/AuthenticationInner/Register";
import Register2 from "../pages/AuthenticationInner/Register2";
import Recoverpw from "../pages/AuthenticationInner/Recoverpw";
import Recoverpw2 from "../pages/AuthenticationInner/Recoverpw2";
import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword";
import LockScreen from "../pages/AuthenticationInner/auth-lock-screen";
import LockScreen2 from "../pages/AuthenticationInner/auth-lock-screen-2";
import ConfirmMail from "../pages/AuthenticationInner/page-confirm-mail";
import ConfirmMail2 from "../pages/AuthenticationInner/page-confirm-mail-2";
import EmailVerification from "../pages/AuthenticationInner/auth-email-verification";
import EmailVerification2 from "../pages/AuthenticationInner/auth-email-verification-2";
import TwostepVerification from "../pages/AuthenticationInner/auth-two-step-verification";
import TwostepVerification2 from "../pages/AuthenticationInner/auth-two-step-verification-2";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
// Charts
import ChartApex from "../pages/Charts/Apexcharts";
import ChartistChart from "../pages/Charts/ChartistChart";
import ChartjsChart from "../pages/Charts/ChartjsChart";
import EChart from "../pages/Charts/EChart";
import SparklineChart from "../pages/Charts/SparklineChart";

// Maps
import MapsGoogle from "../pages/Maps/MapsGoogle";
import MapsVector from "../pages/Maps/MapsVector";
import MapsLeaflet from "../pages/Maps/MapsLeaflet";

//Icons
import IconDripicons from "../pages/Icons/IconDripicons";
import IconMaterialdesign from "../pages/Icons/IconMaterialdesign";
import TypiconsIcon from "../pages/Icons/IconTypicons";
import IconIon from "../pages/Icons/IconIon";
import ThemifyIcon from "../pages/Icons/IconThemify";
import IconFontawesome from "../pages/Icons/IconFontawesome";

//Tables
import BasicTables from "../pages/Tables/BasicTables";
import DatatableTables from "../pages/Tables/DatatableTables";
import ResponsiveTables from "../pages/Tables/ResponsiveTables";
import EditableTables from "../pages/Tables/EditableTables";

// Forms
import FormElements from "../pages/Forms/FormElements";
import FormAdvanced from "../pages/Forms/FormAdvanced";
import FormEditors from "../pages/Forms/FormEditors";
import FormValidations from "../pages/Forms/FormValidations";
import FormMask from "../pages/Forms/FormMask";
import FormRepeater from "../pages/Forms/FormRepeater";
import FormUpload from "../pages/Forms/FormUpload";
import FileUpload from "../pages/Forms/FileUpload";
import FormWizard from "../pages/Forms/FormWizard";
import FormXeditable from "../pages/Forms/FormXeditable";

//Ui
import UiAlert from "../pages/Ui/UiAlert";
import UiButtons from "../pages/Ui/UiButtons";
import UiCards from "../pages/Ui/UiCards";
import UiCarousel from "../pages/Ui/UiCarousel";
import UiColors from "../pages/Ui/UiColors";
import UiDropdown from "../pages/Ui/UiDropdown";
import UiGeneral from "../pages/Ui/UiGeneral";
import UiGrid from "../pages/Ui/UiGrid";
import UiImages from "../pages/Ui/UiImages";
import UiLightbox from "../pages/Ui/UiLightbox";
import UiModal from "../pages/Ui/UiModal";
import UiProgressbar from "../pages/Ui/UiProgressbar";
import UiSweetAlert from "../pages/Ui/UiSweetAlert";
import UiTabsAccordions from "../pages/Ui/UiTabsAccordions";
import UiTypography from "../pages/Ui/UiTypography";
import UiVideo from "../pages/Ui/UiVideo";
import UiSessionTimeout from "../pages/Ui/UiSessionTimeout";
import UiRating from "../pages/Ui/UiRating";
import UiRangeSlider from "../pages/Ui/UiRangeSlider";

//Pages
import PagesStarter from "../pages/Utility/pages-starter";
import PagesMaintenance from "../pages/Utility/pages-maintenance";
import PagesComingsoon from "../pages/Utility/pages-comingsoon";
import PagesTimeline from "../pages/Utility/pages-timeline";
import PagesInvoice from "../pages/Utility/PagesInvoice";
import PagesFaqs from "../pages/Utility/pages-faqs";
import PagesPricing from "../pages/Utility/pages-pricing";
import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";
import PagesGallery from "../pages/Utility/PagesGallery";
import PagesDirectory from "../pages/Utility/PagesDirectory";

// Gallery
import ImageGallery from "../pages/gallery/ImageGallery";
import ImageFolder from "../pages/gallery/ImageFolder";
import BannerPage from "../pages/banner/BannerPage";
import AddBanner from "../pages/banner/AddBanner";
import Texteditor from "../pages/banner/Texteditor";

// User List

import UsersList from "../pages/Users/UsersList/UsersList";

import AdminList from "../pages/AdminControl/Admins/AdminList.js/AdminList";
import CreateAdmin from "../pages/AdminControl/Admins/CreateAdmin/CreateAdmin";
import Role from "../pages/AdminControl/Role/Role";
import UserDetails from "../pages/Users/UserDetails/UserDetails";
import SellerList from "./../pages/Seller/SellerList/SellerList";
import SellerAdd from "./../pages/Seller/SellerAdd/SellerAdd";
import ShopList from "./../pages/Shops/ShopList/ShopList";
import ShopAdd from "./../pages/Shops/ShopAdd/ShopAdd";
import DeliverymanList from "./../pages/Deliveryman/DeliverymanList/DeliverymanList";
import DeliverymanAdd from "./../pages/Deliveryman/DeliverymanAdd/DeliverymanAdd";
import OrdersList from "./../pages/Orders/OrdersList/OrdersList";
import DealsList from "../pages/Deals/DealsList/DealsList";
import DealsAdd from "../pages/Deals/DealsAdd/DealsAdd";
import DropPayList from "../pages/DropPay/DropPayList/DropPayList";
import PercentageSetting from "./../pages/AppWallet/PercentageSetting/PercentageSetting";
import AdminLogHistory from "./../pages/AppWallet/AdminLogHistory/AdminLogHistory";
import SellerTransactions from "./../pages/AppWallet/SellerTransactions/SellerTransactions";
import DeliveryTransactions from "./../pages/AppWallet/DeliveryTransactions/DeliveryTransactions";
import PaymentHistory from "./../pages/AppWallet/PaymentHistory/PaymentHistory";
import Chat from "./../pages/Chat/Chat";
import CategoryList from "./../pages/Categories&Tags/Category/CategoryList/CategoryList";
import CategoryAdd from "./../pages/Categories&Tags/Category/CategoryAdd/CategoryAdd";
import TagsList from "./../pages/Categories&Tags/Tags/TagsList/TagsList";
import TagAdd from "./../pages/Categories&Tags/Tags/TagAdd/TagAdd";
import CategoryDetails from "../pages/Categories&Tags/Category/CategoryDetails/CategoryDetails";
import ProductList from "../pages/Product/ProductList/ProductList";
import ProductAdd from "../pages/Product/ProductAdd/ProductAdd";
import ShopDetails from "../pages/Shops/ShopDetails/ShopDetails";
import SellerDetails from "./../pages/Seller/SellerDetails/SellerDetails";
import DeliverymanDetails from "../pages/Deliveryman/DeliverymanDetails/DeliverymanDetails.js";
import ProductDetails from "../pages/Product/ProductDetails/ProductDetails";
import Cuisine from "../pages/Shops/Cuisine";
import AdminSettings from "../pages/AdminSettings/AdminSettings";
import AppSettings from "../pages/AppSettings/AppSettings";
import UserTransaction from "../pages/Users/UserTransaction/UserTransaction";
import OrderDetails from "../pages/Orders/OrderDetails/OrderDetails";
import ChatDetails from "../pages/Chat/ChatDetails/ChatDetails";
import DropTransactions from "../pages/AppWallet/DropsTansactions/DropTransactions";
import DropTransactionsDetails from "../pages/AppWallet/DropsTansactions/dropTransactionsDetails";
import UnitTypes from "../pages/Product/UnitTypes/UnitTypes";
import CancelReason from "../pages/CancelReason/CancelReason";
import RefusedOrders from "../pages/Orders/RefusedOrders/RefusedOrders";
import SingleDeliveryTransactions from "../pages/AppWallet/DeliveryTransactions/SingleDeliveryTransactions";
import ShopsTransactions from "./../pages/AppWallet/SellerTransactions/ShopsTransactions";
import SingleShopTransactions from "../pages/AppWallet/SellerTransactions/SingleShopTansactions";

import AdminLog from "../pages/AppWallet/PercentageSetting/AdminLog";
import UserTermsAndConditions from "../pages/TermsAndConditons/UserTermsAndConditions";
import ShopTermsAndConditions from "../pages/TermsAndConditons/ShopTermsAndConditions";
import DeliveryTermsAndConditions from "../pages/TermsAndConditons/DeliveryTermsAndConditions";
import Transactions from "../pages/Transactions/Transactions";
import SendNotifications from "../pages/Notifications/SendNotifications";
import NotificationsList from "../pages/Notifications/NotificationsList";
import SellerCredentialsList from "../pages/Seller/SellerCredentials/SellerCredentialsList";
import DefaultChat from "../pages/DefaultChat/DefaultChat";
import ShopCredentialsList from "../pages/Shops/ShopCredentials/ShopCredentialsList";
import Tags from "../pages/Tags/Tags";

const userRoutes = [
  { path: "/dashboard", component: Dashboard },

  { path: "/orders/list", component: OrdersList },
  { path: "/orders/details/:id", component: OrderDetails },
  { path: "/orders/cancel-reason", component: CancelReason },
  { path: "/orders/refused", component: RefusedOrders },

  { path: "/image-gallery", component: PagesGallery },
  { path: "/image-folder", component: ImageFolder },
  // { path: "/image-recycle-bin", component: FileUpload },
  { path: "/image-upload", component: FormUpload },

  // Banner
  { path: "/banner", component: BannerPage },
  { path: "/banner/add", component: AddBanner },
  { path: "/banner/edit/:id", component: AddBanner },
  // { path: "/banner-add", component: Texteditor },

  // Users

  { path: "/users/list", component: UsersList },

  { path: "/users/details/:id", component: UserDetails },
  { path: "/users/transactions/:id", component: UserTransaction },

  // SELLER

  { path: "/seller/list", component: SellerList },
  { path: "/seller/add", component: SellerAdd },
  { path: "/seller/edit/:id", component: SellerAdd },
  { path: "/seller/details/:id", component: SellerDetails },

  // SHOPS

  { path: "/shops/list", component: ShopList },
  { path: "/shops/add", component: ShopAdd },
  { path: "/shops/edit/:id", component: ShopAdd },
  { path: "/shops/details/:id", component: ShopDetails },
  { path: "/shops/cuisines", component: Cuisine },
  { path: "/shops/tags", component: Tags },

  // PRODUCT

  { path: "/products/list", component: ProductList },
  { path: "/products/add", component: ProductAdd },
  { path: "/products/edit/:id", component: ProductAdd },
  { path: "/products/details/:id", component: ProductDetails },
  { path: "/products/unit-types", component: UnitTypes },

  // DELIVERY MAN

  { path: "/deliveryman/list", component: DeliverymanList },
  { path: "/deliveryman/add", component: DeliverymanAdd },
  { path: "/deliveryman/edit/:id", component: DeliverymanAdd },
  { path: "/deliveryman/details/:id", component: DeliverymanDetails },

  // DEALS

  { path: "/deals/list", component: DealsList },
  { path: "/deals/add", component: DealsAdd },
  { path: "/deals/edit/:id", component: DealsAdd },

  // DROP PAY
  { path: "/lyxa-pay", component: DropPayList },

  // APP WALLET

  { path: "/add-wallet/admin-log-history", component: AdminLogHistory },
  { path: "/add-wallet/seller-transactions", component: SellerTransactions },
  {
    path: "/app-wallet/seller/shops-transactions",
    component: ShopsTransactions,
  },
  {
    path: "/add-wallet/shop-transactions",
    component: SingleShopTransactions,
  },
  {
    path: "/add-wallet/delivery-transactions",
    component: DeliveryTransactions,
  },
  {
    path: "/add-wallet/single-delivery-transactions/:id",
    component: SingleDeliveryTransactions,
  },
  { path: "/add-wallet/payments-history", component: PaymentHistory },
  { path: "/add-wallet/drop-transactions", component: DropTransactions },
  {
    path: "/add-wallet/drop-transactions/details/:id",
    component: DropTransactionsDetails,
  },

  { path: "/admin/transactions", component: Transactions },

  // CHAT

  { path: "/customer-support", component: Chat },
  { path: "/customer-support/details/:id", component: ChatDetails },

  // CATEGORIES AND TAGS

  { path: "/categories/list", component: CategoryList },
  // { path: "/categories/add", component: CategoryAdd },
  { path: "/categories/edit/:id", component: CategoryAdd },
  { path: "/category/details/:id", component: CategoryDetails },

  { path: "/tags/list", component: TagsList },
  { path: "/tags/add", component: TagAdd },

  // ADMIN CONTROL

  { path: "/admin/list", component: AdminList },
  { path: "/admin/create", component: CreateAdmin },
  { path: "/admin/edit/:id", component: CreateAdmin },
  { path: "/admin/role", component: Role },

  //  SETTINGS

  { path: "/admin/settings", component: AdminSettings },
  { path: "/app/settings", component: AppSettings },
  { path: "/percentage-setting", component: PercentageSetting },
  { path: "/admin/percentage-settings-history", component: AdminLog },
  { path: "/admin/default-chat-message", component: DefaultChat },

  // TERMS AND CONDTIONS

  { path: "/terms-and-conditions/user-app", component: UserTermsAndConditions },
  { path: "/terms-and-conditions/shop-app", component: ShopTermsAndConditions },
  {
    path: "/terms-and-conditions/delivery-app",
    component: DeliveryTermsAndConditions,
  },

  // NOTIFICATIONS

  { path: "/admin/send-notifications", component: SendNotifications },
  { path: "/admin/notifications/list", component: NotificationsList },



  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];

const customerServiceRoutes = [

  { path: "/orders/list", component: OrdersList },
  { path: "/orders/details/:id", component: OrderDetails },
  { path: "/users/list", component: UsersList },
  { path: "/users/details/:id", component: UserDetails },
  { path: "/seller/list", component: SellerList },
  { path: "/seller/details/:id", component: SellerDetails },
  { path: "/shops/list", component: ShopList },
  { path: "/shops/details/:id", component: ShopDetails },
  { path: "/deliveryman/list", component: DeliverymanList },
  { path: "/deliveryman/details/:id", component: DeliverymanDetails },
  { path: "/deliveryman/add", component: DeliverymanAdd },
  { path: "/drop-pay", component: DropPayList },
  { path: "/customer-support", component: Chat },
  { path: "/customer-support/details/:id", component: ChatDetails },
  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/orders/list" /> },
];

const sellerRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/orders/list", component: OrdersList },
  { path: "/orders/details/:id", component: OrderDetails },
  { path: "/products/list", component: ProductList },
  { path: "/products/add", component: ProductAdd },
  { path: "/products/edit/:id", component: ProductAdd },
  { path: "/products/details/:id", component: ProductDetails },
  { path: "/shops/list", component: ShopList },
  { path: "/shops/add", component: ShopAdd },
  { path: "/shops/edit/:id", component: ShopAdd },
  { path: "/shops/details/:id", component: ShopDetails },
  {
    path: "/app-wallet/seller/shops-transactions",
    component: ShopsTransactions,
  },
  {
    path: "/add-wallet/shop-transactions",
    component: SingleShopTransactions,
  },
  { path: "/seller/credentials/list", component: SellerCredentialsList },
  { path: "/admin/create", component: CreateAdmin },

  { path: "/categories/list", component: CategoryList },
  // { path: "/categories/add", component: CategoryAdd },
  { path: "/categories/edit/:id", component: CategoryAdd },
  { path: "/category/details/:id", component: CategoryDetails },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];


const shopRoutes = [
  { path: "/dashboard", component: Dashboard },

  { path: "/orders/list", component: OrdersList },
  { path: "/orders/details/:id", component: OrderDetails },

  { path: "/shops/list", component: ShopList },
  { path: "/shops/details/:id", component: ShopDetails },

  { path: "/products/list", component: ProductList },
  { path: "/products/add", component: ProductAdd },
  { path: "/products/edit/:id", component: ProductAdd },
  { path: "/products/details/:id", component: ProductDetails },
  {
    path: "/add-wallet/shop-transactions",
    component: SingleShopTransactions,
  },
  { path: "/shop/credentials/list", component: ShopCredentialsList },
  { path: "/admin/create", component: CreateAdmin },

  { path: "/categories/list", component: CategoryList },
  { path: "/categories/add", component: CategoryAdd },
  { path: "/categories/edit/:id", component: CategoryAdd },
  { path: "/category/details/:id", component: CategoryDetails },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];

const authRoutes = [
  // { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },

  { path: "/pages-maintenance", component: PagesMaintenance },
  { path: "/pages-comingsoon", component: PagesComingsoon },
  { path: "/pages-404", component: Pages404 },
  { path: "/pages-500", component: Pages500 },



  // this route should be at the end of all other routes
  // { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> }
];

export { userRoutes, authRoutes, customerServiceRoutes, shopRoutes, sellerRoutes };
