import { useEffect, useState } from "react";

export function usePaginatedData(fetchPage, page, limit, deps = []) {
    const [data, setData] = useState([]);
    const [maxPage, setMaxPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        fetchPage(page, limit)
            .then(({ items, totalCount }) => {
                if (cancelled) return;
                setData(items);
                setMaxPage(Math.max(1, Math.ceil(totalCount / limit)));
                setError(null);
            })
            .catch(err => {
                if (!cancelled) setError(err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [page, limit, ...deps]);

    return { data, maxPage, loading, error };
}