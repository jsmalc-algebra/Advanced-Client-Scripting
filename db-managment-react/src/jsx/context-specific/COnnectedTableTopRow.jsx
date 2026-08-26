import {useTableState} from "../generic/tableStateContext.jsx";
import TableTopRow from "../generic/table-top-row.jsx";

function ConnectedTableTopRow() {
    const {state, dispatch} = useTableState();

    return (
        <TableTopRow
            limit={state.limit}
            onLimitChange={(newLimit) => dispatch({ type: 'SET_LIMIT', payload: newLimit })}
            onSearch={(value) => dispatch({ type: 'SEARCH', payload: value })}
            onClearSearch={() => dispatch({ type: 'CLEAR_SEARCH' })}
        />
    );
}

export default ConnectedTableTopRow