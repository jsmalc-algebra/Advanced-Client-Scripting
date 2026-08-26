import {useTableState} from "../generic/tableStateContext.jsx";
import {getItems, searchItems} from "../../js/functions/getBillItems.js";
import {usePaginatedData} from "../../js/hooks/usePaginatedData.js";
import TableTopRow from "../generic/table-top-row.jsx";
import ItemTable from "./ItemTable.jsx";
import TablePagination from "../generic/TablePagination.jsx";

function ItemsPageContent() {
    const {state, dispatch} = useTableState();
    const { limit, currPage, sortBy, sortOrder, searchMode, searchString } = state;

    const fetchPage = searchMode ? searchItems : getItems;
    const { data: rows, maxPage, loading } = usePaginatedData(
        fetchPage, currPage, limit, sortBy, sortOrder, searchString
    );

    function handleSort(field) {
        dispatch({ type: 'SORT', payload: field });
    }

    function handleSearch(value) {
        dispatch({ type: 'SEARCH', payload: value });
    }

    function handleClearSearch() {
        dispatch({ type: 'CLEAR_SEARCH' });
    }

    function handleLimitChange(newLimit) {
        dispatch({ type: 'SET_LIMIT', payload: newLimit });
    }

    function handlePageChange(newPage) {
        dispatch({ type: 'SET_PAGE', payload: newPage });
    }

    return (
        <>
            <TableTopRow
                limit={limit}
                onLimitChange={handleLimitChange}
                onSearch={handleSearch}
                onClearSearch={handleClearSearch}
            />
            <ItemTable
                rows={rows}
                loading={loading}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
            />
            <TablePagination
                currPage={currPage}
                maxPage={maxPage}
                onPageChange={handlePageChange}
            />
        </>
    )
}

export default ItemsPageContent;