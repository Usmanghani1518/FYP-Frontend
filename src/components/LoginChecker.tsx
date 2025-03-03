import { backendRequest } from "@/Helper/backendRequest";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface LoginCheckerProps {
    children: ReactNode,
    allowedUser: 'logged-in' | 'not-logged-in'
}

export function LoginChecker({ children, allowedUser }: LoginCheckerProps) {
    const [allowed, setAllowed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkTokenValidity = async () => {
          
            if (allowedUser === 'logged-in') {
                try {
                    const validationResponse = await backendRequest('GET', '/auth/validate-token');

                    if (validationResponse.success) {
                        setAllowed(true);
                    } else {
                        await backendRequest('GET', '/auth/logout');
                        
                        navigate("/login");
                    }
                } catch (error) {
                    console.error("Token validation failed:", error);
                    await backendRequest('GET', '/auth/logout');
                    navigate("/login");
                }
            } else if (allowedUser === 'not-logged-in') {
                try {
                    const validationResponse = await backendRequest('GET', '/auth/validate-token');

                    if (!validationResponse.success) {
                     
                        setAllowed(true);
                    } else {
                       
                        navigate("/");
                    }
                } catch (error) {
                    console.error("Error checking login status:", error);
                    setAllowed(true); 
                }
            }
        };

        checkTokenValidity();
    }, [allowedUser, navigate]);

    if (allowed) return <>{children}</>;
    return null; 
}
