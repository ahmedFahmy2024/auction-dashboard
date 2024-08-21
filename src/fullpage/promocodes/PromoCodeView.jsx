import { LocalContext } from "../../context/LocalContext";
import { useTranslation } from "react-i18next";
import ToastContext from "../../context/ToastProvider";
import { useContext, useState, useEffect } from "react";
import "../../css/projectsview.css";
import { PROMOCODDES, USERS } from "../../api/Api";
import { Axios } from "../../api/Axios";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MenuIcon from "@mui/icons-material/Menu";

const formatCreatedAt = (createdAt) => {
  const date = new Date(createdAt);
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
};

const PromoCodeView = () => {
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [updateInput, setUpdateInput] = useState({});
  const [users, setUsers] = useState([]);

    //  ====== get specific promo code ========
    useEffect(() => {
      setLoading(true);
      Axios.get(`${PROMOCODDES}/${id}`,)
        .then(function (response) {
          console.log(response.data);
          const data = response.data;
          setUpdateInput(data);
          setLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          showHideToast("Something went wrong", 'error');
          setLoading(false);
        });
    }, []);
    //  ====== get specific promo code ========

    //  ====== get users ========
    useEffect(() => {
      setLoading(true);
      Axios.get(`${USERS}`,)
        .then(function (response) {
          // console.log(response.data.users);
          const data = response.data.users;
          setUsers(data);
          setLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          showHideToast("Something went wrong", 'error');
          setLoading(false);
        });
    }, []);
    //  ====== get users ========

  // ======================= loading ========================
  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  // Helper function to find user name
  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : null;
  };
  return (
    <div
      dir={locale === "en" ? "ltr" : "rtl"}
      className={[locale === "en" ? "ltr" : "rtl", "projectsview"].join(" ")}
    >
      <div className="paper head">
        <div className="header">
          <div className="content">
            <div className="text">{t("Details")}</div>
          </div>
        </div>
      </div>

      <div className="paper">
        <div className="body">

          <div className="content">
            <Icon icon="fluent:rename-24-filled" width="24" height="24" />
            <div className="text">
              {t("Code ")}
              <span className="span">{t(`${updateInput.code}`)}</span>
            </div>
          </div>

          <div className="content">
            <MenuIcon width="24" height="24" />
            <div className="text">
              {t("Duration ")}
              <span className="span">{t(`${updateInput.duration}`)} {t("Days")}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="iconamoon:category-fill" width="24" height="24" />
            <div className="text">
              {t("Expire Date ")}
              <span className="span">
                {t(`${updateInput.expire_date}`)}
              </span>
            </div>
          </div>

          <div className="content">
            <Icon icon="mingcute:location-fill" width="24" height="24" />
            <div className="text">
              {t("Usage Count ")}
              <span className="span">{t(`${updateInput.usage_count_count}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="mingcute:location-fill" width="24" height="24" />
            <div className="text">
              {t("User Name ")}
              <span className="span">{t(`${getUserName(updateInput.user_id)}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="lets-icons:date-range-fill" width="24" height="24" />
            <div className="text">
              {t("Created At ")}
              <span className="span">
                {t(`${formatCreatedAt(updateInput.created_at)}`)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromoCodeView