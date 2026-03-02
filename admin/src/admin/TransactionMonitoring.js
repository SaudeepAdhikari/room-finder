import React, { useEffect, useState } from 'react';
import { FaSync, FaSearch, FaFileInvoiceDollar, FaCheckCircle, FaExclamationCircle, FaClock } from 'react-icons/fa/index.esm.js';
import { fetchAllTransactionsAdmin } from '../api.js';
import './TransactionMonitoring.css';
import './AdminCommon.css';

/**
 * TransactionMonitoring Component
 * Displays a detailed list of all payments and transactions for administrators.
 */
function TransactionMonitoring() {
    const [transactions, setTransactions] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadTransactions();
    }, []);

    useEffect(() => {
        let result = [...transactions];

        if (searchTerm) {
            result = result.filter(t =>
                t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.tenant && t.tenant.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (t.room && t.room.title.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(t => t.paymentStatus === statusFilter);
        }

        setFiltered(result);
    }, [transactions, searchTerm, statusFilter]);

    const loadTransactions = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchAllTransactionsAdmin();
            setTransactions(data);
        } catch (err) {
            console.error('Error loading transactions:', err);
            setError(err.message || 'Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return <FaCheckCircle className="status-icon success" />;
            case 'failed': return <FaExclamationCircle className="status-icon failed" />;
            case 'pending': return <FaClock className="status-icon pending" />;
            default: return null;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="transaction-mgmt-root animation-fade-in">
            <div className="page-header-actions">
                <div>
                    <h2 className="admin-page-title">Transaction Monitoring</h2>
                    <p className="admin-page-subtitle">Oversee all financial activities, payment statuses, and transaction histories.</p>
                </div>
                <button className="btn-premium" onClick={loadTransactions} disabled={loading}>
                    <FaSync className={loading ? 'spinning' : ''} /> Refresh
                </button>
            </div>

            <div className="premium-card transaction-mgmt-controls-card">
                <div className="transaction-mgmt-controls">
                    <div className="search-group">
                        <FaSearch className="search-icon" />
                        <input
                            className="input-premium"
                            type="text"
                            placeholder="Search by ID, User, or Room..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <select
                            className="input-premium select-premium"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Status: All</option>
                            <option value="success">Success</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="premium-card loading-state">
                    <div className="spinner"></div>
                    <p>Fetching transaction records...</p>
                </div>
            ) : error ? (
                <div className="premium-card error-panel">
                    <FaExclamationCircle className="error-icon" />
                    <div>
                        <p>{error}</p>
                        <button className="btn-premium" style={{ marginTop: '12px' }} onClick={loadTransactions}>Retry</button>
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="premium-card no-data-state">
                    <FaFileInvoiceDollar className="empty-icon" />
                    <p>No transactions found matching your search.</p>
                </div>
            ) : (
                <div className="premium-card table-card">
                    <div className="table-responsive">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Ref ID</th>
                                    <th>Date</th>
                                    <th>Tenant</th>
                                    <th>Property</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((txn, index) => (
                                    <tr key={txn._id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                                        <td>
                                            <code className="txn-ref-badge">{txn.transactionId.substring(0, 8)}...</code>
                                        </td>
                                        <td>
                                            <div className="date-cell">{formatDate(txn.transactionDate)}</div>
                                        </td>
                                        <td>
                                            <div className="tenant-info">
                                                <div className="tenant-email">{txn.tenant?.email || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="property-info-mini" title={txn.room?.title}>
                                                <div className="property-title-mini">{txn.room?.title || 'Deleted Property'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="amount-cell font-bold">Rs. {txn.amount.toLocaleString()}</div>
                                        </td>
                                        <td>
                                            <span className={`badge-status ${txn.paymentStatus === 'success' ? 'success' : txn.paymentStatus === 'pending' ? 'warning' : 'danger'}`}>
                                                {getStatusIcon(txn.paymentStatus)}
                                                {txn.paymentStatus.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TransactionMonitoring;
