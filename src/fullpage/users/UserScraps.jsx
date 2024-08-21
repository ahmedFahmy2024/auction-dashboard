import React from 'react'
import "../../css/userScraps.css"
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext';
import { useContext } from 'react';
import { Icon } from '@iconify/react';
import { useUsers } from '../../context/UsersProvider';

import Grid from '@mui/material/Unstable_Grid2';

const formatCreatedAt = (createdAt) => {
  const date = new Date(createdAt);
  const options = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
};

function UserScraps() {
  const { scraps } = useUsers();
  const { locale, setLocale } = useContext(LocalContext);
  const { t, i18n } = useTranslation();

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "userScraps"].join(" ")}>
      <Grid container spacing={2}>
        {scraps?.map((scrap) => {
          // Split images string into an array
          const imageUrls = scrap?.images ? scrap?.images.split(',') : [];
          return (
            <Grid xs={12} md={4} key={scrap.id}>
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
                    <Icon icon="fluent:rename-24-filled" width="24" height="24" />
                    <div className="text">{t("Title ")}
                      <span className="span">{t(`${scrap?.name}`)}</span>
                    </div>
                  </div>

                  <div className="content">
                    <Icon icon="fluent:text-description-24-filled" width="24" height="24" />
                    <div className="text">{t("Description ")}
                      <span className="span">{t(`${scrap?.description}`)}</span>
                    </div>
                  </div>

                  <div className="content">
                    <Icon icon="iconamoon:category-fill" width="24" height="24" />
                    <div className="text">{t("Category ")}
                      <span className="span">{t(`${scrap?.category}`)}</span>
                    </div>
                  </div>

                  <div className="content">
                    <Icon icon="ph:list-numbers-fill" width="24" height="24" />
                    <div className="text">{t("Quantity ")}
                      <span className="span">{t(`${scrap?.quantity}`)}</span>
                    </div>
                  </div>

                  <div className="content">
                    <Icon icon="material-symbols:order-approve" width="24" height="24" />
                    <div className="text">{t("Min Quantity ")}
                      <span className="span">{t(`${scrap?.min_quantity}`)}</span>
                    </div>
                  </div>

                  <div className="content">
                    <Icon icon="formkit:unit" width="24" height="24" />
                    <div className="text">{t("Unit ")}
                      <span className="span">{t(`${scrap?.unit}`)}</span>
                    </div>
                  </div>

                  <div className="content">
                    <Icon icon="mingcute:location-fill" width="24" height="24" />
                    <div className="text">{t("Location ")}
                      <span className="span">{t(`${scrap?.location}`)}</span>
                    </div>
                  </div>

                  <div className="content">
                    <Icon icon="lets-icons:date-range-fill" width="24" height="24" />
                    <div className="text">{t("Created At ")}
                      <span className="span">{t(`${formatCreatedAt(scrap?.created_at)}`)}</span>
                    </div>
                  </div>

                </div>
              </div>
            </Grid>
          )
        })}

      </Grid>
    </div>
  )
}

export default UserScraps