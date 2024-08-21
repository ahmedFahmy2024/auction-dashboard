import React from 'react'

function ChatMessage({ message, selectedUser, timePassed, secondPerson }) {
    const client = message.user_id === selectedUser
    // console.log("message", message)
    // console.log("secondPerson", secondPerson)
  return (
    <div className={`chat-msg ${client ? "user" : "owner"}`}>
    <div className="chat-msg-profile">
      <img className="chat-msg-img" src={client ? secondPerson?.user2_profile_image : secondPerson?.user1_profile_image} alt="" />
      <div className="chat-msg-date">{timePassed(message.created_at)}</div>
    </div>
    <div className="chat-msg-content">
      <div className="chat-msg-text">{message.message}</div>
    </div>
  </div>
  )
}

export default ChatMessage