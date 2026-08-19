import TablePagination from "./TablePagination.jsx";
import TableTopRow from "./table-top-row.jsx";
import BillTable from "./bill-table.jsx";
import {useState} from "react";
import {usePaginatedData} from "../js/hooks/usePaginatedData.js";
import {getBills} from "../js/functions/getBills.js";

function BillsPage() {
    const [limit, setLimit] = useState(10);
    const [currPage, setCurrPage] = useState(1);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    const {data:rows, maxPage, loading} = usePaginatedData(getBills, currPage, limit, sortBy, sortOrder);


    function handleSort(field) {
        if (sortBy !== field) {
            setSortBy(field);
            setSortOrder('asc');
        } else {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        }
    }

    return (
        <>
            <TableTopRow
                limit={limit}
                onLimitChange={(newLimit) =>{
                    setLimit(newLimit);
                    setCurrPage(1);
                }}
            />
            <BillTable
                rows={rows}
                loading={loading}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
            />
            <TablePagination
                currPage = {currPage}
                maxPage = {maxPage}
                onPageChange={setCurrPage}
            />
        </>
    );
}

export default BillsPage