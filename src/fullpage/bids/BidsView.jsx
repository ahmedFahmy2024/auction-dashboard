import { LocalContext } from '../../context/LocalContext'
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import { useContext, useState, useEffect, useMemo } from 'react'
import '../../css/projectsview.css'
import { SPECIFIC_BID, SCRAPS } from '../../api/Api';
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

function BidsView() {
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [bids, setBids] = useState([]);
  const [scraps, setScraps] = useState([]);

  const { id } = useParams();

    //  ====== get specific Bid ========
    useEffect(() => {
      setLoading(true);
      Axios.get(`${SPECIFIC_BID}/${id}`,)
        .then(function (response) {
          // console.log("bids",response.data.bid);
          setBids(response.data.bid);
          setLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          showHideToast(error.response.data.message, 'error');
          setLoading(false);
        });
    }, []);
    //  ====== get specific Bid ========

    //  ====== get specific scrap & user ========
    useEffect(() => {
      setLoading(true);
      Axios.get(`${SCRAPS}`,)
        .then(function (response) {
          // console.log("scraps",response.data.scraps);
          setScraps(response.data.scraps);
          setLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          showHideToast(error.response.data.message, 'error');
          setLoading(false);
        });
    }, []);
    //  ====== get specific scrap & user ========

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

    // Find the scrap name by scrap_id
    const getScrapName = (scrapId) => {
      const scrap = scraps.find(s => s.id === scrapId);
      return scrap ? scrap.name : '';
    };

    // Find the user name by user_id
    const getUserName = (userId) => {
      const user = scraps.find(s => s?.user?.id === userId);
      return user ? user?.user?.name : '';
    };

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
            <div className="text">{t("User ")}
              <span className="span">{t(`${getUserName(bids.user_id)}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="solar:user-bold" width="24" height="24" />
            <div className="text">{t("Scrap ")}
              <span className="span">{t(`${getScrapName(bids.scrap_id)}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="fluent:rename-24-filled" width="24" height="24" />
            <div className="text">{t("Price ")}
              <span className="span">{t(`${bids.price}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="fluent:text-description-24-filled" width="24" height="24" />
            <div className="text">{t("Quantity ")}
              <span className="span">{t(`${bids.quantity}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="lets-icons:date-range-fill" width="24" height="24" />
            <div className="text">{t("Created At ")}
              <span className="span">{t(`${formatCreatedAt(bids.created_at)}`)}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default BidsView