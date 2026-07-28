import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function FairnessChart({
    totalOrders,
    averageLatency,
    fairnessScore
}) {

    const data = {
        labels: ["Total Orders", "Average Latency (ms)", "Fairness Score %"],
        datasets: [
            {
                label: "System Metrics",
                data: [
                    totalOrders || 0,
                    averageLatency || 0,
                    fairnessScore || 0
                ],
                backgroundColor: [
                    "rgba(37, 99, 235, 0.8)", // Primary Blue
                    "rgba(99, 102, 241, 0.8)", // Indigo
                    "rgba(5, 150, 105, 0.8)"   // Emerald
                ],
                borderColor: [
                    "#2563eb",
                    "#6366f1",
                    "#059669"
                ],
                borderWidth: 2,
                borderRadius: 12, // Modern Rounded Bar Corners
                hoverBackgroundColor: [
                    "#2563eb",
                    "#6366f1",
                    "#059669"
                ],
                hoverBorderColor: "#fff",
                hoverBorderWidth: 3
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // Cleaner for bar charts
            },
            tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                titleFont: { size: 14, family: 'Outfit' },
                bodyFont: { size: 13, family: 'Outfit' },
                padding: 12,
                cornerRadius: 10,
                displayColors: false
            },
            title: {
                display: true,
                text: "Real-time Fairness Distribution",
                color: "var(--text-main)",
                font: { size: 18, weight: '700', family: 'Outfit' },
                padding: { bottom: 20 }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(0,0,0,0.05)",
                    drawBorder: false
                },
                ticks: {
                    color: "var(--text-muted)",
                    font: { family: 'Outfit' }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "var(--text-main)",
                    font: { weight: '600', family: 'Outfit' }
                }
            }
        }
    };

    return (
        <div style={{ height: "400px", width: "100%", padding: "20px" }}>
            <Bar data={data} options={options} />
        </div>
    );
}

export default FairnessChart;