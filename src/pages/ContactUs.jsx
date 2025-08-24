import React from 'react';



export default function ContactUs() {
    return (
        <main style={{ padding: '3rem 1rem', maxWidth: 800, margin: '0 auto' }}>
            <h1>Contact Us</h1>
            <p>We’re here to help! Email us at <a href="mailto:support@sajilostay.com">support@sajilostay.com</a> or call <a href="tel:+977-9842064469">+977-9842064469</a>.</p>
            <form style={{ marginTop: '2rem' }}>
                <label>Name<br /><input type="text" name="name" style={{ width: '100%', marginBottom: 8 }} /></label><br />
                <label>Email<br /><input type="email" name="email" style={{ width: '100%', marginBottom: 8 }} /></label><br />
                <label>Message<br /><textarea name="message" rows={4} style={{ width: '100%' }} /></label><br />
                <button type="submit" style={{ marginTop: 12, padding: '0.5rem 1.5rem' }}>Send</button>
            </form>
        </main>
    );
} 