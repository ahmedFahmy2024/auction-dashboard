import { useState, useContext } from "react";
import { LocalContext } from '../../context/LocalContext'
import "../../css/usersView.css"
import { useTranslation } from 'react-i18next';
import BreadCrumbs from "../../components/BreadCrumbs";
import { Icon } from '@iconify/react';
import { Outlet, NavLink, useParams } from 'react-router-dom';
import { UsersProvider } from "../../context/UsersProvider";
import ProfileNameEmail from "../../components/ProfileNameEmail";

import Container from '@mui/material/Container';


const array1 = [
  { key: 'Profile', icon: <Icon icon="solar:user-id-bold" width="22" height="22" />, path: "." },
  { key: 'Current Subscription', icon: <Icon icon="streamline:subscription-cashflow" width="22" height="22" />, path: "user-subscriptions" },
  { key: 'Transactions', icon: <Icon width='22' height='22' icon="ep:money" />, path: "user-transcations" },
  { key: 'Requests', icon: <Icon icon="bi:file-text" width="22" height="22" />, path: "user-requests" },
  { key: 'Portfolio', icon: <Icon icon="iconamoon:profile-circle-light" width="22" height="22" />, path: "user-portfolio" },
  { key: 'Scraps', icon: <Icon icon="hugeicons:crane" width="22" height="22" />, path: "user-scraps" },
  { key: 'Bids', icon: <Icon icon="streamline:justice-hammer" width="22" height="22" />, path: "user-bids" },
  { key: 'Messages', icon: <Icon icon="mingcute:message-4-line" width="22" height="22" />, path: "user-messages" },
  { key: 'Activity', icon: <Icon icon="ion:extension-puzzle-outline" width="22" height="22" />, path: "user-activity" },
  { key: 'Complains', icon: <Icon icon="hugeicons:complaint" width="22" height="22" />, path: "user-complains" },
];

function UsersView() {
  const [selectedButton, setSelectedButton] = useState('Profile');
  const { locale, setLocale } = useContext(LocalContext);
  const { t, i18n } = useTranslation();
  const { id } = useParams();

// console.log("id", id)

  return (
    <UsersProvider id={id}>
      <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "usersView"].join(" ")}>
        <Container maxWidth="lg">

          <div className="box1">
            <div className="stack">
              <div className="firstbox">
                <h4 className="title">{t("Profile")}</h4>
                <div className="nav">
                  <BreadCrumbs />
                </div>
              </div>
            </div>
          </div>

          <div className="box2">
            <div className="paper">
              <ProfileNameEmail />
              <div className="second">
                <div className="scrollbar"></div>
                <div className="scrollbarX">
                  <div className="container">
                    {array1.map((item, index) => (
                      <NavLink to={item.path} key={index} className={`button ${selectedButton === item.key ? "selected" : ""}`} onClick={() => setSelectedButton(item.key)}>
                        <span className="icon">{item.icon}</span>
                        <span style={{ fontSize: '12px' }} className="text">{t(item.key)}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="box3">
            <Outlet />
          </div>

        </Container>

      </div>
    </UsersProvider>
  )
}

export default UsersView
