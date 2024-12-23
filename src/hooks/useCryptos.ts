import { useEffect, useState, useCallback } from "react";

interface Crypto {
    id: string;
    name: string;
    symbol: string;
    priceUsd: string;
    changePercent24Hr: string;
}

const useCryptos = () => {
    // state
    const [cryptos, setCryptos] = useState<Crypto[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // get cryptos data
    const getCryptos = useCallback(async (page: number) => {
        const limit = 10;
        const offset = (page - 1) * limit;

        try {
            const response = await fetch(
                `https://api.coincap.io/v2/assets?limit=${limit}&offset=${offset}`
            );
            const data = await response.json();

            if (data?.data?.length === 0) {
                setHasMore(false);
            } else {
                setCryptos((prev) => [...prev, ...data.data]);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }, []);

    // get cryptos useEffect
    useEffect(() => {
        getCryptos(page);
    }, [page, getCryptos]);

    // for load more data with increase page
    const loadMore = () => {
        if (hasMore) setPage((prev) => prev + 1);
    };

    return { cryptos, loadMore, hasMore };
};

export default useCryptos;
