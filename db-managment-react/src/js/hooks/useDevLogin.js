import { useEffect, useState } from "react";
import { devLogin } from "../functions/dev-login.js";

export function useDevLogin() {
    const [isLoggingIn, setIsLoggingIn] = useState(true);
    const [loginError, setLoginError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        devLogin()
            .catch(error => {
                if (error.message === 'Login failed.') {
                    alert("Login failed. Please try again.");
                } else {
                    console.error(error);
                }
                if (isMounted) setLoginError(error);
            })
            .finally(() => {
                if (isMounted) setIsLoggingIn(false);
            });

        return () => { isMounted = false; };
    }, []);

    return { isLoggingIn, loginError };
}