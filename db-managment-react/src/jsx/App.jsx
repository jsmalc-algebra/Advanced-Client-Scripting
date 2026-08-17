import AppNavbar from "./app-navbar.jsx";
import BillsPage from "./BillsPage.jsx";
import {useDevLogin} from "../js/hooks/useDevLogin.js";

function App() {
    const {isLoggingIn, loginError} = useDevLogin();

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