import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect('/');
  }

  return <AdminDashboardClient />;
}
