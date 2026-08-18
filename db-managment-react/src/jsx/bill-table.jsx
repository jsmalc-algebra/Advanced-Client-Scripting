import { FaSort } from "react-icons/fa6";
import {useEffect, useState} from "react";
import {getBills} from "../js/functions/getBills";
import { LiaEuroSignSolid } from "react-icons/lia";
import "../css/table_page.css"

function BillTable({rows, loading}) {

    if (loading) {
        return <p>Loading bills...</p>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle table-bordered">
                <thead className="table-light" id="sorting-head">
                <tr id="table-head-row">
                    <th className="sortable" data-sort="date">Date</th>
                    <th className="sortable" data-sort="billNumber">Bill Number <span className="sort-icon"><FaSort/></span></th>
                    <th className="sortable" data-sort="customer">Customer <span className="sort-icon"><FaSort/></span></th>
                    <th className="sortable" data-sort="seller">Seller <span className="sort-icon"><FaSort/></span></th>
                    <th className="sortable" data-sort="creditCardStatus">Credit Card Status <span className="sort-icon"><FaSort/></span></th>
                    <th className="sortable" data-sort="comment">Comment <span className="sort-icon"><FaSort/></span></th>
                    <th className="sortable" data-sort="total">Total <span className="sort-icon"><FaSort/></span></th>
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
                    </tr>
                )))}
                </tbody>
            </table>
        </div>
    );
}

export default BillTable;