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
import SellerList from './../pages/Seller/SellerList/SellerList';
import SellerAdd from './../pages/Seller/SellerAdd/SellerAdd';
import ShopList from './../pages/Shops/ShopList/ShopList';
import ShopAdd from './../pages/Shops/ShopAdd/ShopAdd';
import DeliverymanList from './../pages/Deliveryman/DeliverymanList/DeliverymanList';
import DeliverymanAdd from './../pages/Deliveryman/DeliverymanAdd/DeliverymanAdd';
import OrdersList from './../pages/Orders/OrdersList/OrdersList';
import DealsList from "../pages/Deals/DealsList/DealsList";
import DealsAdd from "../pages/Deals/DealsAdd/DealsAdd";
import DropPayList from "../pages/DropPay/DropPayList/DropPayList";
import transactions from './../pages/Transactions/transactions';
import PercentageSetting from './../pages/AppWallet/PercentageSetting/PercentageSetting';
import AdminLogHistory from './../pages/AppWallet/AdminLogHistory/AdminLogHistory';
import SellerTransactions from './../pages/AppWallet/SellerTransactions/SellerTransactions';
import DeliveryTransactions from './../pages/AppWallet/DeliveryTransactions/DeliveryTransactions';
import PaymentHistory from './../pages/AppWallet/PaymentHistory/PaymentHistory';
import Chat from './../pages/Chat/Chat';
import CategoryList from './../pages/Categories&Tags/Category/CategoryList/CategoryList';
import CategoryAdd from './../pages/Categories&Tags/Category/CategoryAdd/CategoryAdd';
import TagsList from './../pages/Categories&Tags/Tags/TagsList/TagsList';
import TagAdd from './../pages/Categories&Tags/Tags/TagAdd/TagAdd';
import CategoryDetails from "../pages/Categories&Tags/Category/CategoryDetails/CategoryDetails";
import ProductList from "../pages/Product/ProductList/ProductList";
import ProductAdd from "../pages/Product/ProductAdd/ProductAdd";


const userRoutes = [
  { path: "/dashboard", component: Dashboard },

  {path:"/orders/list", component: OrdersList},

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

  { path: "/user/details/:id", component: UserDetails },

  // SELLER

  {path: "/seller/list", component: SellerList},
  {path: "/seller/add", component: SellerAdd},
  {path: "/seller/edit/:id", component: SellerAdd},

  // SHOPS

  {path: "/shops/list", component: ShopList},
  {path: "/shops/add", component: ShopAdd},
  {path: "/shops/edit/:id", component: ShopAdd},

  // PRODUCT 

  {path: '/products/list', component: ProductList},
  {path: '/products/add', component: ProductAdd},


  // DELIVERY MAN

  {path: "/deliveryman/list", component: DeliverymanList},
  {path: "/deliveryman/add", component: DeliverymanAdd},

  {path: "/deals/list", component: DealsList},
  {path: "/deals/add", component: DealsAdd},

  // DROP PAY
  {path: "/drop-pay", component: DropPayList},

  // TRANSACTIONS 

  { path: "/transactions",  component:transactions},

  // APP WALLET 

  {path: "/add-wallet/percentage-setting", component: PercentageSetting},
  {path: "/add-wallet/admin-log-history", component: AdminLogHistory},
  {path: "/add-wallet/seller-transactions", component: SellerTransactions},
  {path: "/add-wallet/delivery-transactions", component: DeliveryTransactions},
  {path: "/add-wallet/payments-history", component: PaymentHistory},

  // CHAT

  {path: "/chat", component: Chat},

  // CATEGORIES AND TAGS

  {path: "/categories/list", component: CategoryList},
  {path: "/categories/add", component: CategoryAdd},
  {path: "/categories/edit/:id", component: CategoryAdd},
  {path: "/category/details/:id", component: CategoryDetails},

  {path: "/tags/list", component: TagsList},
  {path: "/tags/add", component: TagAdd},

  // ADMIN CONTROL

  { path: "/admin/list", component: AdminList },
  { path: "/admin/create", component: CreateAdmin },
  { path: "/admin/edit/:id", component: CreateAdmin },
  { path: "/admin/role", component: Role },



  // //calendar
  { path: "/calendar", component: Calendar },

  // //profile
  { path: "/profile", component: UserProfile },

  //Email
  { path: "/email-inbox", component: EmailInbox },
  { path: "/email-read", component: EmailRead },
  { path: "/email-compose", component: EmailCompose },

  // Email Template
  { path: "/email-template-alert", component: Emailtemplatealert },
  { path: "/email-template-basic", component: Emailtemplatebasic },
  { path: "/email-template-billing", component: Emailtemplatebilling },

  //Charts
  { path: "/apex-charts", component: ChartApex },
  { path: "/chartist-charts", component: ChartistChart },
  { path: "/chartjs-charts", component: ChartjsChart },
  { path: "/e-charts", component: EChart },
  { path: "/sparkline-charts", component: SparklineChart },

  // Icons
  { path: "/icons-dripicons", component: IconDripicons },
  { path: "/icons-materialdesign", component: IconMaterialdesign },
  { path: "/icons-fontawesome", component: IconFontawesome },
  { path: "/icons-ion", component: IconIon },
  { path: "/icons-themify", component: ThemifyIcon },
  { path: "/icons-typicons", component: TypiconsIcon },

  // Tables
  { path: "/tables-basic", component: BasicTables },
  { path: "/tables-datatable", component: DatatableTables },
  { path: "/tables-responsive", component: ResponsiveTables },
  { path: "/tables-editable", component: EditableTables },

  // Maps
  { path: "/maps-google", component: MapsGoogle },
  { path: "/maps-vector", component: MapsVector },
  { path: "/maps-leaflet", component: MapsLeaflet },

  // Forms
  { path: "/form-elements", component: FormElements },
  { path: "/form-advanced", component: FormAdvanced },
  { path: "/form-editors", component: FormEditors },
  { path: "/form-mask", component: FormMask },
  { path: "/form-repeater", component: FormRepeater },
  { path: "/form-uploads", component: FormUpload },
  { path: "/form-wizard", component: FormWizard },
  { path: "/form-validation", component: FormValidations },
  { path: "/form-xeditable", component: FormXeditable },

  // Ui
  { path: "/ui-alerts", component: UiAlert },
  { path: "/ui-buttons", component: UiButtons },
  { path: "/ui-cards", component: UiCards },
  { path: "/ui-carousel", component: UiCarousel },
  { path: "/ui-colors", component: UiColors },
  { path: "/ui-dropdowns", component: UiDropdown },
  { path: "/ui-general", component: UiGeneral },
  { path: "/ui-grid", component: UiGrid },
  { path: "/ui-images", component: UiImages },
  { path: "/ui-lightbox", component: UiLightbox },
  { path: "/ui-modals", component: UiModal },
  { path: "/ui-progressbars", component: UiProgressbar },
  { path: "/ui-sweet-alert", component: UiSweetAlert },
  { path: "/ui-tabs-accordions", component: UiTabsAccordions },
  { path: "/ui-typography", component: UiTypography },
  { path: "/ui-video", component: UiVideo },
  { path: "/ui-session-timeout", component: UiSessionTimeout },
  { path: "/ui-rating", component: UiRating },
  { path: "/ui-rangeslider", component: UiRangeSlider },

  //Utility
  { path: "/pages-starter", component: PagesStarter },
  { path: "/pages-timeline", component: PagesTimeline },
  { path: "/pages-invoice", component: PagesInvoice },
  { path: "/pages-directory", component: PagesDirectory },
  { path: "/pages-faqs", component: PagesFaqs },
  { path: "/pages-pricing", component: PagesPricing },
  { path: "/pages-gallery", component: PagesGallery },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];

const authRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },

  { path: "/pages-maintenance", component: PagesMaintenance },
  { path: "/pages-comingsoon", component: PagesComingsoon },
  { path: "/pages-404", component: Pages404 },
  { path: "/pages-500", component: Pages500 },

  // Authentication Inner
  { path: "/pages-login", component: Login1 },
  { path: "/pages-login-2", component: Login2 },
  { path: "/pages-register", component: Register1 },
  { path: "/pages-register-2", component: Register2 },
  { path: "/page-recoverpw", component: Recoverpw },
  { path: "/page-recoverpw-2", component: Recoverpw2 },
  { path: "/pages-forgot-pwd", component: ForgetPwd1 },
  { path: "/auth-lock-screen", component: LockScreen },
  { path: "/auth-lock-screen-2", component: LockScreen2 },
  { path: "/page-confirm-mail", component: ConfirmMail },
  { path: "/page-confirm-mail-2", component: ConfirmMail2 },
  { path: "/auth-email-verification", component: EmailVerification },
  { path: "/auth-email-verification-2", component: EmailVerification2 },
  { path: "/auth-two-step-verification", component: TwostepVerification },
  { path: "/auth-two-step-verification-2", component: TwostepVerification2 },

  // this route should be at the end of all other routes
  // { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> }
];

export { userRoutes, authRoutes };
