import { LocalContext } from '../context/LocalContext'
import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react'
import { Icon } from '@iconify/react';


import Avatar from '@mui/material/Avatar';

function LiveChatLeft({ messages, timePassed, setSelectedUser, selectedUser, setSelectedChat, selectedChat }) {
    const { locale, setLocale } = useContext(LocalContext);
    const { t, i18n } = useTranslation();
    const [searchInput, setSearchInput] = useState("");

    if (!messages) {
        return null;
    }

    // Filter messages based on search input
    const filteredMessages = messages.filter((message) => {
        return (
            message.user2_name.toLowerCase().includes(searchInput.toLowerCase())
        )
    })

    const handleClick = (userId, chatId) => {
        setSelectedUser(userId)
        setSelectedChat(chatId)
    }

    const UserProfileImage = messages[0]?.user1_profile_image;

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "livechatleft"].join(" ")}>
            <div className="header-livechat">
                <div className="img-container">
                    <Avatar alt="Remy Sharp" src={UserProfileImage} sx={{ width: 48, height: 48 }} />
                    <div className="active-dot dot"></div>
                </div>
            </div>
            <div className="search-container">
                <div className="serach">
                    <div className="final-search">
                        <Icon icon="system-uicons:search" width="24" height="24" color='#637381' />
                        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type="text" placeholder={t("Search Contacts...")} />
                    </div>
                </div>
            </div>
            <div className="list-container">

                {filteredMessages.map((message, index) => {
                    const createdAt = message?.latest_user2_message?.created_at
                    const timeDisplay = createdAt ? timePassed(createdAt) : ""
                    return (
                        <div key={index} className={`user ${selectedUser === message?.user2_id ? "active" : ""}`} onClick={() => handleClick(message?.user2_id, message?.id)}>
                            <div className="img-container">
                                <Avatar alt={message?.user2_name} src={message?.user2_profile_image} sx={{ width: 48, height: 48 }} />
                                <div className="active-dot dot"></div>
                            </div>

                            <div className="user-details">
                                <div className="name">{message?.user2_name}</div>
                                <div className="last-meesage">{message?.latest_user2_message ? message?.latest_user2_message?.message : ""}</div>
                            </div>

                            <div className="date">
                                <span className='time'>{timeDisplay}</span>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default LiveChatLeft