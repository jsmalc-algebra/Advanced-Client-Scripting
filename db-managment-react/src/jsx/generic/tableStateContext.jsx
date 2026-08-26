import {createContext, useContext, useReducer} from "react";
import {initialState, tableStateReducer} from "../../js/utils/tableStateReducer.js";

const TableStateContext = createContext(null);

 export function TableStateProvider({ children }) {
     const [state, dispatch] = useReducer(tableStateReducer, initialState);
     return (
         <TableStateContext.Provider value={{state, dispatch}}>
             {children}
         </TableStateContext.Provider>
     );
 }

export function useTableState() {
    const context = useContext(TableStateContext);
    if (!context) throw new Error("useTableState must be used within a TableStateProvider");
    return context;
 }
