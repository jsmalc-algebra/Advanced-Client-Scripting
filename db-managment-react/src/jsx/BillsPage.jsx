import TablePagination from "./TablePagination.jsx";
import TableTopRow from "./table-top-row.jsx";
import BillTable from "./bill-table.jsx";
import {useState} from "react";
import {usePaginatedData} from "../js/hooks/usePaginatedData.js";
import {getBills, searchBills} from "../js/functions/getBills.js";
import {FaSortUp} from "react-icons/fa";

function BillsPage() {
    const [limit, setLimit] = useState(10);
    const [currPage, setCurrPage] = useState(1);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchMode, setSearchMode] = useState(false);
    const [searchString, setSearchString] = useState('');

    const fetchPage = searchMode ? searchBills : getBills;

    const {data:rows, maxPage, loading} = usePaginatedData(fetchPage, currPage, limit, sortBy, sortOrder, searchString);



    function handleSort(field) {
        if (searchMode) {return;}
        if (sortBy !== field) {
            setSortBy(field);
            setSortOrder('asc');
        } else {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        }
    }

    function handleSearch(value) {
        setSearchString(value);
        setSearchMode(true);
        setSortBy(null);
        setSortOrder(null);
        setCurrPage(1);
    }

    function handleClearSearch() {
        setSearchString('');
        setSearchMode(false);
        setCurrPage(1);
    }

    return (
        <>
            <TableTopRow
                limit={limit}
                onLimitChange={(newLimit) =>{
                    setLimit(newLimit);
                    setCurrPage(1);
                }}
                onSearch={handleSearch}
                onClearSearch={handleClearSearch}
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