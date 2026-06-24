import { Metadata } from 'next';
import DashboardPage from './dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function Dashboard() {
  return <DashboardPage />;
}
