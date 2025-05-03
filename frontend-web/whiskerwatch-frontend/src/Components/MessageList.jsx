import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/MessageList.css';
import BASE_URL from '../Components/Config'; 

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

                const response = await axios.get(`${BASE_URL}/api/messages`, {
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

    // Group messages by the other user
    const groupedMessages = messages.reduce((groups, message) => {
        const otherUser = message.sender.id.toString() === localStorage.getItem('userId') 
            ? message.recipient 
            : message.sender;

        if (!groups[otherUser.id]) {
            groups[otherUser.id] = [];
        }
        groups[otherUser.id].push(message);
        return groups;
    }, {});

    if (loading) {
        return <div className="message-loading">Loading messages...</div>;
    }

    if (error) {
        return <div className="message-error">Error: {error}</div>;
    }

    return (
        <div className="message-list-container">
            <h2>Your Messages</h2>
            {Object.keys(groupedMessages).length === 0 ? (
                <p className="no-messages">No messages yet. Start a conversation!</p>
            ) : (
                Object.keys(groupedMessages).map((userId) => {
                    const userMessages = groupedMessages[userId];
                    const latestMessage = userMessages[userMessages.length - 1];
                    const otherUser = latestMessage.sender.id.toString() === localStorage.getItem('userId') 
                        ? latestMessage.recipient 
                        : latestMessage.sender;
                    
                    return (
                        <div key={userId} className="message-conversation">
                            <h3 
                                onClick={() => handleConversationClick(otherUser.id)} 
                                className="conversation-header"
                            >
                                {otherUser.firstName} {otherUser.lastName}
                            </h3>
                            <ul className="message-list">
                                <li 
                                    className={`message-item ${!latestMessage.read ? 'unread' : ''}`}
                                    onClick={() => handleConversationClick(otherUser.id)}  // Ensure clicking the message also navigates
                                >
                                    <div className="message-header">
                                        <span className="sender-name">
                                            {latestMessage.sender.id.toString() === localStorage.getItem('userId') 
                                                ? `To: ${otherUser.firstName} ${otherUser.lastName}`
                                                : `From: ${otherUser.firstName} ${otherUser.lastName}`
                                            }
                                        </span>
                                        <span className="message-time">
                                            {new Date(latestMessage.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="message-preview">
                                        {latestMessage.content.length > 50 
                                            ? `${latestMessage.content.substring(0, 50)}...` 
                                            : latestMessage.content}
                                    </p>
                                </li>
                            </ul>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default MessageList;
