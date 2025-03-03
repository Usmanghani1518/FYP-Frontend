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
            // Check if the user is logged in or not based on cookie
            if (allowedUser === 'logged-in') {
                try {
                    const validationResponse = await backendRequest('GET', '/auth/validate-token');

                    if (validationResponse.success) {
                        setAllowed(true);
                    } else {
                        // If token is invalid or missing, redirect to login
                        navigate("/login");
                    }
                } catch (error) {
                    console.error("Token validation failed:", error);
                    navigate("/login");
                }
            } else if (allowedUser === 'not-logged-in') {
                try {
                    const validationResponse = await backendRequest('GET', '/auth/validate-token');

                    if (!validationResponse.success) {
                        // Allow access if the user is not logged in
                        setAllowed(true);
                    } else {
                        // Redirect to home if the user is already logged in
                        navigate("/");
                    }
                } catch (error) {
                    console.error("Error checking login status:", error);
                    setAllowed(true); // Allow access if the request fails
                }
            }
        };

        checkTokenValidity();
    }, [allowedUser, navigate]);

    if (allowed) return <>{children}</>;
    return null; // Optionally, render a loading spinner or message here
}
