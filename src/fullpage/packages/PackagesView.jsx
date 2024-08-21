import { LocalContext } from '../../context/LocalContext'
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import { useContext, useState, useEffect, useMemo } from 'react'
import '../../css/packageview.css'
import { PACKAGES } from '../../api/Api';
import { Axios } from '../../api/Axios';
import { Icon } from '@iconify/react';
import Grid from '@mui/material/Unstable_Grid2';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const formatCreatedAt = (createdAt) => {
  const date = new Date(createdAt);
  const options = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
};

function PackagesView() {
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);

  //  ====== get all projects ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${PACKAGES}`,)
      .then(function (response) {
        // console.log(response.data);
        setPackages(response.data);
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "packageview"].join(" ")}>
      <div className="paper head">
        <div className="header">
          <div className="content">
            <div className="text">{t("Details")}</div>
          </div>
        </div>
      </div>
      <Grid container spacing={2}>

        {packages.map((item) => (
          <Grid xs={12} md={4} key={item.id}>
            <div className="paper">
              <div className="body">

                <div className="content">
                  <Icon icon="fluent:rename-24-filled" width="24" height="24" />
                  <div className="text">{t("Title")}
                    <span className="span">{t(`${item.name}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="solar:calendar-bold" width="24" height="24" />
                  <div className="text">{t("Duration ")}
                    <span className="span">{t(`${item.duration}`)} {t(`Days`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="game-icons:money-stack" width="24" height="24" />
                  <div className="text">{t("Price ")}
                    <span className="span">{t(`${item.price}`)} {t(`EGP`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="lets-icons:date-range-fill" width="24" height="24" />
                  <div className="text">{t("Created At ")}
                    <span className="span">{t(`${formatCreatedAt(item.created_at)}`)}</span>
                  </div>
                </div>

              </div>
            </div>
          </Grid>
        ))}

      </Grid>



    </div>
  )
}

export default PackagesView