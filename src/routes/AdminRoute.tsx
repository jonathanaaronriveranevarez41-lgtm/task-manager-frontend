import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export function AdminRoute() {
  const { status, user } = useAuth();

  if (status === 'checking') {
    return (
      <p className="request-status" role="status">
        Validando privilegios de administrador...
      </p>
    );
  }

  if (
    status !== 'authenticated' ||
    user?.role !== 'admin'
  ) {
    return (
      <Navigate to="/tasks" replace />
    );
  }

  return <Outlet />;
}