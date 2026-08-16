import AppNavbar from "./app-navbar.jsx";
import TableTopRow from "./table-top-row.jsx";
import BillTable from "./bill-table.jsx";

function App() {

  return (
      <div className="card table-card shadow-sm p-4">
        <AppNavbar />
          <TableTopRow/>
          <BillTable/>
      </div>
  );
}

export default App
