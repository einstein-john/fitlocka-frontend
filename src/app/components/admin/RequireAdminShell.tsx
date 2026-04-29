import { Outlet } from 'react-router';
import RequireAdmin from '@/app/components/auth/RequireAdmin';
import AdminLayout from '@/app/components/admin/AdminLayout';

export default function RequireAdminShell() {
  return (
    <RequireAdmin>
      <AdminLayout />
    </RequireAdmin>
  );
}
