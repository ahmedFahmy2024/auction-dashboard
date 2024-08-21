import { useTranslation } from "react-i18next";
import { LocalContext } from "../../context/LocalContext";
import { useContext, useState, useEffect, useCallback } from "react";
import "../../css/UserActivity.css";
import { Axios } from "../../api/Axios";
import { USER_ACTIVITY } from "../../api/Api";
import { useParams } from "react-router-dom";
import moment from "moment";
import "moment/locale/ar";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Container } from "@mui/material";
import Avatar from "@mui/material/Avatar";

function UserActivity() {
  const { locale, setLocale } = useContext(LocalContext);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState([]);
  const { id } = useParams();

  // to change time based on locale
  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  // ========================== get all notifications ==========================
    const fetchNotifications = useCallback(async () => {
      setLoading(true);
      try {
        const response = await Axios.get(`${USER_ACTIVITY}/${id}`);
        // console.log(response.data.notifications);
        setNotification(response.data.notifications);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchNotifications();
    }, []);


  //   ====================== show mareked all notification icon ======================
  const getMessage = (item) => {
    const type = item.type;
    if (
      type === "App\\Notifications\\ScrapCreated" ||
      type === "App\\Notifications\\QuoteRequested"
    ) {
      return locale === "en"
        ? [item.data.message_en_1]
        : [item.data.message_ar_1];
    } else {
      return locale === "en" ? [item.data.message_en] : [item.data.message_ar];
    }
  };

    // ================= loading =================
    if (loading) {
        return (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )
      }

  return (
    <div
      dir={locale === "en" ? "ltr" : "rtl"}
      className={[locale === "en" ? "ltr" : "rtl", "notificationPage"].join(
        " "
      )}
    >
      <Container maxWidth="xl">
        <div className="first-box">
          <h6 className="header-title">{t("Activity")}</h6>
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
                            style={{
                              backgroundColor: "hsl(211, 68%, 94%)",
                            }}
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

export default UserActivity;
