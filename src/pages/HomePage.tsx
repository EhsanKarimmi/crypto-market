import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';



interface Crypto {
    id: string;
    name: string;
    symbol: string;
    priceUsd: string;
    changePercent24Hr: string;
}
function HomePage() {
    // state
    const [cryptos, setCryptos] = useState<Crypto[]>([]);
    const [prices, setPrices] = useState<{ [key: string]: { price: number; changePercent24Hr: number } }>({});
    // pagination
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);


    const loaderRef = useRef(null);
    const navigate = useNavigate();

    // get cryptos data
    const getCryptos = useCallback(async (page: number) => {
        const limit = 5;
        const offset = (page - 1) * limit;
        const response = await fetch(`https://api.coincap.io/v2/assets?limit=${limit}&offset=${offset}`)
        const data = await response.json()
        if (data?.data?.length === 0) {
            setHasMore(false);
        } else {
            setCryptos((prev) => [...prev, ...data.data]);
        }
    }, [])


    // get real time crypto prices
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
                    const oldPrice = prevPrices[id]?.price.toString() || cryptos.find((crypto) => crypto.id === id)?.priceUsd;

                    updatedPrices[id] = {
                        price: currentPrice,
                        changePercent24Hr: oldPrice
                            ? ((currentPrice - parseFloat(oldPrice)) / parseFloat(oldPrice)) * 100
                            : 0,
                    };
                });

                return updatedPrices;
            });
        };

        return () => ws.close();
    }, [cryptos]);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [hasMore]);

    useEffect(() => {
        getCryptos(page);
    }, [page, getCryptos]);


    return (
        <div className='w-full'>
            {/* page title */}
            <h1 className='text-center font-medium text-3xl'>Real Time Cryptocurrency Prices</h1>
            {/* cryptos table */}
            <table className='w-full mt-10'>
                {/* table header */}
                <thead>
                    <tr className='w-full grid grid-cols-12 bg-zinc-900 text-white py-3 mb-1 rounded-md'>
                        <th className='col-span-6 text-start font-medium uppercase px-2'>Name</th>
                        <th className='col-span-2 text-start font-medium uppercase px-2'>Symbol</th>
                        <th className='col-span-2 text-start font-medium uppercase px-2'>Price (USD)</th>
                        <th className='col-span-2 text-start font-medium uppercase px-2'>Volume (24H)</th>
                    </tr>
                </thead>
                {/* table body */}
                <tbody className='w-full'>
                    {cryptos.map((crypto, index) => (
                        <tr
                            key={`${index}-${crypto.name}`}
                            onClick={() => navigate(`/${crypto.id}`)}
                            className='w-full px-1 py-2  grid grid-cols-12 items-center  cursor-pointer hover:bg-zinc-200 border-b border-zinc-300 transition-all duration-200'
                        >
                            <td className='col-span-6 flex justify-start items-center gap-3'>
                                <img
                                    src={`https://assets.coincap.io/assets/icons/${crypto.symbol.toLowerCase()}@2x.png`}
                                    alt={crypto.name}
                                    className='w-12 h-12 rounded-full'
                                />
                                <span className=''>{crypto.name}</span>
                            </td>
                            <td className='col-span-2 px-3'>{crypto.symbol}</td>
                            <td className='col-span-2 px-3'>${parseFloat(prices[crypto?.id]?.price?.toString() || parseFloat(crypto.priceUsd || "0").toString()).toFixed(2)}</td>
                            <td className={`col-span-2 flex justify-between items-center px-3 ${parseFloat(crypto.changePercent24Hr) >= 0 ? "text-green-600" : "text-red-600"}`}>
                                <span>{parseFloat(prices[crypto?.id]?.changePercent24Hr?.toString() || crypto.changePercent24Hr || "0").toFixed(2)}%</span>
                                <span className='text-black'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                </span>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
            {hasMore && <div ref={loaderRef} className='w-full flex justify-center items-center'>Loading more...</div>}
        </div>
    )
}

export default HomePage