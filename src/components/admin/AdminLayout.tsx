import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import { Loader2 } from 'lucide-react';

const AdminLayout = () => {
  const { user, loading, isStaff } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {!isStaff && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent rounded-lg">
              <p className="text-sm text-accent-foreground">
                <strong>Pending Role Assignment:</strong> Your account is active but no role has been assigned yet. 
                Please contact an administrator to get access to ERP features.
              </p>
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
