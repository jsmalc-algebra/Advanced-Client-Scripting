import AppNavbar from "./app-navbar.jsx";
import BillsPage from "./BillsPage.jsx";
import {useDevLogin} from "../js/hooks/useDevLogin.js";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import BillsForm from "./billsForm.jsx";

const router = createBrowserRouter([
    {
        path:'/customers/:customerId/bills',
        children: [
            {index: true, element: <BillsPage />},
            {path:'new', element: <BillsForm/>}
        ]
    },
]);

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
            <RouterProvider router={router}/>
        </div>
    );
}

export default App