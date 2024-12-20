import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import withSuspense from "../hooks/HOC/withSuspense";
import App from "../App";
import AuthenticationLayout from "../layout/AuthenticationLayout";
import AdminAuthenticationLayout from "../layout/admin/AdminAuthenticationLayout";
import SellerAuthLayout from "../layout/seller";
import AdminAuthLayout from "../layout/admin";
import withSuspenseNonFallback from "../hooks/HOC/withSuspenseNonFallback";
import PrivateRouteSeller from "../components/authentication/PrivateRouteSeller";
import { CheckoutProvider } from "../providers/CheckoutProvider";
import { MessagesProvider } from "../providers/MessagesProvider";
import { SupportMessageProvider } from "../providers/SupportMessagesProvider";
const TopSellingSubCategoriesPage = withSuspense(
  lazy(() =>
    import("../pages/buyer/sub-categories/TopSellingSubCategoriesPage")
  )
);

const FlashSalePage = withSuspense(
  lazy(() => import("../pages/buyer/flash-sales/FlashSalePage"))
);
const WalletResult = withSuspense(
  lazy(() => import("../pages/buyer/user-pages/my-account/WalletResult"))
);
const CheckoutResult = withSuspense(
  lazy(() => import("../pages/buyer/cart-pages/CheckoutResult"))
);
const AccountSetting = withSuspense(
  lazy(() => import("../pages/buyer/user-pages/my-account/AccountSetting"))
);
const CartPage = withSuspense(
  lazy(() => import("../pages/buyer/cart-pages/CartPage"))
);

const AuthLayout = withSuspenseNonFallback(lazy(() => import("../layout")));
const Categories = withSuspense(
  lazy(() => import("../pages/buyer/product-pages/Categories"))
);
const WorkingProducts = withSuspense(
  lazy(() => import("../pages/seller/product_management/WorkingProducts"))
);
const NotWorkingProduct = withSuspense(
  lazy(() => import("../pages/seller/product_management/NotWorkingProduct"))
);

const Home = withSuspense(lazy(() => import("../pages/Home")));
const DetailsProduct = withSuspense(
  lazy(() => import("../pages/buyer/product-pages/DetailsProduct"))
);
const BuyerLogin = withSuspense(
  lazy(() => import("../pages/buyer/user-pages/BuyerLogin"))
);
const BuyerRegister = withSuspense(
  lazy(() => import("../pages/buyer/user-pages/BuyerRegister"))
);
const SellerLogin = withSuspense(
  lazy(() => import("../pages/seller/SellerLogin"))
);
const SellerRegister = withSuspense(
  lazy(() => import("../pages/seller/SellerRegister"))
);
const AdminLogin = withSuspense(
  lazy(() => import("../pages/admin/AdminLogin"))
);
const AdminDashboard = withSuspense(
  lazy(() => import("../pages/admin/AdminDashboard"))
);
const AddProductCategory = withSuspense(
  lazy(() => import("../pages/admin/category_management/AddProductCategory"))
);
const AddSaleEvent = withSuspense(
  lazy(() => import("../pages/admin/event_management/AddSaleEvent"))
);
const AddDiscountVoucher = withSuspense(
  lazy(() => import("../pages/admin/event_management/AddDiscountVoucher"))
);
const AllUserAccount = withSuspense(
  lazy(() => import("../pages/admin/user_management/AllUserAccount"))
);
const AllRole = withSuspense(
  lazy(() => import("../pages/admin/user_management/AllRole"))
);
const AllViolation = withSuspense(
  lazy(() => import("../pages/admin/user_management/AllViolation"))
);
const AllShopViolaiton = withSuspense(
  lazy(() => import("../pages/admin/shop_management/AllShopViolaiton"))
);
const AllShop = withSuspense(
  lazy(() => import("../pages/admin/shop_management/AllShop"))
);
const AllFlashSale = withSuspense(
  lazy(() => import("../pages/admin/flashsale_management/AllFlashSale"))
);
const AllRequest = withSuspense(
  lazy(() => import("../pages/admin/request_support/AllRequest"))
);
const RevenueStatistic = withSuspense(
  lazy(() => import("../pages/admin/statistics/RevenueStatistic"))
);
const AdminAccountSetting = withSuspense(
  lazy(() => import("../pages/admin/my-account/AdminAccountSetting"))
);
const SellerHome = withSuspense(
  lazy(() => import("../pages/seller/SellerHome"))
);

const SellerSetup = withSuspense(
  lazy(() => import("../pages/seller/SellerSetup"))
);
const SellerEditProfileBasic = withSuspense(
  lazy(() => import("../pages/profile/SellerEditProfileBasic"))
);
const SellerEditProfileTax = withSuspense(
  lazy(() => import("../pages/profile/SellerEditProfileTax"))
);
const SuggestProduct = withSuspense(
  lazy(() => import("../pages/buyer/product-pages/SuggestProduct"))
);
const ShopOrders = withSuspense(
  lazy(() => import("../pages/seller/orders/ShopOrders"))
);
const AllProduct = withSuspense(
  lazy(() => import("../pages/seller/product_management/AllProduct"))
);
const AddProduct = withSuspense(
  lazy(() => import("../pages/seller/product_management/AddProduct"))
);
const EditProduct = withSuspense(
  lazy(() => import("../pages/seller/product_management/EditProduct"))
);
const SearchPage = withSuspense(
  lazy(() => import("../pages/buyer/product-pages/SearchPage"))
);
const SearchShop = withSuspense(
  lazy(() => import("../pages/buyer/shop-pages/ShopSearchPage"))
);

const ShopDetails = withSuspense(
  lazy(() => import("../pages/buyer/shop-pages/ShopDetails"))
);
const ShopRecommendations = withSuspense(
  lazy(() => import("../pages/buyer/shop-pages/ShopRecommendations"))
);
const CheckoutPage = withSuspense(
  lazy(() => import("../pages/buyer/cart-pages/CheckoutPage"))
);

const OrdersReturn = withSuspense(
  lazy(() => import("../pages/seller/orders/OrdersReturn"))
);

const OrderCancel = withSuspense(
  lazy(() => import("../pages/seller/orders/OrderCancel"))
);

const CustomShop = withSuspense(
  lazy(() => import("../pages/seller/custom_shop/CustomShop"))
)

const SalesRevenue = withSuspense(
  lazy(() => import("../pages/seller/statistics/SalesRevenue"))
)

const ShopWallet = withSuspense(
  lazy(() => import("../pages/seller/wallet/ShopWallet"))
)

const ShopUpdateOTP = withSuspense(
  lazy(() => import("../pages/seller/wallet/ShopUpdateOTP"))
)

const ShopNotifications = withSuspense(
  lazy(() => import("../pages/seller/notification/ShopNotifications"))
)

const ShopChangePassword = withSuspense(
  lazy(() => import("../pages/seller/custom_shop/ShopChangePassword"))
)
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MessagesProvider>
        <SupportMessageProvider>
          <App />
        </SupportMessageProvider>
      </MessagesProvider>
    ),
    children: [
      {
        path: "",
        element: (
          <AuthLayout>
            <Home />
          </AuthLayout>
        ),
      },
      //Buyer
      //AccountSettings
      {
        path: "user",
        element: (
          <AuthLayout>
            <AccountSetting />
          </AuthLayout>
        ),
        children: [
          {
            path: "account",
            element: (
              <AuthLayout>
                <AccountSetting />
              </AuthLayout>
            ),
          },
          {
            path: "purchase",
            element: (
              <AuthLayout>
                <AccountSetting />
              </AuthLayout>
            ),
            children: [
              {
                path: "order/:order_id",
                element: (
                  <AuthLayout>
                    <AccountSetting />
                  </AuthLayout>
                ),
              },
            ],
          },
          {
            path: "notification",
            element: (
              <AuthLayout>
                <AccountSetting />
              </AuthLayout>
            ),
          },
          {
            path: "ezy-wallet",
            element: (
              <AuthLayout>
                <AccountSetting />
              </AuthLayout>
            ),
          },
        ],
      },
      {
        path: "ezy-wallet/deposit",
        element: (
          <AuthLayout>
            <WalletResult />
          </AuthLayout>
        ),
      },
      //login && register
      {
        path: "buyer/login",
        element: (
          <AuthLayout>
            <BuyerLogin />
          </AuthLayout>
        ),
      },
      {
        path: "buyer/register",
        element: (
          <AuthLayout>
            <BuyerRegister />
          </AuthLayout>
        ),
      },
      // Product & Category
      {
        path: "/product-details/:id",
        element: (
          <AuthLayout>
            <DetailsProduct />
            {/* <LoadingPage /> */}
          </AuthLayout>
        ),
      },
      {
        path: "/suggest-products",
        element: (
          <AuthLayout>
            <SuggestProduct />
          </AuthLayout>
        ),
      },
      {
        path: "/categories/:cat_id",
        element: (
          <AuthLayout>
            <Categories />
          </AuthLayout>
        ),
      },
      {
        path: "/top-products",
        element: (
          <AuthLayout>
            <TopSellingSubCategoriesPage />
          </AuthLayout>
        ),
      },
      {
        path: "/search",
        element: (
          <AuthLayout>
            <SearchPage />
          </AuthLayout>
        ),
      },
      // Shops
      {
        path: "/search_shop",
        element: (
          <AuthLayout>
            <SearchShop />
          </AuthLayout>
        ),
      },
      {
        path: "/shop/:shop_username",
        element: (
          <AuthLayout>
            <ShopDetails />
          </AuthLayout>
        ),
      },
      {
        path: "/shop/shop_recommendations/:shop_id",
        element: (
          <AuthLayout>
            <ShopRecommendations />
          </AuthLayout>
        ),
      },
      //Cart
      {
        path: "/cart",
        element: (
          <AuthLayout>
            <CartPage />
          </AuthLayout>
        ),
      },
      {
        path: "/cart/checkout",
        element: (
          <AuthLayout>
            <CheckoutProvider>
              <CheckoutPage />
            </CheckoutProvider>
          </AuthLayout>
        ),
      },
      {
        path: "/cart/checkout/result",
        element: (
          <AuthLayout>
            <CheckoutResult />
          </AuthLayout>
        ),
      },
      {
        path: "/flash-sale",
        element: (
          <AuthLayout>
            <FlashSalePage />
          </AuthLayout>
        ),
      },

      //Seller
      //login && register
      {
        path: "seller",
        element: (
          <SellerAuthLayout>
            <SellerHome />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/seller-setup",
        element: (
          <SellerAuthLayout>
            <SellerSetup />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/seller-edit-profile",
        element: (
          <SellerAuthLayout>
            <SellerEditProfileBasic />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/seller-edit-profile/tax-info",
        element: (
          <SellerAuthLayout>
            <SellerEditProfileTax />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/login",
        element: (
          <AuthenticationLayout>
            <SellerLogin />
          </AuthenticationLayout>
        ),
      },
      {
        path: "seller/register",
        element: (
          <AuthenticationLayout>
            <SellerRegister />
          </AuthenticationLayout>
        ),
      },
      //seller/order
      {
        path: "seller/order/shop-orders",
        element: (
          <SellerAuthLayout>
            <ShopOrders />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/order/orders-return",
        element: (
          <SellerAuthLayout>
            <OrdersReturn />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/order/orders-cancel",
        element: (
          <SellerAuthLayout>
            <OrderCancel />
          </SellerAuthLayout>
        ),
      },
      //seller/order
      {
        path: "seller/product-management/all",
        element: (
          <SellerAuthLayout>
            <AllProduct />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/product-management/working-products",
        element: (
          <SellerAuthLayout>
            <WorkingProducts />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/product-management/notworking-products",
        element: (
          <SellerAuthLayout>
            <NotWorkingProduct />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/product-management/add-product",
        element: (
          <SellerAuthLayout>
            <AddProduct />
          </SellerAuthLayout>
        ),
      },
      {
        path: `seller/product-management/edit-product/:product_id`,
        element: (
          <SellerAuthLayout>
            <EditProduct />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/customize-shop",
        element: (
          <SellerAuthLayout>
            <CustomShop />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/statistic/sales-revenue",
        element: (
          <SellerAuthLayout>
            <SalesRevenue />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/wallet/shop-wallet",
        element: (
          <SellerAuthLayout>
            <ShopWallet />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/account",
        element: (
          <SellerAuthLayout>
            <ShopUpdateOTP />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/shop-change-password",
        element: (
          <SellerAuthLayout>
            <ShopChangePassword />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/notification",
        element: (
          <SellerAuthLayout>
            <ShopNotifications />
          </SellerAuthLayout>
        ),
      },
      //Admin
      //login && dashboard
      {
        path: "admin/login",
        element: (
          <AdminAuthenticationLayout>
            <AdminLogin />
          </AdminAuthenticationLayout>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <AdminAuthLayout>
            <AdminDashboard />
          </AdminAuthLayout>
        ),
      },
      {
        path: "admin",
        element: (
          <AdminAuthLayout>
            <AdminAccountSetting />
          </AdminAuthLayout>
        ),
        children: [
          {
            path: "account",
            element: (
              <AdminAuthLayout>
                <AdminAccountSetting />
              </AdminAuthLayout>
            ),
          },
        ],
      },
      {
        path: "admin/category-management/product-category/main-category",
        element: (
          <AdminAuthLayout>
            <AddProductCategory />
          </AdminAuthLayout>
        ),
      },
      {
        path: "/admin/event-management/sale-event/event",
        element: (
          <AdminAuthLayout>
            <AddSaleEvent />
          </AdminAuthLayout>
        ),
      },
      {
        path: "/admin/event-management/sale-event/discount-voucher",
        element: (
          <AdminAuthLayout>
            <AddDiscountVoucher />
          </AdminAuthLayout>
        ),
      },
      {
        path: "/admin/user-management/all-user",
        element: (
          <AdminAuthLayout>
            <AllUserAccount />
          </AdminAuthLayout>
        ),
      },
      {
        path: "/admin/user-management/roles",
        element: (
          <AdminAuthLayout>
            <AllRole />
          </AdminAuthLayout>
        ),
      },
      {
        path: "/admin/user-management/violation",
        element: (
          <AdminAuthLayout>
            <AllViolation />
          </AdminAuthLayout>
        ),
      },
      {
        path: "/admin/shop-management/all-shop",
        element: (
          <AdminAuthLayout>
            <AllShop />
          </AdminAuthLayout>
        ),
      },
      {
        path: "/admin/shop-management/all-shop-violation",
        element: (
          <AdminAuthLayout>
            <AllShopViolaiton />
          </AdminAuthLayout>
        ),
      },
      {
        path: "/admin/flash-sale/all-flash-sale",
        element: (
          <AdminAuthLayout>
            <AllFlashSale />
          </AdminAuthLayout>
        ),
      },
      {
        path: "/admin/support/all",
        element: (
          <AdminAuthLayout>
            <AllRequest />
          </AdminAuthLayout>
        ),
      },
      {
        path: "/admin/statistic/revenue",
        element: (
          <AdminAuthLayout>
            <RevenueStatistic />
          </AdminAuthLayout>
        ),

      },
      {
        path: "/admin/my-account",
        element: (
          <AdminAuthLayout>
            <AdminAccountSetting />
          </AdminAuthLayout>
        ),
      }
    ],
  },
]);

export default router;
