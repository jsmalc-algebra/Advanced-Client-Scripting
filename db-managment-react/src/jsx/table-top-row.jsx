import {Button} from "react-bootstrap";
import {useState} from "react";
import { BiPlusCircle } from "react-icons/bi";
import {useNavigate, useParams} from "react-router-dom";

function TableTopRow({limit, onLimitChange, onSearch, onClearSearch}) {
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();
    const {customerId} = useParams();

    function handleSearchClick() {
        onSearch(searchInput);
    }

    function handleClearClick() {
        setSearchInput('');
        onClearSearch();
    }

    return (
        <div className="row g-2 align-items-end mb-4" id="top-row">

            <div className="col-12 col-md-4">
                <label form="searchInput" className="form-label small text-muted mb-1">Search</label>
                <input
                    type="text"
                    id="searchInput"
                    className="form-control form-control-sm"
                    placeholder="Name, email, city..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                />
                <Button type="button" id="search-button" className="btn btn-info btn-sm"
                        onClick={handleSearchClick}>Search</Button>
                <Button type="button" id="clear-button" className="btn btn-warning btn-sm"
                        onClick={handleClearClick}>Clear</Button>
            </div>

            <div className="col-6 col-md-3 ms-md-auto">
                <label form="pageSize" className="form-label small text-muted mb-1">Rows per page</label>
                <select id="pageSize" className="form-select form-select-sm" defaultValue={limit}
                        onChange={
                            (event) => onLimitChange(Number(event.target.value))
                        }>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div>
                <button
                    type={"button"}
                    className="btn btn-primary"
                    style={{display: "flex", alignItems: "center", justifyContent: "center"}}
                    onClick={() => navigate(`/customers/${customerId}/bills/new`)}
                >
                    <span  style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        NEW BILL
                        <BiPlusCircle />
                    </span>
                </button>
            </div>
        </div>
    );
}

export default TableTopRow;