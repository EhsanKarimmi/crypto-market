import { useParams } from "react-router-dom"
import useCryptoDetails from "../hooks/useCryptoDetails"
import Chart from "../components/Chart/Chart";
import Spinner from "../components/Spinner/Spinner";

function CryptoDetailsPage() {
    const { cryptoId } = useParams()
    const { crypto, prices, historicalPrices, isLoading } = useCryptoDetails(cryptoId)
    if (isLoading) {
        return <div className="w-full flex justify-center items-center"><Spinner /></div>;
    }

    if (!crypto) {
        return <div className="w-full flex justify-center items-center">Crypto not found.</div>;
    }

    return (
        <div className="w-full">
            <h1 className="text-center font-medium text-3xl flex justify-center items-center gap-3">
                <span>
                    <img
                        src={`https://assets.coincap.io/assets/icons/${crypto.symbol.toLowerCase()}@2x.png`}
                        alt={crypto.name}
                        className='w-8 h-8 rounded-full'
                    />
                </span>
                <span>{crypto.name}</span></h1>
            <div className="w-full flex justify-center items-center gap-20 bg-zinc-900 text-white py-2 my-10 rounded-md">
                <p>Symbol: {crypto.symbol}</p>
                <p>Price (USD): ${prices?.price.toFixed(2) || crypto.priceUsd}</p>
                <p>Volume (24H): {prices?.changePercent24Hr?.toFixed(2) || crypto.changePercent24Hr}%</p>
            </div>
            <div className="w-full">
                <Chart historicalPrices={historicalPrices} />
            </div>
        </div>
    );
}

export default CryptoDetailsPage