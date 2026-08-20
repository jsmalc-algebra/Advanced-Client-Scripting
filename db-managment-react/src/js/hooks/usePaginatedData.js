import { useEffect, useState } from "react";

export function usePaginatedData(fetchPage, page, limit, sortBy, sortOrder, searchString) {
    const [data, setData] = useState([]);
    const [maxPage, setMaxPage] = useState(1);
    const [loading, setLoading] = useState(true);

    console.debug("fetching page: ",fetchPage);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        fetchPage(page, limit, sortBy, sortOrder, searchString)
            .then(({ items, totalCount }) => {
                if (cancelled) return;
                setData(items);
                console.debug("set data: ",items);
                console.log("total number of items", totalCount);
                console.log("limit", limit);
                console.log(Math.ceil(totalCount / limit));
                setMaxPage(Math.max(1, Math.ceil(totalCount / limit)));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [fetchPage, page, limit, sortBy, sortOrder, searchString]);

    return { data, maxPage, loading };
}