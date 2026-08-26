import {useTableState} from "../generic/tableStateContext.jsx";
import {getItems, searchItems} from "../../js/functions/getBillItems.js";
import {usePaginatedData} from "../../js/hooks/usePaginatedData.js";
import ItemTable from "./ItemTable.jsx";
import ConnectedTableTopRow from "../context-specific/COnnectedTableTopRow.jsx";
import ConnectedTablePagination from "../context-specific/ConnectedTablePagination.jsx";
import {BiPlusCircle} from "react-icons/bi";
import {useNavigate, useParams} from "react-router-dom";

function ItemsPageContent() {
    const {state, dispatch} = useTableState();
    const { limit, currPage, sortBy, sortOrder, searchMode, searchString } = state;
    const navigate = useNavigate();
    const {billId} = useParams();

    const fetchPage = searchMode ? searchItems : getItems;
    const { data: rows, maxPage, loading } = usePaginatedData(
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

    return (
        <>
            <ConnectedTableTopRow
                addButton={
                    <button
                        type={"button"}
                        className="btn btn-primary"
                        style={{display: "flex", alignItems: "center", justifyContent: "center"}}
                        //onClick={() => navigate(`/bills/${billId}/items/new`)}
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
                onSort={(field) => dispatch({ type: 'SORT', payload: field })}
            />
            <ConnectedTablePagination maxPage={maxPage}/>
        </>
    )
}

export default ItemsPageContent;