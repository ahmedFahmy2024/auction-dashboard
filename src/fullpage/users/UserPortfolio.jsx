import React from 'react'
import "../../css/userRequest.css"
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext';
import { useContext } from 'react';
import { Icon } from '@iconify/react';
import { useUsers } from '../../context/UsersProvider';
import pdf from '../../assets/pdf.svg'

import Grid from '@mui/material/Unstable_Grid2';

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

function UserPortfolio() {
  const { portfolios } = useUsers();
  const { locale, setLocale } = useContext(LocalContext);
  const { t, i18n } = useTranslation();

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "userRequest"].join(" ")}>
      <Grid container spacing={2}>
        {portfolios?.map((portfolio) => (
          <Grid xs={12} md={4} key={portfolio.id}>
            <div className="paper">
              <div className="body">

                <div className="content-img">
                  <Icon icon="fa-solid:images" width="24" height="24" />
                  <div className="text img-container">
                    <span className="img-span">
                      <a href={portfolio.image_path} download target="_blank" rel="noopener noreferrer">
                        <img className="img" src={isImageFile(portfolio.image_path) ? portfolio.image_path : pdf} alt="" />
                      </a>
                    </span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="fluent:rename-24-filled" width="24" height="24" />
                  <div className="text">{t("Title ")}
                    <span className="span">{t(`${portfolio?.name}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="fluent:text-description-24-filled" width="24" height="24" />
                  <div className="text">{t("Description ")}
                    <span className="span">{t(`${portfolio?.description}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="lets-icons:date-range-fill" width="24" height="24" />
                  <div className="text">{t("Created At: ")}
                    <span className="span">{t(`${formatCreatedAt(portfolio?.created_at)}`)}</span>
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

export default UserPortfolio