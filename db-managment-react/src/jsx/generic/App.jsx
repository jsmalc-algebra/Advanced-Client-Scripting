import AppNavbar from "./app-navbar.jsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import BillsPage from "../bills/BillsPage.jsx";
import BillsForm from "../bills/billsForm.jsx";
import {useDevLogin} from "../../js/hooks/useDevLogin.js";
import ItemsPage from "../Items/ItemsPage.jsx";
import ItemsForm from "../Items/ItemsForm.jsx";
const router = createBrowserRouter([
    {
        path:'/customers/:customerId/bills',
        children: [
            {index: true, element: <BillsPage />},
            {path:'new', element: <BillsForm/>},
            {path:':id/edit', element: <BillsForm/>},
        ]
    },
    {
        path:'/bills/:billId/items',
        children: [
            {index: true, element: <ItemsPage/>},
            {path:'new', element: <ItemsForm/>},
            {path:':id/edit', element: <ItemsForm/>},
        ]
    }
],
    {
    basename:"/app"
    }
);

function App() {
    /* const {isLoggingIn, loginError} = useDevLogin();

    if (isLoggingIn) {
        return (
            <div className="card table-card shadow-sm p-4">
                <p>Logging in...</p>
            </div>
        );
    }*/

    return (
        <div className="card table-card shadow-sm p-4">
            <AppNavbar />
            <RouterProvider router={router}/>
        </div>
    );
}

export default App