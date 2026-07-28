import { useState } from "react";
import API from "../api";
import { useNotification, Notification } from "./Notification";

function OrderForm({ refreshData }) {

    const [formData, setFormData] = useState({
        orderId: "",
        exchange: "NSE",
        symbol: "",
        type: "BUY",
        price: "",
        quantity: "",
        routingTime: "",
        executionTime: ""
    });

    const { notification, showNotification } = useNotification();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(formData.executionTime) < Number(formData.routingTime)) {
            showNotification("Execution time cannot be earlier than routing time.", "error");
            return;
        }

        try {
            await API.post("/orders/add", formData);
            showNotification("✅ Order Added Successfully");
            setFormData({
                orderId: "",
                exchange: "NSE",
                symbol: "",
                type: "BUY",
                price: "",
                quantity: "",
                routingTime: "",
                executionTime: ""
            });
            refreshData();
        } catch (error) {
            showNotification(error.response?.data?.message || "Something went wrong", "error");
        }
    };

    return (
        <div className="form-card">
            <Notification notification={notification} />
            <h2 className="title" style={{ fontSize: '22px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                📥 New Order Entry
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                
                <div className="form-group">
                    <label>Order ID</label>
                    <input
                        className="form-input"
                        name="orderId"
                        placeholder="e.g. ORD-7721"
                        value={formData.orderId}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Exchange</label>
                    <select
                        className="form-input"
                        name="exchange"
                        value={formData.exchange}
                        onChange={handleChange}
                    >
                        <option value="NSE">NSE</option>
                        <option value="BSE">BSE</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Symbol</label>
                    <input
                        className="form-input"
                        name="symbol"
                        placeholder="e.g. RELIANCE"
                        value={formData.symbol}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Type</label>
                    <select
                        className="form-input"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                        className="form-input"
                        type="number"
                        name="price"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Quantity</label>
                    <input
                        className="form-input"
                        type="number"
                        name="quantity"
                        placeholder="0"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Routing (ms)</label>
                    <input
                        className="form-input"
                        type="number"
                        name="routingTime"
                        placeholder="0"
                        value={formData.routingTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Execution (ms)</label>
                    <input
                        className="form-input"
                        type="number"
                        name="executionTime"
                        placeholder="0"
                        value={formData.executionTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                    <button type="submit" className="submit-btn" style={{ 
                        gridColumn: '1 / -1',
                        background: '#2563eb',
                        boxShadow: '0 10px 15px rgba(37, 99, 235, 0.3)'
                    }}>
                        Submit Order to Analyzer
                    </button>

            </form>



        </div>
    );
}

export default OrderForm;