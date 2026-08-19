import { useEffect, useState } from "react";

export function usePaginatedData(fetchPage, page, limit, sortBy, sortOrder) {
    const [data, setData] = useState([]);
    const [maxPage, setMaxPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        fetchPage(page, limit, sortBy, sortOrder)
            .then(({ items, totalCount }) => {
                if (cancelled) return;
                setData(items);
                console.log("total number of items", totalCount);
                console.log("limit", limit);
                console.log(Math.ceil(totalCount / limit));
                setMaxPage(Math.max(1, Math.ceil(totalCount / limit)));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [page, limit, ...deps]);

    return { data, maxPage, loading };
}