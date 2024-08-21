import { Container } from '@mui/material';
import { LocalContext } from '../context/LocalContext'
import { useContext, useState, useEffect } from 'react'
import ProjectsTable from '../components/ProjectsTable';
import TableSection from '../components/TableSection';
import { PROJECTS_COUNT } from '../api/Api';
import { Axios } from '../api/Axios';
import ToastContext from '../context/ToastProvider'

function Projects() {
  const { locale, setLocale } = useContext(LocalContext);
  const [count, setCount] = useState([]);
  const { showHideToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  //  ====== get all counts ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${PROJECTS_COUNT}`,)
      .then(function (response) {
        // console.log(response.data);
        setCount(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast(error.message, 'error');
        setLoading(false);
      });
  }, []);
  //  ====== get all counts ========

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "projects"].join(" ")}>
      <Container maxWidth="xl">
        <TableSection
          first="Total Projects"
          firstLink={count.total_projects_count}
          second="Projects Added Last 7 Days"
          secondLink={count.projects_added_last_seven_days_count}
          third="Projects Added This Month"
          thirdLink={count.projects_added_this_month_count}
          icon1="octicon:project-roadmap-24"
          icon2="healthicons:i-schedule-school-date-time"
          icon3="iwwa:month"
        />
        <ProjectsTable />
      </Container>
    </div>
  )
}

export default Projects