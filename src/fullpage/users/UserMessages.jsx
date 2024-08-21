import { LocalContext } from '../../context/LocalContext'
import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react'
import "../../css/userMessage.css"
import { useUsers } from '../../context/UsersProvider';
import AreaMessages from '../chat/AreaMessages';
import Avatar from '@mui/material/Avatar';


function UserMessages() {
  const { locale, setLocale } = useContext(LocalContext);
  const { t, i18n } = useTranslation();
  const { chat } = useUsers();
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // =================== handle click on conversation =================
  const handleConversationClick = (id) => {
    setSelectedConversationId(id);
};

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "message"].join(" ")}>
      <div className="app">
        <div className="wrapper">
          <div className="conversation-area">

            {/* ================= left side ================ */}
            {chat?.map((conversation) => (
              <div className={`msg online ${selectedConversationId === conversation.id ? 'active' : ''}`} key={conversation.id} onClick={() => handleConversationClick(conversation.id)}>
                <Avatar className="msg-profile" src={conversation?.user2_profile_image} alt={conversation?.user2_name} />
                <div className="msg-detail">
                  <div className="msg-username">{conversation?.user2_name}</div>
                  <div className="msg-content">
                    <span className="msg-message">{conversation?.latest_user2_message ? conversation.latest_user2_message.message : t('')}</span>
                  </div>
                </div>
              </div>
            ))}
            {/* ================= left side ================ */}

            <div className="overlay"></div>
          </div>

          {/* ================== right side ================ */}
          <div className="chat-area">
            <AreaMessages selectedConversationId={selectedConversationId} />
          </div>
          {/* ================== right side =============== */}

        </div>
      </div>
    </div>
  )
}

export default UserMessages