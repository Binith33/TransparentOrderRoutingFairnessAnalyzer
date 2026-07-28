import { useEffect, useState } from "react";
import API from "../api";

import { saveAs } from "file-saver";

import OrderForm from "../components/OrderForm";
import { useNotification, Notification } from "../components/Notification";


function Orders() {

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [exchangeFilter, setExchangeFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const { notification, showNotification } = useNotification();


    const fetchOrders = () => {

        API
            .get("/orders")

            .then((res) => {

                setOrders(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    };

    const deleteOrder = async (id) => {

        if (!window.confirm("Are you sure you want to delete this order?")) return;

        try {
            await API.delete(`/orders/${id}`);
            showNotification("Order deleted successfully");
            fetchOrders();
        } catch (error) {
            showNotification("Failed to delete order", "error");
        }

    };


    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await API.post("/orders/bulk-upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            showNotification(res.data.message);
            // Reset filters to show the new data instantly
            setSearch("");
            setExchangeFilter("ALL");
            setTypeFilter("ALL");
            fetchOrders();

        } catch (error) {
            const errorMsg = error.response?.data?.message || "Bulk Import Failed - Check your CSV format";
            showNotification(errorMsg, "error");
        }
    };


    const exportCSV = () => {


        const csvRows = [];

        csvRows.push(
            [
                "Order ID",
                "Exchange",
                "Symbol",
                "Type",
                "Price",
                "Quantity",
                "Routing Time (ms)",
                "Execution Time (ms)",
                "Latency (ms)"
            ].join(",")
        );

        orders.forEach((order) => {
            const latency = Number(order.executionTime) - Number(order.routingTime);
            csvRows.push(
                [
                    order.orderId,
                    order.exchange,
                    order.symbol,
                    order.type,
                    order.price,
                    order.quantity,
                    order.routingTime,
                    order.executionTime,
                    latency.toFixed(2)
                ].join(",")
            );
        });

        const csvContent =
            csvRows.join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );

        saveAs(
            blob,
            "orders_report.csv"
        );

    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [search, exchangeFilter, typeFilter]);

    const totalOrders = orders.length;

    const nseOrders =
        orders.filter(
            (order) => order.exchange === "NSE"
        ).length;

    const bseOrders =
        orders.filter(
            (order) => order.exchange === "BSE"
        ).length;

    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order.orderId.toLowerCase().includes(search.toLowerCase());
        const matchesExchange = exchangeFilter === "ALL" || order.exchange === exchangeFilter;
        const matchesType = typeFilter === "ALL" || order.type === typeFilter;
        return matchesSearch && matchesExchange && matchesType;
    });

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (

        <div className="orders-page dashboard">
            <Notification notification={notification} />


            <div className="welcome-banner">
                <h1>Order Management</h1>
                <p>
                    Submit new orders, search through history,
                    and analyze routing performance across major exchanges.
                </p>
            </div>

            <div className="cards">

                <div className="card">
                    <h3>Total Orders</h3>
                    <p>{totalOrders}</p>
                </div>

                <div className="card">
                    <h3>NSE Orders</h3>
                    <p>{nseOrders}</p>
                </div>

                <div className="card">
                    <h3>BSE Orders</h3>
                    <p>{bseOrders}</p>
                </div>

            </div>
            <div className="orders-entry-section" style={{ marginBottom: '40px' }}>
                <OrderForm refreshData={fetchOrders} />
            </div>


            <div className="table-controls" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'white', padding: '20px', borderRadius: '20px', boxShadow: 'var(--card-shadow)', marginBottom: '30px', flexWrap: 'wrap' }}>
                
                <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                    <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search Order ID or Symbol..."
                        className="form-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: "45px", margin: 0 }}
                    />
                </div>

                <select 
                    className="form-select" 
                    value={exchangeFilter} 
                    onChange={(e) => setExchangeFilter(e.target.value)}
                    style={{ width: 'auto', minWidth: '160px', margin: 0 }}
                >
                    <option value="ALL">All Exchanges</option>
                    <option value="NSE">NSE Only</option>
                    <option value="BSE">BSE Only</option>
                </select>

                <select 
                    className="form-select" 
                    value={typeFilter} 
                    onChange={(e) => setTypeFilter(e.target.value)}
                    style={{ width: 'auto', minWidth: '140px', margin: 0 }}
                >
                    <option value="ALL">All Types</option>
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                </select>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="export-btn" onClick={exportCSV} title="Export Report" style={{ padding: '12px 15px' }}>
                        📤
                    </button>

                    <label className="submit-btn" style={{ background: '#2563eb', padding: '12px 20px', display: 'flex', alignItems: 'center', cursor: 'pointer', margin: 0, width: 'auto', fontSize: '13px' }}>
                        📥 Bulk Import
                        <input 
                            type="file" 
                            accept=".csv" 
                            hidden 
                            onChange={handleBulkUpload} 
                        />
                    </label>
                </div>
            </div>


            <div className="chart-container">

                <table className="order-table">

                    <thead>

                        <tr>

                            <th>Order ID</th>
                            <th>Exchange</th>
                            <th>Symbol</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th style={{ color: 'var(--primary)' }}>Routing</th>
                            <th style={{ color: 'var(--primary)' }}>Execution</th>
                            <th style={{ color: '#059669' }}>Latency</th>
                            <th>Action</th>


                        </tr>

                    </thead>

                    <tbody>
                        {paginatedOrders.length === 0 && (
                            <tr>
                                <td colSpan="10" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                    No orders match your filters.
                                </td>
                            </tr>
                        )}
                        {paginatedOrders.map((order) => (
                                <tr key={order._id}>
                                    <td><b>{order.orderId}</b></td>
                                    <td>
                                        <span className={`badge ${order.exchange}`}>{order.exchange}</span>
                                    </td>
                                    <td>{order.symbol}</td>
                                    <td>
                                        <span style={{ 
                                            fontWeight: '700', 
                                            color: order.type === 'BUY' ? '#059669' : '#ef4444',
                                            padding: '4px 8px',
                                            background: order.type === 'BUY' ? 'rgba(5,150,105,0.1)' : 'rgba(239,68,68,0.1)',
                                            borderRadius: '6px',
                                            fontSize: '11px'
                                        }}>{order.type}</span>
                                    </td>
                                    <td style={{ fontWeight: '700' }}>₹{Number(order.price).toLocaleString()}</td>
                                    <td>{order.quantity}</td>
                                    <td>{order.routingTime}ms</td>
                                    <td style={{ fontWeight: '600' }}>{order.executionTime}ms</td>
                                    <td>
                                        <span style={{ 
                                            fontWeight: '700', 
                                            color: (order.executionTime - order.routingTime) < 10 ? '#059669' : '#f59e0b' 
                                        }}>
                                            {(order.executionTime - order.routingTime).toFixed(2)}ms
                                        </span>
                                    </td>
                                    <td>
                                        <button className="delete-btn" onClick={() => deleteOrder(order._id)}>
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}

                    </tbody>


                </table>

                {filteredOrders.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", padding: "0 10px" }}>
                        <span style={{ color: "#64748b", fontSize: "14px" }}>
                            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length}
                        </span>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                className="export-btn"
                                disabled={currentPage === 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                Previous
                            </button>
                            <span style={{ alignSelf: "center", fontSize: "14px" }}>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className="export-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

            </div>

        </div>

    );


}

export default Orders;