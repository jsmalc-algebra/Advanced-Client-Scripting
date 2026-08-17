import {getPageNumbers} from "../js/functions/getPageNumbers.js";

function TablePagination({ currPage, maxPage, onPageChange }){
    const pageNumbers = getPageNumbers(currPage, maxPage);

    return (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <nav aria-label="Users pagination">
                <ul className="pagination pagination-sm mb-0" id="pagination">
                    <li className={currPage === 1 ? "disabled" : ""}>
                        <button onClick={() => onPageChange(currPage - 1)} disabled={currPage === 1}>
                            Prev
                        </button>
                    </li>
                    {pageNumbers.map(num => (
                        <li key={num} className={num === currPage ? "active" : ""}>
                            <button onClick={() => onPageChange(num)}>{num}</button>
                        </li>
                    ))}
                    <li className={currPage === maxPage ? "disabled" : ""}>
                        <button onClick={() => onPageChange(currPage + 1)} disabled={currPage === maxPage}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default TablePagination;