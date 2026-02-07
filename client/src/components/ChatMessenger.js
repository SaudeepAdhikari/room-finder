import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatMessenger = ({ room, isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: `Hello! I'm interested in "${room?.title}". Is it still available?`, sender: 'me', time: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen && messages.length === 1) {
            // Simulate host response
            setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        text: "Hi there! Yes, it's still available. When are you looking to visit?",
                        sender: 'host',
                        time: new Date()
                    }]);
                }, 2000);
            }, 1000);
        }
    }, [isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'me',
            time: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');

        // Simulate auto-reply
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: "Thanks for the info! Let me check my schedule and get back to you shortly.",
                    sender: 'host',
                    time: new Date()
                }]);
            }, 2500);
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.9 }}
                style={{
                    position: 'fixed', bottom: 20, right: 20,
                    width: '350px', height: '500px',
                    background: '#fff', borderRadius: '20px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    display: 'flex', flexDirection: 'column',
                    zIndex: 3000, overflow: 'hidden',
                    border: '1px solid #f1f5f9'
                }}
            >
                {/* Header */}
                <div style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #3b82f6 100%)', padding: '16px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={room?.user?.avatar || '/logo192.png'} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} alt="Host" />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '14px' }}>{room?.user?.firstName || 'Host'}</div>
                            <div style={{ fontSize: '10px', opacity: 0.9 }}>Active now</div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>×</button>
                </div>

                {/* Messages */}
                <div ref={scrollRef} style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#f8fafc' }}>
                    {messages.map(msg => (
                        <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
                            <div style={{
                                maxWidth: '80%', padding: '10px 14px', borderRadius: '15px',
                                background: msg.sender === 'me' ? '#7c3aed' : '#fff',
                                color: msg.sender === 'me' ? '#fff' : '#1e293b',
                                fontSize: '14px', boxShadow: msg.sender === 'me' ? '0 2px 8px rgba(124, 58, 237, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                                borderBottomRightRadius: msg.sender === 'me' ? '2px' : '15px',
                                borderBottomLeftRadius: msg.sender === 'host' ? '2px' : '15px'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ display: 'flex', gap: '4px', padding: '8px 12px', background: '#fff', borderRadius: '15px', width: 'fit-content', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 4, height: 4, background: '#64748b', borderRadius: '50%' }} />
                            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: 4, height: 4, background: '#64748b', borderRadius: '50%' }} />
                            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: 4, height: 4, background: '#64748b', borderRadius: '50%' }} />
                        </div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px', fontSize: '14px', outline: 'none' }}
                    />
                    <button type="submit" style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}>Send</button>
                </form>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatMessenger;
