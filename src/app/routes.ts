import { createBrowserRouter } from 'react-router';
import AppShell from '@/app/components/AppShell';
import Root from '@/app/components/Root';
import Home from '@/app/components/pages/Home';
import Shop from '@/app/components/pages/Shop';
import Collections from '@/app/components/pages/Collections';
import About from '@/app/components/pages/About';
import AuthenticityPolicy from '@/app/components/pages/AuthenticityPolicy';
import ShippingPolicy from '@/app/components/pages/ShippingPolicy';
import ReturnsPolicy from '@/app/components/pages/ReturnsPolicy';
import ProductDetail from '@/app/components/pages/ProductDetail';
import NotFound from '@/app/components/pages/NotFound';
import SitemapPage from '@/app/components/pages/SitemapPage';
import Login from '@/app/components/pages/Login';
import Register from '@/app/components/pages/Register';
import MagicLinkCallback from '@/app/components/pages/MagicLinkCallback';
import { LegacyEmailConfirmationRedirect, LegacyMagicLinkRedirect } from '@/app/components/pages/LegacyAuthRedirects';
import EmailConfirmationCallback from '@/app/components/pages/EmailConfirmationCallback';
import CartPage from '@/app/components/pages/CartPage';
import Checkout from '@/app/components/pages/Checkout';
import AccountLayout from '@/app/components/pages/AccountLayout';
import Account from '@/app/components/pages/Account';
import OrdersList from '@/app/components/pages/OrdersList';
import OrderDetail from '@/app/components/pages/OrderDetail';
import RequireAdminShell from '@/app/components/admin/RequireAdminShell';
import AdminDashboard from '@/app/components/admin/AdminDashboard';
import AdminProducts from '@/app/components/admin/AdminProducts';
import AdminProductEdit from '@/app/components/admin/AdminProductEdit';
import AdminCategories from '@/app/components/admin/AdminCategories';
import AdminInventory from '@/app/components/admin/AdminInventory';
import AdminApplications from '@/app/components/admin/AdminApplications';
import AdminUsers from '@/app/components/admin/AdminUsers';

export const router = createBrowserRouter([
  {
    Component: AppShell,
    children: [
      {
        path: '/',
        Component: Root,
        children: [
          { index: true, Component: Home },
          { path: 'shop', Component: Shop },
          { path: 'collections', Component: Collections },
          { path: 'about', Component: About },
          { path: 'authenticity', Component: AuthenticityPolicy },
          { path: 'shipping', Component: ShippingPolicy },
          { path: 'returns', Component: ReturnsPolicy },
          { path: 'sitemap', Component: SitemapPage },
          { path: 'product/:id', Component: ProductDetail },
          { path: 'login', Component: Login },
          { path: 'login/auth/magic-link', Component: LegacyMagicLinkRedirect },
          { path: 'login/auth/email-confirmation', Component: LegacyEmailConfirmationRedirect },
          { path: 'register', Component: Register },
          { path: 'auth/magic-link', Component: MagicLinkCallback },
          { path: 'auth/email-confirmation', Component: EmailConfirmationCallback },
          { path: 'cart', Component: CartPage },
          { path: 'checkout', Component: Checkout },
          {
            path: 'account',
            Component: AccountLayout,
            children: [
              { index: true, Component: Account },
              { path: 'orders', Component: OrdersList },
              { path: 'orders/:id', Component: OrderDetail },
            ],
          },
          { path: '*', Component: NotFound },
        ],
      },
      {
        path: '/__admin',
        Component: RequireAdminShell,
        children: [
          { index: true, Component: AdminDashboard },
          { path: 'products', Component: AdminProducts },
          { path: 'products/:id', Component: AdminProductEdit },
          { path: 'categories', Component: AdminCategories },
          { path: 'inventory', Component: AdminInventory },
          { path: 'applications', Component: AdminApplications },
          { path: 'users', Component: AdminUsers },
        ],
      },
    ],
  },
]);
