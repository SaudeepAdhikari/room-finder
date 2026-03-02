import React from 'react';
import TransactionMonitoring from './TransactionMonitoring.js';
import './AdminPage.css';

const AdminPaymentsPage = () => {
    return (
        <div className="admin-page">
            <h1 className="admin-page-title">Payment Monitoring</h1>
            <div className="admin-page-content">
                <TransactionMonitoring />
            </div>
        </div>
    );
};

export default AdminPaymentsPage;
