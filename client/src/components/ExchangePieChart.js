import {
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

function ExchangePieChart({
    nseOrders,
    bseOrders
}) {

    const data = [
        { name: "NSE Exchange", value: nseOrders || 0 },
        { name: "BSE Exchange", value: bseOrders || 0 }
    ];

    const COLORS = ["#2563eb", "#6366f1"]; // Match Dashboard theme

    return (
        <div className="card" style={{ height: '480px', padding: '30px' }}>
            <h2 className="title" style={{ textAlign: "center", width: '100%', fontSize: '20px', marginBottom: '10px' }}>
                Market Share Distribution
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                Ratio of order execution across active exchanges
            </p>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80} // Donut style is more modern
                        outerRadius={110}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={index} 
                                fill={COLORS[index % COLORS.length]} 
                                style={{ filter: `drop-shadow(0px 10px 15px ${COLORS[index]}44)` }} 
                            />
                        ))}
                    </Pie>
                    <RechartsTooltip 
                        contentStyle={{ 
                            background: 'var(--card-bg)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)',
                            boxShadow: 'var(--shadow)'
                        }}
                        itemStyle={{ color: 'var(--text-main)', fontFamily: 'Outfit', fontWeight: '600' }}
                    />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span style={{ color: 'var(--text-main)', fontFamily: 'Outfit', fontWeight: '500' }}>{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ExchangePieChart;