import {useTableState} from "../generic/tableStateContext.jsx";
import TablePagination from "../generic/TablePagination.jsx";

function ConnectedTablePagination({maxPage}) {
    const {state, dispatch} = useTableState();

    return (
        <TablePagination
            currPage={state.currPage}
            maxPage={maxPage}
            onPageChange={(page) => dispatch({type: "SET_PAGE",payload: page})}
        />
    );
}

export default ConnectedTablePagination;