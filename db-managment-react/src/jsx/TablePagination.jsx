function TablePagination(){
    return (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <nav aria-label="Users pagination">
                <ul className="pagination pagination-sm mb-0" id="pagination">
                </ul>
            </nav>
        </div>
    );
}

export default TablePagination;