'use client';
import { useState } from 'react';
import AdminLayout from './layout';

export default function AdminAddMember() {
    const [emails, setEmails] = useState('');
    const [isStaff, setIsStaff] = useState(false); // Track if the role is staff
    const [responseMessage, setResponseMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponseMessage('');

        // Split emails by comma and trim any whitespace
        const emailArray = emails.split(',').map((email) => email.trim());

        // Validate email addresses
        const invalidEmails = emailArray.filter((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
        if (invalidEmails.length > 0) {
            setResponseMessage(`Invalid email(s): ${invalidEmails.join(', ')}`);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('backendlibrary-production.up.railway.app/api/addmember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emails: emailArray, role: isStaff ? 'staff' : 'user' }), // Include the role
            });

            const result = await response.json();
            setResponseMessage(result.msg || result.error);
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage('Error: Unable to send emails.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h1>Add Members</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="emails">Recipient Emails (comma-separated):</label>
                <textarea
                    id="emails"
                    name="emails"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    required
                    placeholder="Enter email addresses separated by commas"
                    style={{ padding: '10px', width: '100%', marginBottom: '10px', height: '80px' }}
                />
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={isStaff}
                            onChange={(e) => setIsStaff(e.target.checked)}
                        />{' '}
                        Assign as Staff
                    </label>
                </div>
                <button
                    type="submit"
                    style={{ padding: '10px', width: '100%', cursor: loading ? 'not-allowed' : 'pointer' }}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Send Emails'}
                </button>
            </form>
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    <div
                        style={{
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #3498db',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            animation: 'spin 1s linear infinite',
                        }}
                    />
                </div>
            )}
            {responseMessage && <p>{responseMessage}</p>}
            <style jsx>{`
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}

AdminAddMember.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};
