import { LocalContext } from '../../context/LocalContext'
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import { useContext, useState, useEffect, useMemo } from 'react'
import '../../css/projectsview.css'
import { ADD_REQUESTS } from '../../api/Api';
import { Axios } from '../../api/Axios';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import pdf from '../../assets/pdf.svg'

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const formatCreatedAt = (createdAt) => {
  const date = new Date(createdAt);
  const options = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
};

function isImageFile(file) {
  if (typeof file === 'string') {
    // If it's a URL, check the file extension
    return /\.(jpeg|jpg|gif|png)$/i.test(file);
  } else if (file instanceof File) {
    // If it's a File object, check the MIME type
    return file.type.startsWith('image/');
  }
  return false;
}

function RequestView() {
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState({});

  const { id } = useParams();

  //  ====== get all projects ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${ADD_REQUESTS}/${id}`,)
      .then(function (response) {
        // console.log(response.data.request_quote);
        setRequest(response.data.request_quote);
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

              <div className="content-img">
                  <Icon icon="fa-solid:images" width="24" height="24" />
                  <div style={{ border: 'none'}} className="text img-container">
                    <span className="img-span">
                    <a href={request.upload_file} download target="_blank" rel="noopener noreferrer">
                      <img style={{top:0 , left:0 }} className="img" src={isImageFile(request.upload_file) ? request.upload_file : pdf} alt="" />
                      </a>
                    </span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="solar:user-bold" width="24" height="24" />
                  <div className="text">{t("User ")}
                    <span className="span">{t(`${request?.user?.name}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="fluent:rename-24-filled"  width="24" height="24" />
                  <div className="text">{t("Title ")}
                    <span className="span">{t(`${request.name}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="fluent:text-description-24-filled" width="24" height="24" />
                  <div className="text">{t("Description ")}
                    <span className="span">{t(`${request.description}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="iconamoon:category-fill" width="24" height="24" />
                  <div className="text">{t("Category ")}
                    <span className="span">{t(`${request.category}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="mage:file-2-fill" width="24" height="24" />
                  <div className="text">{t("Type ")}
                    <span className="span">{t(`${request.type}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="mingcute:location-fill" width="24" height="24" />
                  <div className="text">{t("Country ")}
                    <span className="span">{t(`${request.country}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="mingcute:location-fill" width="24" height="24" />
                  <div className="text">{t("State ")}
                    <span className="span">{t(`${request.state}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="lets-icons:date-range-fill" width="24" height="24" />
                  <div className="text">{t("Created At ")}
                    <span className="span">{t(`${formatCreatedAt(request.created_at)}`)}</span>
                  </div>
                </div>
                <div className="content">
                <Icon icon="mdi:list-status" width="24" height="24" />
                  <div className="text">{t("Status ")}
                    <span className="span">{t(`${request.status}`)}</span>
                  </div>
                </div>

              </div>
            </div>

    </div>
  )
}

export default RequestView