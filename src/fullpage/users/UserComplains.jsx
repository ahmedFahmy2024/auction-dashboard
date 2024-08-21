import { useTranslation } from "react-i18next";
import { LocalContext } from "../../context/LocalContext";
import { useContext, useEffect, useState } from "react";
import "../../css/userComplain.css";
import { useParams } from "react-router-dom";
import { Axios } from "../../api/Axios";
import { COMPLAINS } from "../../api/Api";
import { useUsers } from "../../context/UsersProvider";
import { green, orange, blue, grey } from "@mui/material/colors";

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const options = {
    month: "short", // Display month in short format (e.g., "May")
    day: "numeric", // Display day of the month (e.g., "20")
    hour: "numeric", // Display hour (e.g., "3")
    minute: "numeric", // Display minute (e.g., "36")
    hour12: true, // Use 12-hour clock with "AM" and "PM"
  };
  return date.toLocaleString(undefined, options);
}

function UserComplains() {
  const { locale, setLocale } = useContext(LocalContext);
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [specificComplain, setSpecificComplain] = useState({});
  const { complains } = useUsers();
  // console.log("complains", complains);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await Axios.get(`${COMPLAINS}/9`);
        // console.log(response.data);
        setSpecificComplain(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchComplaint();
  }, [id]);

  return (
    <div
      dir={locale === "en" ? "ltr" : "rtl"}
      className={[locale === "en" ? "ltr" : "rtl", "usercomplain"].join(" ")}
    >
      <div className="paper">
        <div className="header">
          <div className="content">
            <div className="text">{t("Complains")}</div>
          </div>
        </div>
        <div className="body">
          {complains.map((complain) => {
            return (
              <div key={complain?.id} className="item">
                <div className="text">
                  <div className="row">
                    <div className="first-line">
                      <p className="sentence">{complain?.subject}</p>
                      <p
                      className="status"
                        style={{
                          backgroundColor:
                            complain?.status === "open"
                              ? blue[100]
                              : complain?.status === "in_progress"
                              ? orange[100]
                              : complain?.status === "resolved"
                              ? green[100]
                              : grey[100],
                          color:
                            complain?.status === "open"
                              ? blue[700]
                              : complain?.status === "in_progress"
                              ? orange[700]
                              : complain?.status === "resolved"
                              ? green[700]
                              : grey[700],
                        }}
                      >
                        {complain?.status}
                      </p>
                    </div>
                    <span className="date-time">
                      {formatTimestamp(complain?.created_at)}
                    </span>
                  </div>
                  <div className="second-line">{complain?.body}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UserComplains;
