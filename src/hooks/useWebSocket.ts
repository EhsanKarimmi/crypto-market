import { useEffect, useState } from "react";

const useWebSocket = (cryptos: { id: string; priceUsd: string }[]) => {
    const [prices, setPrices] = useState<{
        [key: string]: { price: number; changePercent24Hr: number };
    }>({});

    useEffect(() => {
        if (cryptos.length === 0) return;

        const ws = new WebSocket(
            `wss://ws.coincap.io/prices?assets=${cryptos.map((crypto) => crypto.id).join(",")}`
        );

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            setPrices((prevPrices) => {
                const updatedPrices = { ...prevPrices };

                Object.keys(data).forEach((id) => {
                    const currentPrice = parseFloat(data[id]);
                    const oldPrice =
                        prevPrices[id]?.price ||
                        parseFloat(cryptos.find((crypto) => crypto.id === id)?.priceUsd || "0");

                    updatedPrices[id] = {
                        price: currentPrice,
                        changePercent24Hr: oldPrice
                            ? ((currentPrice - oldPrice) / oldPrice) * 100
                            : 0,
                    };
                });

                return updatedPrices;
            });
        };

        return () => ws.close();
    }, [cryptos]);

    return { prices };
};

export default useWebSocket;
