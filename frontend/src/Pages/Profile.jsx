import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './CSS/Profile.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

const Profile = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') === 'orders' ? 'orders' : 'info';

    const [tab,         setTab]         = useState(initialTab);
    const [user,        setUser]        = useState(null);
    const [orders,      setOrders]      = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [saving,      setSaving]      = useState(false);
    const [saveMsg,     setSaveMsg]     = useState('');

    const [editName,    setEditName]    = useState('');
    const [editPhone,   setEditPhone]   = useState('');
    const [editAddress, setEditAddress] = useState('');
    const [editCity,    setEditCity]    = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const token = localStorage.getItem('auth-token');

    useEffect(() => {
        if (!token) { navigate('/login'); return; }

        fetch(`${API_BASE}/getuser`, { headers: { 'auth-token': token } })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setUser(data.user);
                    setEditName(data.user.name    || '');
                    setEditPhone(data.user.phone  || '');
                    setEditAddress(data.user.address || '');
                    setEditCity(data.user.city    || '');
                }
            })
            .catch(err => console.error(err));

        fetch(`${API_BASE}/myorders`, { headers: { 'auth-token': token } })
            .then(r => r.json())
            .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token, navigate]);

    const handleSaveProfile = async () => {
        setSaving(true);
        setSaveMsg('');
        try {
            const res  = await fetch(`${API_BASE}/updateuser`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'auth-token': token },
                body:    JSON.stringify({ name: editName, phone: editPhone, address: editAddress, city: editCity })
            });
            const data = await res.json();
            if (data.success) {
                setUser(prev => ({ ...prev, name: editName, phone: editPhone, address: editAddress, city: editCity }));
                setSaveMsg('Profile updated!');
            } else {
                setSaveMsg(data.message || 'Something went wrong.');
            }
        } catch { setSaveMsg('Network error. Please try again.'); }
        setSaving(false);
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) { setSaveMsg('Please fill in both password fields.'); return; }
        setSaving(true);
        setSaveMsg('');
        try {
            const res  = await fetch(`${API_BASE}/changepassword`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'auth-token': token },
                body:    JSON.stringify({ oldPassword, newPassword })
            });
            const data = await res.json();
            if (data.success) {
                setSaveMsg('Password changed!');
                setOldPassword('');
                setNewPassword('');
            } else {
                setSaveMsg(data.message || 'Incorrect password.');
            }
        } catch { setSaveMsg('Network error. Please try again.'); }
        setSaving(false);
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':    return '#f59e0b';
            case 'Processing': return '#3b82f6';
            case 'Shipped':    return '#8b5cf6';
            case 'Delivered':  return '#10b981';
            case 'Cancelled':  return '#ef4444';
            default:           return '#6b7280';
        }
    };

    const formatDate = (d) => d
        ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '—';

    if (loading) return <div className="profile-page"><div className="profile-loading">Loading…</div></div>;

    return (
        <div className="profile-page">
            {/* Header card */}
            <div className="profile-header-card">
                <div className="profile-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : '?'}</div>
                <div className="profile-header-info">
                    <h1>{user?.name || 'Customer'}</h1>
                    <p>{user?.email}</p>
                </div>
                <button className="profile-logout-btn" onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/'); }}>
                    Sign Out
                </button>
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
                <button className={`profile-tab ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    My Profile
                </button>
                <button className={`profile-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    My Orders <span className="tab-badge">{orders.length}</span>
                </button>
            </div>

            {/* Profile info tab */}
            {tab === 'info' && (
                <div className="profile-section">
                    <div className="profile-form-group">
                        <h3>Personal Information</h3>
                        <div className="profile-form-row">
                            <label>Full Name</label>
                            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Your name" />
                        </div>
                        <div className="profile-form-row">
                            <label>Email</label>
                            <input type="email" value={user?.email || ''} disabled className="disabled-input" />
                        </div>
                        <div className="profile-form-row">
                            <label>Phone</label>
                            <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="Phone number" />
                        </div>
                        <div className="profile-form-row">
                            <label>Address</label>
                            <input type="text" value={editAddress} onChange={e => setEditAddress(e.target.value)} placeholder="Street address" />
                        </div>
                        <div className="profile-form-row">
                            <label>City</label>
                            <input type="text" value={editCity} onChange={e => setEditCity(e.target.value)} placeholder="City" />
                        </div>
                        <button className="profile-save-btn" onClick={handleSaveProfile} disabled={saving}>
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>

                    <div className="profile-form-group">
                        <h3>Change Password</h3>
                        <div className="profile-form-row">
                            <label>Current Password</label>
                            <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="••••••••" />
                        </div>
                        <div className="profile-form-row">
                            <label>New Password</label>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
                        </div>
                        <button className="profile-save-btn" onClick={handleChangePassword} disabled={saving}>
                            Update Password
                        </button>
                    </div>

                    {saveMsg && (
                        <div className={`profile-save-msg ${saveMsg.includes('!') ? 'success' : 'error'}`}>
                            {saveMsg}
                        </div>
                    )}

                    <div className="profile-form-group member-since">
                        <p>Member since {user?.date ? new Date(user.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}</p>
                    </div>
                </div>
            )}

            {/* Orders tab */}
            {tab === 'orders' && (
                <div className="profile-section">
                    {orders.length === 0 ? (
                        <div className="profile-no-orders">
                            <p>You haven't placed any orders yet.</p>
                            <button onClick={() => navigate('/classic')}>Shop Our Cookies</button>
                        </div>
                    ) : (
                        <div className="profile-orders-list">
                            {orders.map(order => (
                                <div key={order._id || order.orderId} className="porder-card">
                                    <div className="porder-top">
                                        <div>
                                            <span className="porder-id">#{order.orderId}</span>
                                            <span className="porder-date">{formatDate(order.date)}</span>
                                        </div>
                                        <span className="porder-status" style={{
                                            background:   getStatusColor(order.status) + '18',
                                            color:        getStatusColor(order.status),
                                            borderColor:  getStatusColor(order.status) + '40'
                                        }}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="porder-products">
                                        {order.products && order.products.length > 0
                                            ? order.products.map((p, i) => (
                                                <div key={i} className="porder-product-row">
                                                    <span className="porder-pname">{p.name || `Item #${p.productId}`}</span>
                                                    <span className="porder-pqty">×{p.quantity}</span>
                                                    {p.price > 0 && <span className="porder-pprice">${(p.price * p.quantity).toFixed(2)}</span>}
                                                </div>
                                            ))
                                            : <p className="porder-nodetail">Details unavailable</p>
                                        }
                                    </div>
                                    <div className="porder-bottom">
                                        <span className="porder-meta">
                                            {order.deliveryMethod === 'pickup' ? 'In-Store Pickup' : 'Home Delivery'}
                                            {order.paymentMethod  === 'cash'   ? ' · Cash' : ' · Online'}
                                        </span>
                                        <span className="porder-total">${Number(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;
