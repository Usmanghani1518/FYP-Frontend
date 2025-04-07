// import { backendRequest } from '@/Helper/backendRequest';
// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import ErrorPage from "@/pages/Error";
// import Loader from '@/Helper/Loader';

// type Role = ('admin' | 'student' | 'teacher')[];

// interface RoleCheckerProps {
//   allowedRoles: ('admin' | 'student' | 'teacher')[];  
//   allowedUser?: 'logged-in' | 'not-logged-in';
//   children: React.ReactNode; 
// }

// interface ResponsePayload {
//   role: string;
//   success: boolean;
// }

// export const RoleChecker = ({ allowedRoles, children, allowedUser }: RoleCheckerProps) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasAccess, setHasAccess] = useState(false);
//   const [userRole, setUserRole] = useState<string | null>(null); // userRole should be string or null
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(false);
//   const [redirect, setRedirect] = useState<string | null>(null); // Add redirect state

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await backendRequest<ResponsePayload>('Get', '/auth/validate-role');

//         if (!response.success) {
//           await backendRequest('GET', '/auth/logout');
//           setRedirect('/login'); // Set redirect to login
//           return;
//         }

//         const role = response.role;
//         const isAuthenticated = response.success;
//         setIsAuthenticated(isAuthenticated);
//         setUserRole(role);

   
//         if (role && allowedRoles.includes(role as Role)) {
//           setHasAccess(true);
//         } else {
//           setHasAccess(false);
//         }
//       } catch (error) {
//         console.error('Error checking role:', error);
//         setHasAccess(false);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserRole();
//   }, [allowedRoles]);

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (allowedUser === 'not-logged-in' && isAuthenticated) {
//     return <Navigate to="/" />;
//   }



//   if (!hasAccess &&  !allowedUser) {
//     return <ErrorPage />;
//   }

//   return <>{children}</>;
// };



import { backendRequest } from '@/Helper/backendRequest';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ErrorPage from "@/pages/Error";
import Loader from '@/Helper/Loader';

type Role = 'admin' | 'student' | 'teacher';

interface RoleCheckerProps {
  allowedRoles: Role[];  
  allowedUser?: 'logged-in' | 'not-logged-in';
  children: React.ReactNode; 
  isHomePage?: boolean;
}

interface ResponsePayload {
  role: string;
  success: boolean;
}

export const RoleChecker = ({ allowedRoles, children, allowedUser, isHomePage = false }: RoleCheckerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await backendRequest<ResponsePayload>('Get', '/auth/validate-role');

        if (response.success) {
          setIsAuthenticated(true);
          setUserRole(response.role as Role);
          
          // Redirect logic for home page only for logged-in users
          if (isHomePage && isAuthenticated) {
            switch(response.role) {
              case 'student':
                navigate('/student');
                break;
              case 'teacher':
                navigate('/teacher/dashboard');
                break;
              case 'admin':
                navigate('/dashboard');
                break;
              default:
                break;
            }
          }
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error checking role:', error);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [isHomePage, navigate, isAuthenticated]);

  if (isLoading) {
    return <Loader />;
  }

  // Handle public routes (login/signup) - only accessible when not logged in
  if (allowedUser === 'not-logged-in') {
    return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
  }

  if (!isHomePage && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // For home page, show to everyone (handled by the Layout component)
  if (isHomePage) {
    return <>{children}</>;
  }

  // Check if user has required role for other protected routes
  const hasAccess = userRole && allowedRoles.includes(userRole);
  
  if (!hasAccess) {
    return <ErrorPage />;
  }

  return <>{children}</>;
};

