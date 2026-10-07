import { useEffect, useState } from "react";
import API from "../api";
import { io } from "socket.io-client";
import { IMG_BASE } from "../config";
import "./DataExplorer.css";

function DataExplorer() {
    const [orders, setOrders] = useState([]);
    const [filterExchange, setFilterExchange] = useState("ALL");
    const [filterType, setFilterType] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    useEffect(() => {
        API.get("/orders").then((res) => {
            setOrders(res.data);
        }).catch(console.log);

        const socket = io(IMG_BASE);
        socket.on("new-live-order", (newOrder) => {
            setOrders((prev) => [newOrder, ...prev]);
        });

        return () => socket.disconnect();
    }, []);

    // Filter logic
    let filteredOrders = orders.filter(o => {
        const matchExchange = filterExchange === "ALL" || o.exchange === filterExchange;
        const matchType = filterType === "ALL" || o.type === filterType;
        const matchSearch = o.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            o.orderId.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchExchange && matchType && matchSearch;
    });

    // Sort logic
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    filteredOrders.sort((a, b) => {
        if (!sortConfig.key) return 0;
        
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'latency') {
            valA = Number(a.executionTime) - Number(a.routingTime);
            valB = Number(b.executionTime) - Number(b.routingTime);
        } else if (sortConfig.key === 'createdAt') {
            valA = new Date(a.createdAt).getTime();
            valB = new Date(b.createdAt).getTime();
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const getSortIcon = (name) => {
        if (!sortConfig || sortConfig.key !== name) {
            return " ↕";
        }
        return sortConfig.direction === "asc" ? " ↑" : " ↓";
    };

    // CSV Export Logic
    const handleExportCSV = () => {
        if (filteredOrders.length === 0) return alert("No data to export.");

        const headers = ["Order ID", "Symbol", "Exchange", "Type", "Price", "Routing Time (ms)", "Execution Time (ms)", "Latency (ms)"];
        
        const rows = filteredOrders.map(o => {
            const latency = Number(o.executionTime) - Number(o.routingTime);
            return [
                o.orderId,
                o.symbol,
                o.exchange,
                o.type,
                o.price,
                o.routingTime,
                o.executionTime,
                latency
            ].join(",");
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `TORFA_Export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard data-explorer">
            <div className="db-banner" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                <div>
                    <h1 className="db-banner-title">Data Explorer</h1>
                    <p className="db-banner-desc">Filter, analyze, and export historical routing data</p>
                </div>
                <button className="csv-export-btn" onClick={handleExportCSV}>
                    📥 Export as CSV
                </button>
            </div>

            <div className="db-panel">
                <div className="explorer-filters">
                    <input 
                        type="text" 
                        placeholder="Search by Symbol or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="explorer-search"
                    />
                    
                    <select value={filterExchange} onChange={(e) => setFilterExchange(e.target.value)} className="explorer-select">
                        <option value="ALL">All Exchanges</option>
                        <option value="NSE">NSE Only</option>
                        <option value="BSE">BSE Only</option>
                    </select>

                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="explorer-select">
                        <option value="ALL">All Order Types</option>
                        <option value="BUY">BUY Only</option>
                        <option value="SELL">SELL Only</option>
                    </select>
                </div>

                <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                    <table className="explorer-table">
                        <thead>
                            <tr>
                                <th onClick={() => requestSort('orderId')} style={{ cursor: 'pointer' }}>Order ID{getSortIcon('orderId')}</th>
                                <th onClick={() => requestSort('symbol')} style={{ cursor: 'pointer' }}>Symbol{getSortIcon('symbol')}</th>
                                <th onClick={() => requestSort('type')} style={{ cursor: 'pointer' }}>Type{getSortIcon('type')}</th>
                                <th onClick={() => requestSort('exchange')} style={{ cursor: 'pointer' }}>Exchange{getSortIcon('exchange')}</th>
                                <th onClick={() => requestSort('price')} style={{ cursor: 'pointer' }}>Price{getSortIcon('price')}</th>
                                <th onClick={() => requestSort('latency')} style={{ cursor: 'pointer' }}>Latency{getSortIcon('latency')}</th>
                                <th onClick={() => requestSort('createdAt')} style={{ cursor: 'pointer' }}>Date{getSortIcon('createdAt')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                                        No matching orders found.
                                    </td>
                                </tr>
                            )}
                            {filteredOrders.map(o => {
                                const latency = Number(o.executionTime) - Number(o.routingTime);
                                return (
                                    <tr key={o._id}>
                                        <td><strong>{o.orderId}</strong></td>
                                        <td>{o.symbol}</td>
                                        <td>
                                            <span style={{ color: o.type === 'BUY' ? '#059669' : '#ef4444', fontWeight: 'bold' }}>
                                                {o.type}
                                            </span>
                                        </td>
                                        <td><span className={`badge ${o.exchange}`}>{o.exchange}</span></td>
                                        <td>₹{Number(o.price).toLocaleString()}</td>
                                        <td>
                                            <span style={{ color: latency > 50 ? '#ef4444' : '#059669', fontWeight: 'bold' }}>
                                                {latency} ms
                                            </span>
                                        </td>
                                        <td>{new Date(o.createdAt).toLocaleString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DataExplorer;
