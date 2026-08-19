import { FaSort } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa";
import { FaSortUp } from "react-icons/fa";
import { TiEye } from "react-icons/ti";
import { LiaEuroSignSolid } from "react-icons/lia";
import "../css/table_page.css"

function BillTable({rows, loading, sortBy, sortOrder, onSort}) {

    if (loading) {
        return <p>Loading bills...</p>;
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
                    <th className="sortable" data-sort="date" onClick={() => onSort('date')}>
                        Date <span className="sort-icon">{sortIcon('date')}</span>
                    </th>
                    <th className="sortable" data-sort="billNumber" onClick={() => onSort('billNumber')}>
                        Bill Number <span className="sort-icon">{sortIcon('billNumber')}</span>
                    </th>
                    <th className="sortable" data-sort="customer" onClick={() => onSort('customer')}>
                        Customer <span className="sort-icon">{sortIcon('customer')}</span>
                    </th>
                    <th className="sortable" data-sort="seller" onClick={() => onSort('seller')}>
                        Seller <span className="sort-icon">{sortIcon('seller')}</span>
                    </th>
                    <th className="sortable" data-sort="creditCardStatus" onClick={() => onSort('creditCardStatus')}>
                        Credit Card Status <span className="sort-icon">{sortIcon('creditCardStatus')}</span>
                    </th>
                    <th className="sortable" data-sort="comment" onClick={() => onSort('comment')}>
                        Comment <span className="sort-icon">{sortIcon('comment')}</span>
                    </th>
                    <th className="sortable" data-sort="total" onClick={() => onSort('total')}>
                        Total <span className="sort-icon">{sortIcon('total')}</span>
                    </th>
                    <th>Details</th>
                </tr>
                </thead>
                <tbody id="table-body">
                {rows.map((row =>(
                    <tr
                        key={row.id}
                        className={`
                        ${row.cardExpired === "EXPIRED" ? "table-danger" : ""}
                        ${row.cardExpired === "NOT ON RECORD" ? "table-warning" : ""}
                        ${row.cardExpired === "VALID" ? "table-success" : ""}
                        `}
                    >
                        <td>{row.date}</td>
                        <td>{row.billNumber}</td>
                        <td>{row.customerName + " " + row.customerSurname}</td>
                        <td>{row.sellerName + " " + row.sellerSurname}</td>
                        <td>{row.cardExpired}</td>
                        <td>{row.comment}</td>
                        <td>
                            <span  style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                {row.total}
                                <LiaEuroSignSolid />
                            </span>
                        </td>
                        <td>
                            <TiEye />
                        </td>
                    </tr>
                )))}
                </tbody>
            </table>
        </div>
    );
}

export default BillTable;