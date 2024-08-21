import { LocalContext } from "../../context/LocalContext";
import { useTranslation } from "react-i18next";
import ToastContext from "../../context/ToastProvider";
import { useContext, useState, useEffect, useMemo } from "react";
import "../../css/projectsview.css";
import { PROJECTS, CATEGORIES } from "../../api/Api";
import { Axios } from "../../api/Axios";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MenuIcon from "@mui/icons-material/Menu";

const formatCreatedAt = (createdAt) => {
  const date = new Date(createdAt);
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
};

function ProjectsView() {
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);

  const { id } = useParams();

  //  ====== get all projects ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${PROJECTS}/${id}`)
      .then(function (response) {
        console.log(response.data.project);
        setProjects(response.data.project);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast(error.response.data.message, "error");
        setLoading(false);
      });
  }, []);
  //  ====== get all projects ========

  //  ====== get all categories ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${CATEGORIES}`)
      .then(function (response) {
        console.log(response.data.categories);
        setCategories(response.data.categories);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast(error.response.data.message, "error");
        setLoading(false);
      });
  }, []);
  //  ====== get all categories ========

  // ======================= loading ========================
  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  // Helper function to find category name
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <div
      dir={locale === "en" ? "ltr" : "rtl"}
      className={[locale === "en" ? "ltr" : "rtl", "projectsview"].join(" ")}
    >
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
            <div className="text img-container">
              <span className="img-span">
                <img className="img" src={projects.image_path} alt="" />
              </span>
            </div>
          </div>

          <div className="content">
            <Icon icon="fluent:rename-24-filled" width="24" height="24" />
            <div className="text">
              {t("Title ")}
              <span className="span">{t(`${projects.name}`)}</span>
            </div>
          </div>

          <div className="content">
            <MenuIcon width="24" height="24" />
            <div className="text">
              {t("Description ")}
              <span className="span">{t(`${projects.description}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="iconamoon:category-fill" width="24" height="24" />
            <div className="text">
              {t("Category ")}
              <span className="span">
                {t(`${getCategoryName(projects.project_category_id)}`)}
              </span>
            </div>
          </div>

          <div className="content">
            <Icon icon="mingcute:location-fill" width="24" height="24" />
            <div className="text">
              {t("Country ")}
              <span className="span">{t(`${projects.country}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="mingcute:location-fill" width="24" height="24" />
            <div className="text">
              {t("State ")}
              <span className="span">{t(`${projects.state}`)}</span>
            </div>
          </div>

          <div className="content">
            <Icon icon="lets-icons:date-range-fill" width="24" height="24" />
            <div className="text">
              {t("Created At ")}
              <span className="span">
                {t(`${formatCreatedAt(projects.created_at)}`)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsView;
