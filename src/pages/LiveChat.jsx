import { Container } from "@mui/material";
import { LocalContext } from "../context/LocalContext";
import { useTranslation } from "react-i18next";
import { useContext, useState, useEffect } from "react";
import "../css/livechat.css";
import LiveChatLeft from "../components/LiveChatLeft";
import LiveChatRight from "../components/LiveChatRight";
import { Axios } from "../api/Axios";
import { ADMIN_CHAT, CHAT_ROOM } from "../api/Api";
import moment from "moment";
import ToastContext from "../context/ToastProvider";

import { Stack } from "@mui/material";
import { Typography } from "@mui/material";

function LiveChat() {
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [addInput, setAddInput] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await Axios.get(`${ADMIN_CHAT}`);
            setMessages(response.data);
            // console.log(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        let interval;
            fetchData();
            interval = setInterval(fetchData, 5000); // Poll every 5 seconds
        return () => clearInterval(interval); // Clean up interval on component unmount
    }, [selectedUser]);

    // ======================= send message =======================
    async function sendMessage(e) {
        e.preventDefault();

        const param = {
            message: addInput,
        };

        try {
            const response = await Axios.post(
                `${CHAT_ROOM}/${selectedChat}/messages`,
                param
            );
            setAddInput("");
            fetchData();
        } catch (error) {
            showHideToast(t("An error occurred. Please try again."), "error");
            console.log(error);
        }
    }

    const timePassed = (timestamp) => {
        const now = moment();
        const past = moment(timestamp);
        const diffMinutes = now.diff(past, "minutes");
        const diffHours = now.diff(past, "hours");
        const diffDays = now.diff(past, "days");
        const diffWeeks = now.diff(past, "weeks");

        if (diffMinutes < 60) {
            return t("minutes_ago", { count: diffMinutes });
        } else if (diffHours < 24) {
            return t("hours_ago", { count: diffHours });
        } else if (diffDays < 7) {
            return t("days_ago", { count: diffDays });
        } else {
            return t("weeks_ago", { count: diffWeeks });
        }
    };

    return (
        <div
            dir={locale === "en" ? "ltr" : "rtl"}
            className={[locale === "en" ? "ltr" : "rtl", "livechat"].join(" ")}
        >
            <Container maxWidth="xl">
                <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", alignItems: "center", my: 2 }}
                >
                    <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                        {t("Chat")}
                    </Typography>
                </Stack>
                <div className="paper">
                    <LiveChatLeft
                        messages={messages}
                        timePassed={timePassed}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                    />
                    <LiveChatRight
                        messages={messages}
                        timePassed={timePassed}
                        selectedUser={selectedUser}
                        selectedChat={selectedChat}
                        sendMessage={sendMessage}
                        setAddInput={setAddInput}
                        addInput={addInput}
                    />
                </div>
            </Container>
        </div>
    );
}

export default LiveChat;
