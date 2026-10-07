import React, { useMemo } from 'react';

function BrokerLeaderboard({ orders }) {
    
    const leaderboard = useMemo(() => {
        if (!orders || orders.length === 0) return [];
        
        const brokerStats = {};
        
        orders.forEach(order => {
            const broker = order.brokerId || "Unknown";
            if (!brokerStats[broker]) {
                brokerStats[broker] = {
                    totalOrders: 0,
                    totalLatency: 0,
                    nseOrders: 0,
                    bseOrders: 0
                };
            }
            
            brokerStats[broker].totalOrders += 1;
            brokerStats[broker].totalLatency += (Number(order.executionTime) - Number(order.routingTime));
            
            if (order.exchange === "NSE") brokerStats[broker].nseOrders += 1;
            if (order.exchange === "BSE") brokerStats[broker].bseOrders += 1;
        });
        
        const rankings = Object.keys(brokerStats).map(broker => {
            const stats = brokerStats[broker];
            const avgLatency = stats.totalLatency / stats.totalOrders;
            const nseShare = (stats.nseOrders / stats.totalOrders) * 100;
            const exchangeBias = Math.abs(nseShare - 50);
            
            // Calculate a 0-100 fairness score per broker
            const exchangeFairness = Math.max(0, 100 - exchangeBias * 2);
            const latencyFairness = Math.max(0, 100 - avgLatency);
            const fairnessScore = exchangeFairness * 0.6 + latencyFairness * 0.4;
            
            return {
                broker,
                avgLatency,
                fairnessScore,
                totalOrders: stats.totalOrders
            };
        });
        
        // Sort by fairness score descending
        return rankings.sort((a, b) => b.fairnessScore - a.fairnessScore);
        
    }, [orders]);

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>Rank</th>
                        <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>Broker</th>
                        <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>Avg Latency</th>
                        <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>Fairness Score</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.length === 0 && (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No broker data available</td>
                        </tr>
                    )}
                    {leaderboard.map((stat, index) => (
                        <tr key={stat.broker} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '15px 10px', fontWeight: 'bold', fontSize: '18px' }}>
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                            </td>
                            <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>{stat.broker}</td>
                            <td style={{ padding: '15px 10px' }}>{stat.avgLatency.toFixed(1)} ms</td>
                            <td style={{ padding: '15px 10px' }}>
                                <span style={{ 
                                    padding: '5px 10px', 
                                    borderRadius: '20px', 
                                    fontWeight: 'bold',
                                    background: stat.fairnessScore > 80 ? '#d1fae5' : stat.fairnessScore > 50 ? '#fef3c7' : '#fee2e2',
                                    color: stat.fairnessScore > 80 ? '#059669' : stat.fairnessScore > 50 ? '#d97706' : '#ef4444'
                                }}>
                                    {stat.fairnessScore.toFixed(1)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default React.memo(BrokerLeaderboard);
