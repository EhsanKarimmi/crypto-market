import { useState, useEffect } from "react";

interface Crypto {
    id: string;
    name: string;
    symbol: string;
    priceUsd: string;
    changePercent24Hr: string;
}

interface HistoricalPrice {
    time: number;
    priceUsd: number;
}

const useCryptoDetails = (id: string | undefined) => {
    const [crypto, setCrypto] = useState<Crypto | null>(null);
    const [prices, setPrices] = useState<{ price: number; changePercent24Hr: number } | null>(null);
    const [historicalPrices, setHistoricalPrices] = useState<HistoricalPrice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchCrypto = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://api.coincap.io/v2/assets/${id}`);
                const data = await response.json();
                setCrypto(data.data);

                const historyResponse = await fetch(
                    `https://api.coincap.io/v2/assets/${id}/history?interval=d1`
                );
                const historyData = await historyResponse.json();
                setHistoricalPrices(historyData.data);

                const ws = new WebSocket(`wss://ws.coincap.io/prices?assets=${id}`);
                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    const currentPrice = parseFloat(data[id]);

                    if (currentPrice) {
                        const oldPrice = crypto?.priceUsd
                            ? parseFloat(crypto.priceUsd)
                            : historicalPrices?.[historicalPrices.length - 1]?.priceUsd ||
                              currentPrice;

                        setPrices({
                            price: currentPrice,
                            changePercent24Hr: ((currentPrice - oldPrice) / oldPrice) * 100,
                        });
                    }
                };

                return () => ws.close();
            } catch (error) {
                console.error("Error fetching crypto details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCrypto();
    }, [id]);

    return { crypto, prices, historicalPrices, isLoading };
};

export default useCryptoDetails;
