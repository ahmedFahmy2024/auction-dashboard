import { LocalContext } from '../../context/LocalContext'
import { useContext } from 'react'
import "../../css/userMessage.css"
import { useUsers } from '../../context/UsersProvider';
import Avatar from '@mui/material/Avatar';

function AreaMessages({ selectedConversationId }) {
    const { locale, setLocale } = useContext(LocalContext);
    const { chat } = useUsers();

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const options = {
            month: 'short', // Display month in short format (e.g., "May")
            day: 'numeric', // Display day of the month (e.g., "20")
            hour: 'numeric', // Display hour (e.g., "3")
            minute: 'numeric', // Display minute (e.g., "36")
            hour12: true // Use 12-hour clock with "AM" and "PM"
        };
        return date.toLocaleString(undefined, options);
    }
    
    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "chat-area-main"].join(" ")} >
            {chat.map((conversation) => (
                <div key={conversation.id}>
                    {conversation.id === selectedConversationId && (
                        conversation.messages.map((message) => {
                            console.log(conversation)
                            return (
                                <div key={message.id}>
                                    {message.user_id === conversation.user1_id ? (
                                        <div className="chat-msg owner">
                                            <div className="chat-msg-profile">
                                                <Avatar  className="chat-msg-img" src={conversation?.user1_profile_image} alt={conversation?.user1_name} />
                                                <div className="chat-msg-date">{formatTimestamp(message.created_at)}</div>
                                            </div>
                                            <div className="chat-msg-content">
                                                <div className="chat-msg-text">{message.message}</div>
                                            </div>
                                        </div>
                                    )
                                        : (
                                            <div className="chat-msg">
                                                <div className="chat-msg-profile">
                                                    <Avatar  className="chat-msg-img" src={conversation.user2_profile_image} alt={conversation?.user2_name} />
                                                    <div className="chat-msg-date">{formatTimestamp(message.created_at)}</div>
                                                </div>
                                                <div className="chat-msg-content">
                                                    <div className="chat-msg-text">{message.message}</div>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )
                        }
                        )
                    )}
                </div>
            ))}
        </div>
    )
}

export default AreaMessages