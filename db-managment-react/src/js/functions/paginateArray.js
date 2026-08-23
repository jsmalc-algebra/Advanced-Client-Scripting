export function paginateArray(array, currentPage, limit) {
    const start = (currentPage-1) * limit;
    const end = start + limit;
    return array.slice(start, end);
}