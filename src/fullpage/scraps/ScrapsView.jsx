import { LocalContext } from '../../context/LocalContext'
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import { useContext, useState, useEffect, useMemo } from 'react'
import '../../css/projectsview.css'
import { SCRAPS } from '../../api/Api';
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

function ScrapsView() {
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [scraps, setScraps] = useState({});

  const { id } = useParams();

  //  ====== get all projects ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${SCRAPS}/${id}`,)
      .then(function (response) {
        // console.log(response.data.scrap);
        setScraps(response.data.scrap);
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
  // Split images string into an array
  const imageUrls = scraps.images ? scraps.images.split(',') : [];
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

          <Icon className='first-icon' icon="fa-solid:images" width="24" height="24" />
          <div className='images-contain'>
            {imageUrls.map((image, index) => (
              <div className='preview' key={index}>
                <span className='prev-image'>
                  <img src={image} alt="" />
                </span>
              </div>
            ))}
          </div>

          <div className="content">
            <Icon icon="solar:user-bold" width="24" height="24" />
            <div className="text">{t("Name ")}
              <span className="span">{t(`${scraps?.user?.name}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="fluent:rename-24-filled" width="24" height="24" />
            <div className="text">{t("Title ")}
              <span className="span">{t(`${scraps.name}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="fluent:text-description-24-filled" width="24" height="24" />
            <div className="text">{t("Description ")}
              <span className="span">{t(`${scraps.description}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="iconamoon:category-fill" width="24" height="24" />
            <div className="text">{t("Category ")}
              <span className="span">{t(`${scraps.category}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="ph:list-numbers-fill" width="24" height="24" />
            <div className="text">{t("Quantity ")}
              <span className="span">{t(`${scraps.quantity}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="material-symbols:order-approve" width="24" height="24" />
            <div className="text">{t("Min Quantity ")}
              <span className="span">{t(`${scraps.min_quantity}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="formkit:unit" width="24" height="24" />
            <div className="text">{t("Unit ")}
              <span className="span">{t(`${scraps.unit}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="game-icons:money-stack" width="24" height="24" />
            <div className="text">{t("Max Bid Price ")}
              <span className="span">{t(`${scraps.max_bid_price}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="mdi:counter" width="24" height="24" />
            <div className="text">{t("Bid Count ")}
              <span className="span">{t(`${scraps.bid_count}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="mingcute:location-fill" width="24" height="24" />
            <div className="text">{t("Location ")}
              <span className="span">{t(`${scraps.location}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="lets-icons:date-range-fill" width="24" height="24" />
            <div className="text">{t("Created At ")}
              <span className="span">{t(`${formatCreatedAt(scraps.created_at)}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="lets-icons:date-range-fill" width="24" height="24" />
            <div className="text">{t("End At ")}
              <span className="span">{t(scraps.scrap_duration)}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default ScrapsView