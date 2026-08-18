export function getPageNumbers(currPage, maxPage) {
    console.log("getPageNumbers", currPage, maxPage);
    const pages = [1];
    if (currPage > 2) pages.push(currPage - 1);
    if (currPage !== 1) pages.push(currPage);
    if (currPage !== maxPage && currPage + 1 !== maxPage) pages.push(currPage + 1);
    if (maxPage !== 1 && currPage !== maxPage) pages.push(maxPage);
    return pages;
}