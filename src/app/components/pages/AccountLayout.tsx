import { Outlet } from 'react-router';
import RequireAuth from '@/app/components/auth/RequireAuth';

export default function AccountLayout() {
  return (
    <RequireAuth>
      <Outlet />
    </RequireAuth>
  );
}
