import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../assets/MessageConversation.css";
import BASE_URL from '../Components/Config'; 

function MessageConversation() {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [otherUser, setOtherUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const [conversationRes, userRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/messages/conversation/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }),
                    axios.get(`${BASE_URL}/api/users/getUserById/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                ]);

                setMessages(conversationRes.data);
                setOtherUser(userRes.data);
                setLoading(false);

                // Mark messages as read
                const unreadMessages = conversationRes.data.filter(
                    m => !m.read && m.sender.id.toString() === userId
                );
                if (unreadMessages.length > 0) {
                    await Promise.all(
                        unreadMessages.map(m => 
                            axios.put(`${BASE_URL}/api/messages/${m.id}/read`, {}, {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                        )
                    );
                }
            } catch (error) {
                console.error('Error fetching conversation:', error);
                setLoading(false);
            }
        };

        fetchConversation();
    }, [userId]);

    const handleSendMessage = async () => {
        const currentUserId = localStorage.getItem('userId');  // Get current user's ID

        // Prevent sending message to self
        if (currentUserId === userId) {
            setError("You cannot send a message to yourself.");
            return;
        }

        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(
                `${BASE_URL}//api/messages/send/${userId}`,
                newMessage,
                {
                    headers: {
                        'Content-Type': 'text/plain',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setMessages([...messages, response.data]);
            setNewMessage('');
            setError(null);  // Clear any previous error message
        } catch (error) {
            console.error('Error sending message:', error);
            setError("Failed to send message.");
        }
    };

    if (loading) {
        return <div className="loading">Loading conversation...</div>;
    }

    if (!otherUser) {
        return <div className="error">User not found</div>;
    }

    return (
        <div className="conversation-container">
            <div className="conversation-header">
                <button onClick={() => navigate('/messages')} className="back-button">
                    ← Back to messages
                </button>
                <h2>Conversation with {otherUser.firstName} {otherUser.lastName}</h2>
            </div>

            <div className="messages-container">
                {messages.map((message) => (
                    <div 
                        key={message.id} 
                        className={`message ${message.sender.id.toString() === userId ? 'received' : 'sent'}`}
                    >
                        <div className="message-content">{message.content}</div>
                        <div className="message-time">
                            {new Date(message.createdAt).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="message-input">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default MessageConversation;
