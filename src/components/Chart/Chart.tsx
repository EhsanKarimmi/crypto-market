import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

interface HistoricalPrice {
    time: number;
    priceUsd: number;
}
interface ChartProps {
    historicalPrices: HistoricalPrice[];
}
const Chart: React.FC<ChartProps> = ({ historicalPrices }) => {
    // chart data
    const data = {
        labels: historicalPrices.map((point) =>
            new Date(point.time).toLocaleDateString()
        ),
        datasets: [
            {
                label: "Price(USD)",
                data: historicalPrices.map((point) => point.priceUsd),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="w-full h-96">
            <Line data={data} options={{
                responsive: true,
                maintainAspectRatio: false
            }} />
        </div>
    );
};

export default Chart;
