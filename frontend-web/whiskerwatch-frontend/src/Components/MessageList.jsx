import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/MessageList.css';

function MessageList() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                
                if (!token || !userId) {
                    throw new Error('Authentication required');
                }

                const response = await axios.get('http://localhost:8080/api/messages', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.data && Array.isArray(response.data)) {
                    setMessages(response.data);
                } else {
                    setMessages([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const handleConversationClick = (otherUserId) => {
        navigate(`/messages/${otherUserId}`);
    };

    if (loading) {
        return <div className="message-loading">Loading messages...</div>;
    }

    if (error) {
        return <div className="message-error">Error: {error}</div>;
    }

    return (
        <div className="message-list-container">
            <h2>Your Messages</h2>
            {messages.length === 0 ? (
                <p className="no-messages">No messages yet. Start a conversation!</p>
            ) : (
                <ul className="message-list">
                    {messages.map((message) => {
                        const otherUser = message.sender.id.toString() === localStorage.getItem('userId') 
                            ? message.recipient 
                            : message.sender;
                            
                        return (
                            <li 
                                key={message.id} 
                                className={`message-item ${!message.read ? 'unread' : ''}`}
                                onClick={() => handleConversationClick(otherUser.id)}
                            >
                                <div className="message-header">
                                    <span className="sender-name">
                                        {message.sender.id.toString() === localStorage.getItem('userId') 
                                            ? `To: ${otherUser.firstName} ${otherUser.lastName}`
                                            : `From: ${otherUser.firstName} ${otherUser.lastName}`
                                        }
                                    </span>
                                    <span className="message-time">
                                        {new Date(message.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="message-preview">
                                    {message.content.length > 50 
                                        ? `${message.content.substring(0, 50)}...` 
                                        : message.content}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default MessageList;