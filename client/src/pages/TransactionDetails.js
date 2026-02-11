import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaHome, FaUser, FaMoneyBillWave, FaClock, FaReceipt, FaArrowLeft, FaPhone, FaEnvelope } from 'react-icons/fa';

const TransactionDetails = () => {
    const { transactionId } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await fetch(`${apiBase}/api/transactions/${transactionId}`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch transaction details');
                }

                const data = await response.json();
                setTransaction(data);
            } catch (err) {
                console.error('Error fetching transaction:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [transactionId]);

    if (loading) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    style={{ width: 50, height: 50, border: '4px solid #e2e8f0', borderTopColor: '#7c3aed', borderRadius: '50%' }}
                />
                <p style={{ marginTop: 24, fontSize: 18, color: '#64748b' }}>Loading transaction details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 20 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ maxWidth: 500, width: '100%', background: '#fff', padding: 40, borderRadius: 24, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
                >
                    <div style={{ width: 80, height: 80, background: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 24px' }}>
                        <FaTimesCircle />
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>Transaction Not Found</h1>
                    <p style={{ color: '#64748b', marginBottom: 32, lineHeight: 1.6 }}>{error}</p>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => navigate(-1)} style={{ flex: 1, padding: '14px', borderRadius: 12, border: '2px solid #e2e8f0', background: 'transparent', fontWeight: 600, cursor: 'pointer' }}>Go Back</button>
                        <button onClick={() => navigate('/profile')} style={{ flex: 1, padding: '14px', borderRadius: 12, background: '#7c3aed', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Dashboard</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const statusInfo = transaction.paymentStatus === 'success'
        ? { color: '#22c55e', bg: '#f0fdf4', icon: <FaCheckCircle />, text: 'Payment Successful' }
        : transaction.paymentStatus === 'failed'
            ? { color: '#ef4444', bg: '#fef2f2', icon: <FaTimesCircle />, text: 'Payment Failed' }
            : { color: '#f59e0b', bg: '#fef3c7', icon: <FaClock />, text: 'Payment Pending' };

    return (
        <div style={{ minHeight: '80vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', padding: '40px 20px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ maxWidth: 900, margin: '0 auto' }}
            >
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <button
                        onClick={() => navigate('/profile')}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', color: '#7c3aed', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}
                    >
                        <FaArrowLeft /> Back to Dashboard
                    </button>
                    <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>Transaction Details</h1>
                    <p style={{ color: '#64748b', fontSize: 18 }}>Complete information about your payment transaction</p>
                </div>

                {/* Transaction Status Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    style={{ background: '#fff', borderRadius: 24, padding: 32, marginBottom: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 64, height: 64, background: statusInfo.bg, color: statusInfo.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                                {statusInfo.icon}
                            </div>
                            <div>
                                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{statusInfo.text}</h2>
                                <p style={{ color: '#64748b', fontSize: 14 }}>Transaction ID: <span style={{ fontWeight: 600, color: '#7c3aed' }}>{transaction.transactionId}</span></p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 32, fontWeight: 800, color: '#7c3aed', marginBottom: 4 }}>NPR {transaction.amount?.toLocaleString()}</div>
                            <div style={{ fontSize: 14, color: '#64748b' }}>Security Deposit</div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 24 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <FaClock style={{ color: '#7c3aed' }} />
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Transaction Date</span>
                                </div>
                                <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>
                                    {new Date(transaction.transactionDate).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <FaMoneyBillWave style={{ color: '#7c3aed' }} />
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Payment Method</span>
                                </div>
                                <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>{transaction.paymentMethod}</div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <FaReceipt style={{ color: '#7c3aed' }} />
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>eSewa UUID</span>
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', wordBreak: 'break-all' }}>{transaction.esewaTransactionUuid}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Room Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ background: '#fff', borderRadius: 24, padding: 32, marginBottom: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                >
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FaHome style={{ color: '#7c3aed' }} /> Room Details
                    </h3>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                        {(transaction.room?.images?.length > 0 || transaction.room?.imageUrl) && (
                            <div style={{ width: 200, height: 150, borderRadius: 16, overflow: 'hidden', flexShrink: 0 }}>
                                <img
                                    src={transaction.room.images?.[0] || transaction.room.imageUrl}
                                    alt={transaction.room.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>{transaction.room?.title}</h4>
                            <p style={{ color: '#64748b', marginBottom: 12, fontSize: 15 }}>{transaction.room?.location}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <span style={{ fontSize: 24, fontWeight: 700, color: '#7c3aed' }}>NPR {transaction.room?.price?.toLocaleString()}</span>
                                <span style={{ fontSize: 14, color: '#64748b' }}>/ month</span>
                            </div>
                            <button
                                onClick={() => navigate(`/listings/${transaction.room._id}`)}
                                style={{ padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
                            >
                                View Room Details
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Booking & Party Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                    {/* Booking Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                    >
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <FaCalendarAlt style={{ color: '#7c3aed' }} /> Booking Details
                        </h3>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4, textTransform: 'uppercase' }}>Check-In</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>
                                {new Date(transaction.booking?.checkIn).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4, textTransform: 'uppercase' }}>Check-Out</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>
                                {new Date(transaction.booking?.checkOut).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4, textTransform: 'uppercase' }}>Booking Status</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: transaction.booking?.status === 'confirmed' ? '#22c55e' : '#f59e0b', textTransform: 'capitalize' }}>
                                {transaction.booking?.status}
                            </div>
                        </div>
                    </motion.div>

                    {/* Tenant Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                    >
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <FaUser style={{ color: '#7c3aed' }} /> Tenant Details
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            {transaction.tenant?.avatar ? (
                                <img src={transaction.tenant.avatar} alt={transaction.tenant.firstName} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e0e7ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>
                                    {transaction.tenant?.firstName?.[0]}{transaction.tenant?.lastName?.[0]}
                                </div>
                            )}
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
                                    {transaction.tenant?.firstName} {transaction.tenant?.lastName}
                                </div>
                            </div>
                        </div>
                        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FaEnvelope style={{ color: '#7c3aed', fontSize: 14 }} />
                            <span style={{ fontSize: 14, color: '#64748b' }}>{transaction.tenant?.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FaPhone style={{ color: '#7c3aed', fontSize: 14 }} />
                            <span style={{ fontSize: 14, color: '#64748b' }}>{transaction.tenant?.phone || 'Not provided'}</span>
                        </div>
                    </motion.div>

                    {/* Landlord Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                    >
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <FaUser style={{ color: '#7c3aed' }} /> Host Details
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            {transaction.landlord?.avatar ? (
                                <img src={transaction.landlord.avatar} alt={transaction.landlord.firstName} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e0e7ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>
                                    {transaction.landlord?.firstName?.[0]}{transaction.landlord?.lastName?.[0]}
                                </div>
                            )}
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
                                    {transaction.landlord?.firstName} {transaction.landlord?.lastName}
                                </div>
                            </div>
                        </div>
                        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FaEnvelope style={{ color: '#7c3aed', fontSize: 14 }} />
                            <span style={{ fontSize: 14, color: '#64748b' }}>{transaction.landlord?.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FaPhone style={{ color: '#7c3aed', fontSize: 14 }} />
                            <span style={{ fontSize: 14, color: '#64748b' }}>{transaction.landlord?.phone || 'Not provided'}</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default TransactionDetails;
