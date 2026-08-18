import TablePagination from "./TablePagination.jsx";
import TableTopRow from "./table-top-row.jsx";
import BillTable from "./bill-table.jsx";
import {useState} from "react";
import {usePaginatedData} from "../js/hooks/usePaginatedData.js";
import {getBills} from "../js/functions/getBills.js";

function BillsPage() {
    const [limit, setLimit] = useState(10);
    const [currPage, setCurrPage] = useState(1);

    const {data:rows, maxPage, loading} = usePaginatedData(getBills, currPage, limit);


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