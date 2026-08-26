import {TableStateProvider} from "../generic/tableStateContext.jsx";
import ItemsPageContent from "./ItemsPageContent.jsx";

function ItemsPage() {
    // The "middleman" was made to eliminate components both calling and rendering context
    return (
        <TableStateProvider>
            <ItemsPageContent/>
        </TableStateProvider>
    )
}

export default ItemsPage;