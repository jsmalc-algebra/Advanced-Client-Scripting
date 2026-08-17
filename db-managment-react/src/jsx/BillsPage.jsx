import TablePagination from "./TablePagination.jsx";
import TableTopRow from "./table-top-row.jsx";
import BillTable from "./bill-table.jsx";

function BillsPage() {
    return (
        <>
            <TableTopRow/>
            <BillTable/>
            <TablePagination/>
        </>
    );
}

export default BillsPage