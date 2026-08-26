import {getPageNumbers} from "../../js/functions/getPageNumbers.js";


function TablePagination({ currPage, maxPage, onPageChange }){
    const pageNumbers = getPageNumbers(currPage, maxPage);

    return (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <nav aria-label="Users pagination">
                <ul className="pagination pagination-sm mb-0" id="pagination">
                    <li className={`
                    page-item page-number
                    ${currPage === 1 ? "disabled" : ""}
                    `}>
                        <button onClick={() => onPageChange(currPage - 1)} disabled={currPage === 1} className={'page-link'}>
                            Prev
                        </button>
                    </li>
                    {pageNumbers.map(num => (
                        <li key={num} className={`
                        ${num === currPage ? "active" : ""}
                        page-item page-number
                        `}>
                            <button onClick={() => onPageChange(num)} className={`page-link`}>{num}</button>
                        </li>
                    ))}
                    <li className={`
                    ${currPage === maxPage ? "disabled" : ""}
                    page-item page-number
                    `}>
                        <button onClick={() => onPageChange(currPage + 1)} disabled={currPage === maxPage} className={`page-link`}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default TablePagination;