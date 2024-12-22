import { useNavigate } from 'react-router-dom';
import useCryptos from '../hooks/useCryptos';
import useWebSocket from '../hooks/useWebSocket';


function HomePage() {
    // get cryptos data
    const { cryptos, loadMore, hasMore } = useCryptos();
    // get real time cryptos prices
    const { prices } = useWebSocket(cryptos)
    // navigate
    const navigate = useNavigate();
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
            {hasMore &&
                <div className="w-full flex justify-center items-center py-6">
                    <button role='button'
                        onClick={loadMore}
                        className='bg-zinc-900 text-white px-3 py-2 rounded-md font-light text-sm '>Load More</button>
                </div>}
        </div>
    )
}

export default HomePage