import { LocalContext } from "../context/LocalContext";
import { useTranslation } from "react-i18next";
import { useContext, useState, useMemo, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import {Axios} from "../api/Axios";
import { USERS } from "../api/Api";

import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { Icon } from "@iconify/react";

function LiveChatRight({
    messages,
    timePassed,
    selectedUser,
    selectedChat,
    sendMessage,
    addInput,
    setAddInput,
}) {

    const { locale, setLocale } = useContext(LocalContext);
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [updateInput, setUpdateInput] = useState({
        Name: '',
        Email: '',
        Phone: '',
        AccountType: '',
        Country: '',
        State: '',
      })

    const secondPerson = useMemo(() =>
        messages.find((msm) => msm.id === selectedChat),
        [messages, selectedChat]
    );

    // console.log('secondPerson', secondPerson);

    //  ====== get specific user ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${USERS}/${secondPerson?.user2_id}`,)
            .then(function (response) {
                console.log(response.data.user);
                const project = response.data.user;
                setUpdateInput({
                    ...updateInput,
                    Name: project.name,
                    Email: project.email,
                    Phone: project.phone,
                    AccountType: project.account_type,
                    Country: project.country,
                    State: project.state,
                })
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false);
            });
    }, [secondPerson]);
    //  ====== get specific user ========
    return (
        <div
            dir={locale === "en" ? "ltr" : "rtl"}
            className={[locale === "en" ? "ltr" : "rtl", "livechatright"].join(" ")}
        >
            <div className="header-livechat">
                <div className="stack">
                    <div className="img-container">
                        <Avatar
                            alt="Remy Sharp"
                            src={secondPerson?.user2_profile_image}
                            sx={{ width: 48, height: 48 }}
                        />
                        <div className="active-dot dot"></div>
                    </div>
                    <div className="feet">
                        <div className="name">{secondPerson?.user2_name}</div>
                        <div className="online">online</div>
                    </div>
                </div>
            </div>

            <div className="body-chat">
                <div className="stack">
                    <div className="message">
                        <div className="first-sec">
                            {secondPerson?.messages.map((message, index) => (
                                <ChatMessage secondPerson={secondPerson} key={index} message={message} selectedUser={selectedUser} timePassed={timePassed} />
                            ))}
                        </div>

                        <div className="sec-section">
                            <input
                                value={addInput}
                                onChange={(e) => setAddInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage(e);
                                    }
                                }}
                                type="text"
                                placeholder={t("Type a message...")}
                            />
                            <IconButton onClick={sendMessage}>
                                <Icon icon="lets-icons:send-hor-light" width="28" height="28" />
                            </IconButton>
                        </div>
                    </div>

                    <div className="info">
                        <div className="card">
                            <div className="card-title">
                                <div className="image-profile">
                                    <Avatar
                                        alt="Remy Sharp"
                                        src={secondPerson?.user2_profile_image}
                                        sx={{ width: 96, height: 96 }}
                                    />
                                </div>
                                <h6>{updateInput.Name}</h6>
                                <p>{t(updateInput.AccountType)}</p>
                            </div>
                            <h3>{t("Informations")}</h3>
                            <div className="card-content">
                                <div className="stacks">
                                    <Icon icon="fluent:mail-24-filled" width="22" height="22" />
                                    <h6>{updateInput.Email}</h6>
                                </div>
                                <div className="stacks">
                                    <Icon icon="ph:phone-list-fill" width="22" height="22" />
                                    <h6>{updateInput.Phone}</h6>
                                </div>
                                <div className="stacks">
                                    <Icon icon="mingcute:location-fill" width="22" height="22" />
                                    <h6>{updateInput.Country}</h6>
                                </div>
                                <div className="stacks">
                                    <Icon icon="mingcute:location-fill" width="22" height="22" />
                                    <h6>{updateInput.State}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LiveChatRight;
