import React, { useEffect, useState } from 'react';
import './Orders.css';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Baking', 'Ready for Pickup', 'Shipped', 'Delivered', 'Cancelled'];

const Orders = () => {
    const [orders,  setOrders]  = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res  = await fetch('http://localhost:4000/allorders');
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (orderId, newStatus) => {
        setOrders(prev => prev.map(o =>
            String(o.orderId) === String(orderId) ? { ...o, status: newStatus } : o
        ));
        try {
            const res  = await fetch('http://localhost:4000/updateorderstatus', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ orderId: String(orderId), status: newStatus })
            });
            const data = await res.json();
            if (!data.success) fetchOrders();
        } catch (err) {
            console.error('Failed to update order:', err);
            fetchOrders();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':           return '#f59e0b';
            case 'Processing':
            case 'Baking':            return '#3b82f6';
            case 'Ready for Pickup':  return '#8b5cf6';
            case 'Shipped':           return '#6366f1';
            case 'Delivered':         return '#10b981';
            case 'Cancelled':         return '#ef4444';
            default:                  return '#6b7280';
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className='orders'>
                <h1>All Orders</h1>
                <p className="orders-loading">Loading orders…</p>
            </div>
        );
    }

    return (
        <div className='orders'>
            <div className="orders-header">
                <h1>All Orders</h1>
                <span className="orders-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
            </div>

            {orders.length === 0 ? (
                <div className="orders-empty"><p>No orders yet.</p></div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => {
                        const validProducts = (order.products || []).filter(p => p.quantity && p.quantity > 0);
                        return (
                            <div key={order._id || order.orderId} className="order-card">

                                {/* Header */}
                                <div className="order-card-header">
                                    <div className="order-id-date">
                                        <strong className="order-id">#{order.orderId}</strong>
                                        <span className="order-date">{formatDate(order.date)}</span>
                                    </div>
                                    <select
                                        value={order.status}
                                        onChange={e => updateStatus(order.orderId, e.target.value)}
                                        className="status-select"
                                        style={{ borderColor: getStatusColor(order.status), color: getStatusColor(order.status) }}
                                    >
                                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                {/* Body */}
                                <div className="order-card-body">
                                    {/* Customer info */}
                                    <div className="order-info-section">
                                        <h4>Customer</h4>
                                        <div className="info-grid">
                                            <div className="info-row">
                                                <span className="info-label">Name</span>
                                                <span className="info-value">{order.userId?.name || order.customerInfo?.fullName || 'N/A'}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Email</span>
                                                <span className="info-value">{order.userId?.email || order.customerInfo?.email || 'N/A'}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Phone</span>
                                                <span className="info-value">{order.customerInfo?.phone || 'N/A'}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Address</span>
                                                <span className="info-value">
                                                    {order.customerInfo?.address
                                                        ? `${order.customerInfo.address}${order.customerInfo.city ? ', ' + order.customerInfo.city : ''}`
                                                        : order.deliveryMethod === 'pickup' ? 'In-Store Pickup' : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Delivery</span>
                                                <span className="info-value">{order.deliveryMethod === 'pickup' ? 'In-Store Pickup' : 'Home Delivery'}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Payment</span>
                                                <span className="info-value">
                                                    {order.paymentMethod === 'online' ? 'Online' : 'Cash'} ({order.paymentStatus || 'pending'})
                                                </span>
                                            </div>
                                            {order.notes && (
                                                <div className="info-row">
                                                    <span className="info-label">Notes</span>
                                                    <span className="info-value">{order.notes}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Products table */}
                                    <div className="order-products-section">
                                        <h4>Items</h4>
                                        {validProducts.length > 0 ? (
                                            <table className="products-table">
                                                <thead>
                                                    <tr>
                                                        <th>Ref.</th>
                                                        <th>Item</th>
                                                        <th>Qty</th>
                                                        <th>Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {validProducts.map((p, i) => (
                                                        <tr key={p._id || i}>
                                                            <td className="td-ref">#{p.productId || '—'}</td>
                                                            <td className="td-name">{p.name || `Item #${p.productId}`}</td>
                                                            <td className="td-qty">{p.quantity}</td>
                                                            <td className="td-price">{p.price ? `$${(p.price * p.quantity).toFixed(2)}` : '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className="no-products">Legacy order — product details unavailable</p>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="order-card-footer">
                                    <div className="footer-meta">
                                        {order.subtotal && order.shippingFee > 0 && (
                                            <span>Subtotal: ${Number(order.subtotal).toFixed(2)} &nbsp;|&nbsp; Shipping: ${Number(order.shippingFee).toFixed(2)}</span>
                                        )}
                                    </div>
                                    <div className="footer-total">
                                        <span>Total:</span>
                                        <strong>${Number(order.total).toFixed(2)}</strong>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Orders;
