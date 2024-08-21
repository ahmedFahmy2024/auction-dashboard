import { LocalContext } from "../context/LocalContext";
import { useTranslation } from "react-i18next";
import { useContext, useState, useRef, useEffect } from "react";
import "../css/notification.css";
import { Icon } from "@iconify/react";
import { Axios } from "../api/Axios";
import { NOTIFICATION, MARK_ALL } from "../api/Api";
import moment from "moment";
import 'moment/locale/ar';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Avatar } from "@mui/material";

function Notification() {
  const { locale, setLocale } = useContext(LocalContext);
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState([]);
  const [runUseEffect, setRunUseEffect] = useState(0);

    // to change time based on locale
    useEffect(() => {
      moment.locale(locale);
    }, [locale]);

  // ========================== get all notifications ==========================
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await Axios.get(`${NOTIFICATION}`);
        // console.log(response.data.notifications);
        setNotification(response.data.notifications);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

  useEffect(() => {
    let interval;
    fetchNotifications();
    interval = setInterval(fetchNotifications, 10000); // Poll every 10 second
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [runUseEffect]);

  // ========================== mark all notifications as read ==========================
  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const response = await Axios.post(`${MARK_ALL}`);
      // console.log(response.data);
      setRunUseEffect((prev) => prev + 1);
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
      // console.log(response.data);
      setRunUseEffect((prev) => prev + 1);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
  };

  // to be able to close the menu from outside
  const menuRef = useRef();
  const iconRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        event.target !== iconRef.current
      ) {
        setOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  //   ====================== show mareked all notification icon ======================
  const onenotification = notification?.filter((item) => item.read_at === null);

    // Function to get the correct message based on notification type
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
      className={[locale === "en" ? "ltr" : "rtl", "notification"].join(" ")}
    >
      <div ref={iconRef} className="bell" onClick={() => setOpen(!open)}>
        <Icon icon="solar:bell-bing-linear" width="24" height="24" />
        {
          onenotification.length !== 0 && <div className="badge"></div>
        }
      </div>
      {open && (
        <div
          ref={menuRef}
          className="paper"
          style={{
            right: locale === "en" ? "0" : "auto",
            left: locale === "en" ? "auto" : "0",
          }}
          onClick={(e) => e.stopPropagation()}
        >
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
                              onClick={() => handleNotificationClick(item?.id)}
                            >
                              <div className="avatar-img">
                                <div className="avatar-container">
                                  <Avatar
                                    src={item?.data?.user_profile_image}
                                    sx={{ width: 50, height: 50, mx: "10px" }}
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
        </div>
      )}
    </div>
  );
}

export default Notification;
