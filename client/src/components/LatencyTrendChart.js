import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

function LatencyTrendChart({ orders }) {
    if (!orders || orders.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <p style={{ fontSize: '32px', marginBottom: '10px' }}>📈</p>
                <p>No data yet — import orders to see latency trends.</p>
            </div>
        );
    }

    // Take last 20 orders and build trend data
    const trendData = orders.slice(-20).map((order, index) => ({
        name: `#${index + 1}`,
        orderId: order.orderId,
        Routing: Number(order.routingTime) || 0,
        Execution: Number(order.executionTime) || 0,
        Latency: Number((order.executionTime - order.routingTime).toFixed(2)) || 0,
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '13px'
                }}>
                    <p style={{ fontWeight: 700, marginBottom: '6px', color: '#0f172a' }}>
                        Order {label}
                    </p>
                    {payload.map((entry) => (
                        <p key={entry.name} style={{ color: entry.color, margin: '3px 0' }}>
                            {entry.name}: <strong>{entry.value}ms</strong>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    unit="ms"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    wrapperStyle={{ fontSize: '13px', paddingTop: '15px' }}
                />
                <Line
                    type="monotone"
                    dataKey="Routing"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                />
                <Line
                    type="monotone"
                    dataKey="Execution"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                />
                <Line
                    type="monotone"
                    dataKey="Latency"
                    stroke="#059669"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    dot={false}
                    activeDot={{ r: 5 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default React.memo(LatencyTrendChart);
