import { useEffect, useState } from "react";

export function usePaginatedData(fetchPage, page, limit, sortBy, sortOrder, searchString, Id) {
    const [data, setData] = useState([]);
    const [maxPage, setMaxPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [refreshIndex, setRefreshIndex] = useState(0);

    console.log("usePaginatedDataId", Id)


    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        fetchPage(page, limit, sortBy, sortOrder, searchString, Id)
            .then(({ items, totalCount }) => {
                if (cancelled) return;
                setData(items);
                setMaxPage(Math.max(1, Math.ceil(totalCount / limit)));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [fetchPage, page, limit, sortBy, sortOrder, searchString, refreshIndex]);

    function refetch() {setRefreshIndex(i => i + 1);}

    return { data, maxPage, loading, refetch };
}