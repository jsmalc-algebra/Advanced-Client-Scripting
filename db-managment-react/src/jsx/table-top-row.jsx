import {Button} from "react-bootstrap";

function TableTopRow() {
    return (
        <div className="row g-2 align-items-end mb-4" id="top-row">

            <div className="col-12 col-md-4">
                <label form="searchInput" className="form-label small text-muted mb-1">Search</label>
                <input type="text" id="searchInput" className="form-control form-control-sm" placeholder="Name, email, city..."/>
                <Button type="button" id="search-button" className="btn btn-info btn-sm">Search</Button>
                <Button type="button" id="clear-button" className="btn btn-warning btn-sm">Clear</Button>
            </div>

            <div className="col-6 col-md-3 ms-md-auto">
                <label form="pageSize" className="form-label small text-muted mb-1">Rows per page</label>
                <select id="pageSize" className="form-select form-select-sm" defaultValue={"10"}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
        </div>
    );
}

export default TableTopRow;