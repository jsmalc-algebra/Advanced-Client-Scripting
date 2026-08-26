import { FaSort } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa";
import { FaSortUp } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { LiaEuroSignSolid } from "react-icons/lia";
import "../../table_page.css"
import {useNavigate, useParams} from "react-router-dom";

function ItemTable({rows, loading, sortBy, sortOrder, onSort, onDelete}) {

    const navigate = useNavigate();
    const {billId} = useParams();

    if (loading) {
        return <p>Loading items...</p>;
    }

    function sortIcon(field) {
        if (sortBy !== field) {return <FaSort/>;}
        else if (sortOrder === 'desc') {return <FaSortUp/>}
        else {return <FaSortDown/>;}
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle table-bordered">
                <thead className="table-light" id="sorting-head">
                <tr id="table-head-row">
                    <th className="sortable" data-sort="billNumber" onClick={() => onSort('billNumber')}>
                        Bill Number <span className="sort-icon">{sortIcon('billNumber')}</span>
                    </th>
                    <th className="sortable" data-sort="productName" onClick={() => onSort('productName')}>
                        Product Name <span className="sort-icon">{sortIcon('productName')}</span>
                    </th>
                    <th className="sortable" data-sort="category" onClick={() => onSort('category')}>
                        Category <span className="sort-icon">{sortIcon('category')}</span>
                    </th>
                    <th className="sortable" data-sort="productColor" onClick={() => onSort('productColor')}>
                        Color <span className="sort-icon">{sortIcon('productColor')}</span>
                    </th>
                    <th className="sortable" data-sort="quantity" onClick={() => onSort('quantity')}>
                        Quantity <span className="sort-icon">{sortIcon('quantity')}</span>
                    </th>
                    <th className="sortable" data-sort="productPrice" onClick={() => onSort('productPrice')}>
                        Product Price <span className="sort-icon">{sortIcon('productPrice')}</span>
                    </th>
                    <th className="sortable" data-sort="totalPrice" onClick={() => onSort('totalPrice')}>
                        Total Price <span className="sort-icon">{sortIcon('totalPrice')}</span>
                    </th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody id="table-body">
                {rows.map((row => (
                    <tr key={row.id}>
                        <td>{row.billNumber}</td>
                        <td>{row.productName}</td>
                        <td>{row.category}</td>
                        <td>{row.productColor}</td>
                        <td>{row.quantity}</td>
                        <td>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                {row.productPrice}
                                <LiaEuroSignSolid />
                            </span>
                        </td>
                        <td>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                {row.totalPrice}
                                <LiaEuroSignSolid />
                            </span>
                        </td>
                        <td>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => navigate(`/bills/${billId}/items/${row.id}/edit`)}
                            >
                                <FaRegEdit />
                            </button>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => onDelete(row.id)}
                            >
                                <FaRegTrashCan />
                            </button>
                        </td>
                    </tr>
                )))}
                </tbody>
            </table>
        </div>
    );
}

export default ItemTable;