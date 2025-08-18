import React from 'react';
import { User } from '../types';
import { Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: User['role'][];
  user: User;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  user,
  fallback
}) => {
  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this section. Please contact your administrator if you believe this is an error.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-yellow-800">Required Role</p>
                  <p className="text-sm text-yellow-700">
                    {allowedRoles.length === 1 
                      ? `You need ${allowedRoles[0]} access`
                      : `You need one of: ${allowedRoles.join(', ')}`
                    }
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your current role: <span className="font-medium">{user.role}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 