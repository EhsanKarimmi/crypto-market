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
    // state
    const [crypto, setCrypto] = useState<Crypto | null>(null);
    const [prices, setPrices] = useState<{ price: number; changePercent24Hr: number } | null>(null);
    const [historicalPrices, setHistoricalPrices] = useState<HistoricalPrice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        // else
        const getCrypto = async () => {
            setIsLoading(true);
            try {
                // fetch and save crypto details
                const response = await fetch(`https://api.coincap.io/v2/assets/${id}`);
                const data = await response.json();
                setCrypto(data.data);
                // get price history
                const historyResponse = await fetch(
                    `https://api.coincap.io/v2/assets/${id}/history?interval=d1`
                );
                const historyData = await historyResponse.json();
                setHistoricalPrices(historyData.data);
                // web socket connection
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
                // close web socket connection
                return () => ws.close();
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getCrypto();
    }, [id]);

    return { crypto, prices, historicalPrices, isLoading };
};

export default useCryptoDetails;
