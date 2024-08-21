import { LocalContext } from '../../context/LocalContext'
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import { useContext, useState, useEffect, useMemo } from 'react'
import '../../css/projectsview.css'
import { TRANSCATIONS } from '../../api/Api';
import { Axios } from '../../api/Axios';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const formatCreatedAt = (createdAt) => {
  const date = new Date(createdAt);
  const options = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
};

function TranscationsView() {
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [transcation, setTranscation] = useState({});

  const { id } = useParams();

  //  ====== get all projects ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${TRANSCATIONS}/${id}`,)
      .then(function (response) {
        // console.log(response.data.transaction);
        setTranscation(response.data.transaction);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast(error.response.data.message, 'error');
        setLoading(false);
      });
  }, []);
  //  ====== get all projects ========

  // ======================= loading ========================
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "projectsview"].join(" ")}>
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
            <Icon icon="solar:user-bold" width="24" height="24" />
            <div className="text">{t("User Name ")}
              <span className="span">{t(`${transcation.user_id}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="tabler:packages" width="24" height="24" />
            <div className="text">{t("Subscription ")}
              <span className="span">{t(`${transcation.subscription_id}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="game-icons:money-stack" width="24" height="24" />
            <div className="text">{t("Amount ")}
              <span className="span">{t(`${transcation.amount} EGP`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="fluent:payment-24-filled" width="24" height="24" />
            <div className="text">{t("Payment Method ")}
              <span className="span">{t(`${transcation.payment_method}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="mdi:list-status" width="24" height="24" />
            <div className="text">{t("Status ")}
              <span className="span">{t(`${transcation.status}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="lets-icons:date-range-fill" width="24" height="24" />
            <div className="text">{t("Created At ")}
              <span className="span">{t(`${formatCreatedAt(transcation.created_at)}`)}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default TranscationsView