import { backendRequest } from '@/Helper/backendRequest';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import ErrorPage from "@/pages/Error";

type Role = ('admin' | 'user' | 'teacher')[];

interface RoleCheckerProps {
  allowedRoles: ('admin' | 'user' | 'teacher')[];  
  allowedUser?: 'logged-in' | 'not-logged-in';
  children: React.ReactNode; 
}

interface ResponsePayload {
  role: string;
  success: boolean;
}

export const RoleChecker = ({ allowedRoles, children, allowedUser }: RoleCheckerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null); // userRole should be string or null
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(false);
  const [redirect, setRedirect] = useState<string | null>(null); // Add redirect state

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await backendRequest<ResponsePayload>('Get', '/auth/validate-role');

        if (!response.success) {
          await backendRequest('GET', '/auth/logout');
          setRedirect('/login'); // Set redirect to login
          return;
        }

        const role = response.role;
        const isAuthenticated = response.success;
        setIsAuthenticated(isAuthenticated);
        setUserRole(role);

   
        if (role && allowedRoles.includes(role as Role)) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error checking role:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [allowedRoles]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (allowedUser === 'not-logged-in' && isAuthenticated) {
    return <Navigate to="/" />;
  }



  if (!hasAccess &&  !allowedUser) {
    return <ErrorPage />;
  }

  return <>{children}</>;
};
