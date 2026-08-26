import {useTableState} from "../generic/tableStateContext.jsx";
import {getItems, searchItems} from "../../js/functions/getBillItems.js";
import {usePaginatedData} from "../../js/hooks/usePaginatedData.js";
import ItemTable from "./ItemTable.jsx";
import ConnectedTableTopRow from "../context-specific/COnnectedTableTopRow.jsx";
import ConnectedTablePagination from "../context-specific/ConnectedTablePagination.jsx";
import {BiPlusCircle} from "react-icons/bi";
import {useNavigate, useParams} from "react-router-dom";
import {deleteItem} from "../../js/functions/deleteItem.js";

function ItemsPageContent() {
    const {state, dispatch} = useTableState();
    const { limit, currPage, sortBy, sortOrder, searchMode, searchString } = state;
    const navigate = useNavigate();
    const {billId} = useParams();

    const fetchPage = searchMode ? searchItems : getItems;
    const { data: rows, maxPage, loading,refetch } = usePaginatedData(
        fetchPage, currPage, limit, sortBy, sortOrder, searchString, billId
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

    async function handleDelete(id) {
        const confirm = window.confirm("Are you sure you want to delete this item?");
        if (!confirm) {return;}

        await deleteItem(id)
            .catch((error) => {console.error(error);});
        refetch();

    }

    return (
        <>
            <ConnectedTableTopRow
                limit = {state.limit}
                onLimitChange={(newLimit) => handleLimitChange(newLimit)}
                onSearch={handleSearch}
                onClearSearch={handleClearSearch}
                addButton={
                    <button
                        type={"button"}
                        className="btn btn-primary"
                        style={{display: "flex", alignItems: "center", justifyContent: "center"}}
                        onClick={() => navigate(`/bills/${billId}/items/new`)}
                    >
                    <span  style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        NEW ITEM
                        <BiPlusCircle />
                    </span>
                    </button>
                }
            />
            <ItemTable
                rows={rows}
                loading={loading}
                sortOrder={sortOrder}
                onSort={(field) => handleSort(field)}
                onDelete={handleDelete}
            />
            <ConnectedTablePagination
                currPage = {currPage}
                maxPage={maxPage}
                onPageChange={handlePageChange}
            />
        </>
    )
}

export default ItemsPageContent;