import { LocalContext } from '../../context/LocalContext'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next';
import "../../css/userMessage.css"
import { Icon } from '@iconify/react';
import { Axios } from '../../api/Axios';
import { SUPPLIER_REGISTRATION } from '../../api/Api';
import { useParams } from 'react-router-dom';
import ToastContext from '../../context/ToastProvider';
import pdf from '../../assets/pdf.svg'

import IconButton from '@mui/material/IconButton';

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

function RegistrationChat({ complains, setUpdateTrigger }) {
  const [addInput, setAddInput] = useState("");
  const { locale, setLocale } = useContext(LocalContext);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { showHideToast } = useContext(ToastContext);
  const { id } = useParams();

  console.log("complains", complains)
  // console.log("addInput", addInput)

  // ================= edit complain ================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const param = {
      response: addInput
    };

    try {
      const response = await Axios.put(`${SUPPLIER_REGISTRATION}/${id}`, param);
      // console.log(response);
      setLoading(false);
      setUpdateTrigger((prev) => prev + 1);
      setAddInput("");
    } catch (error) {
      console.log(error);
      showHideToast(t("An error occurred. Please try again."), "error");
      setLoading(false);
    }
  };
  // ================= edit complain ================

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
      month: 'short', // Display month in short format (e.g., "May")
      day: 'numeric', // Display day of the month (e.g., "20")
      hour: 'numeric', // Display hour (e.g., "3")
      minute: 'numeric', // Display minute (e.g., "36")
      hour12: true // Use 12-hour clock with "AM" and "PM"
    };
    return date.toLocaleString(undefined, options);
  }

  return (
    <div
      dir={locale === "en" ? "ltr" : "rtl"}
      className={[locale === "en" ? "ltr" : "rtl", "chat-area-main"].join(
        " "
      )}
    >
      <div className="first-box">
        <div
          className="first-row-title modifysize"
          style={{ flexDirection: "column", alignItems: "flex-start" }}
        >
          <div className="item-row">
            <h4 className="title">{t("Name")}:</h4>
            <div className="header-title">{complains?.contact_person_name}</div>
          </div>
          <div className="item-row">
            <h4 className="title">{t("Email")}:</h4>
            <div className="header-title">{complains?.email_address}</div>
          </div>
          <div className="item-row">
            <h4 className="title">{t("Phone")}:</h4>
            <div className="header-title">{complains?.phone_number}</div>
          </div>
          <div className="item-row">
            <h4 className="title">{t("Job Title")}:</h4>
            <div className="header-title">{complains?.job_title}</div>
          </div>
          <div className="item-row">
            <h4 className="title">{t("Location")}:</h4>
            <div className="header-title">{complains?.location}</div>
          </div>
          <div className="item-row">
            <h4 className="title">{t("Company Name")}:</h4>
            <div className="header-title">{complains?.company_name}</div>
          </div>
          <div className="item-row">
            <h4 className="title">{t("Company Qualification")}:</h4>
            <div className="header-title">{complains?.company_name_qualification}</div>
          </div>
          <div className="item-row">
            <h4 className="title">{t("Commercial Registration Number")}:</h4>
            <div className="header-title">{complains?.commercial_registration_number}</div>
          </div>
          <div className="item-row">
            <h4 className="title">{t("Website")}:</h4>
            <a style={{ color: "inherit" }} href={complains?.website} className="header-title">{complains?.website}</a>
          </div>
          <div className="stack">
            <div className="item-row">
              <h4 className="title">{t("Official Document")}:</h4>
              <a style={{ width: "40px", aspectRatio: "1/1" }} href={complains?.official_document} target="_blank" rel="noopener noreferrer">
              <img className="img-limit" src={isImageFile(complains?.official_document) ? complains?.official_document : pdf} alt="" />
              </a>
            </div>
            <div className="item-row">
              <h4 className="title">{t("Profile")}:</h4>
              <a style={{ width: "40px", aspectRatio: "1/1" }} href={complains?.profile} target="_blank" rel="noopener noreferrer">
              <img className="img-limit" src={isImageFile(complains?.profile) ? complains?.profile : pdf} alt="" />
              </a>
            </div>
          </div>

        </div>
        <div className=""></div>

        <div className="first-row-chat">
          {complains?.responses?.map((response) => (
            <div className="message" key={response.id}>
              {response?.user_id === complains?.user.id ? (
                <div className="chat-msg admin">
                  <div className="chat-msg-profile">
                    <img
                      className="chat-msg-img"
                      src={response?.user?.profile_image}
                      alt=""
                    />
                    <div className="chat-msg-date">
                      {formatTimestamp(response?.created_at)}
                    </div>
                  </div>
                  <div className="chat-msg-content">
                    <div className="chat-msg-text">{response?.response}</div>
                  </div>
                </div>
              ) : (
                <div className="chat-msg user">
                  <div className="chat-msg-profile">
                    <img
                      className="chat-msg-img"
                      src={response?.user?.profile_image}
                      alt=""
                    />
                    <div className="chat-msg-date">
                      {formatTimestamp(response?.created_at)}
                    </div>
                  </div>
                  <div className="chat-msg-content">
                    <div className="chat-msg-text">{response?.response}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="first-row-input">
          <div className="input-box">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
              value={addInput}
              onChange={(e) => setAddInput(e.target.value)}
              type="text"
              placeholder={t("Type here...")}
            />
            <IconButton onClick={handleSubmit}>
              <Icon icon="lets-icons:send-hor-light" width="28" height="28" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationChat