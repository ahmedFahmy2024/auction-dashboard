import { LocalContext } from "../context/LocalContext";
import { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../css/notificationPage.css";
import { Icon } from "@iconify/react";
import { Axios } from "../api/Axios";
import { NOTIFICATION, MARK_ALL } from "../api/Api";
import moment from "moment";
import 'moment/locale/ar';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Container } from "@mui/material";
import Avatar from '@mui/material/Avatar';

function NotificationPage() {
  const { locale, setLocale } = useContext(LocalContext);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState([]);
  const [runUseEffect, setRunUseEffect] = useState(0);

  // to change time based on locale
  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  // ========================== get all notifications ==========================
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await Axios.get(`${NOTIFICATION}`);
        console.log(response.data.notifications);
        setNotification(response.data.notifications);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [runUseEffect]);

  // ========================== mark all notifications as read ==========================
  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const response = await Axios.post(`${MARK_ALL}`);
      setRunUseEffect((prev) => prev + 1);
      // console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // ========================== mark specific notification as read ==========================
  const markAsRead = async (id) => {
    setLoading(true);
    try {
      const response = await Axios.post(`${MARK_ALL}/${id}`);
      setRunUseEffect((prev) => prev + 1);
      // console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
  };

  //   ====================== show mareked all notification icon ======================
  const onenotification = notification?.filter((item) => item.read_at === null);
  //   console.log('onenotification', onenotification.length);

  const getMessage = (item) => {
    const type = item.type;
    if (type === "App\\Notifications\\ScrapCreated" || type === "App\\Notifications\\QuoteRequested") {
      return locale === "en"
        ? [item.data.message_en_1]
        : [item.data.message_ar_1];
    } else {
      return locale === "en" ? [item.data.message_en] : [item.data.message_ar];
    }
  };

  return (
    <div
      dir={locale === "en" ? "ltr" : "rtl"}
      className={[locale === "en" ? "ltr" : "rtl", "notificationPage"].join(
        " "
      )}
    >
      <Container maxWidth="xl">
      <div className="first-box">
            <h6 className="header-title">{t("Notifications")}</h6>
            {onenotification.length !== 0 && (
              <Tooltip title={t("Mark All As Read")}>
                <IconButton color="success" onClick={markAllAsRead}>
                  <Icon
                    icon="solar:check-read-line-duotone"
                    width="24"
                    height="24"
                    color="#00A76F"
                  />
                </IconButton>
              </Tooltip>
            )}
          </div>

        {/* <hr className="hr" /> */}
        <div className="second-box">
          <div data-simplebar="init" className="massages">
            <div className="simplebar-wrapper">
              <div className="simplebar-height-auto-observer-wrapper">
                <div className="simplebar-height-auto-observer"></div>
              </div>
              <div className="simplebar-mask">
                <div className="simplebar-offset">
                  <div className="simplebar-content-wrapper">
                    <div className="simplebar-content">
                      <div className="list">
                        {notification?.map((item) => (
                          <div
                            key={item?.id}
                            className="item"
                            style={{ backgroundColor : item.read_at === null ? 'hsl(211, 68%, 94%)' : 'white'}}
                            onClick={() => handleNotificationClick(item?.id)}
                          >
                            <div className="avatar-img">
                              <div className="avatar-container">
                                <Avatar 
                                  sx={{ width: 50, height: 50, mx: "10px" }}
                                  src={item?.data?.user_profile_image}
                                  alt={item?.data?.user_name}
                                />
                              </div>
                            </div>
                            <div className="text">
                              <div className="main-text">
                                <div className="first-line">
                                  <p className="sentence">
                                    <strong>{item?.data?.user_name}</strong>
                                    {moment(item?.created_at).fromNow()}
                                  </p>
                                  {item?.read_at === null && (
                                    <span className="dot"></span>
                                  )}
                                </div>
                                <div className="second-line">
                                {getMessage(item).map((msg, index) => (
                                      <p key={index}>{msg}</p>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="simplebar-track simplebar-vertical">
              <div className="simplebar-scrollbar"></div>
            </div>
          </div>
        </div>
        {/* <hr className="hr" /> */}
        <div className="third-box"></div>
      </Container>
    </div>
  );
}

export default NotificationPage;
