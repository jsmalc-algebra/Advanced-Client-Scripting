import { useEffect, useState } from "react";
import AppNavbar from "./app-navbar.jsx";
import {devLogin} from "../js/functions/dev-login.js";
import BillsPage from "./BillsPage.jsx";

function App() {
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

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoggingIn) {
        return (
            <div className="card table-card shadow-sm p-4">
                <p>Logging in...</p>
            </div>
        );
    }

    return (
        <div className="card table-card shadow-sm p-4">
            <AppNavbar />
            <BillsPage/>
        </div>
    );
}

export default App