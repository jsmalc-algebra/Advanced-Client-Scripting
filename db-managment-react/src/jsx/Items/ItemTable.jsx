import {useNavigate, useParams} from "react-router-dom";
import {FaSort} from "react-icons/fa6";
import {FaSortDown, FaSortUp} from "react-icons/fa";

function ItemTable({rows, loading, sortBy, sortOrder, onSort}) {
    const navigate = useNavigate();
    const {billId} = useParams();

    if (loading) {
        return <p>Loading bills...</p>;
    }

    function sortIcon(field) {
        if (sortBy !== field) {return <FaSort/>;}
        else if (sortOrder === 'desc') {return <FaSortUp/>}
        else {return <FaSortDown/>;}
    }
}

export default ItemTable;