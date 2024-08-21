import { Container } from '@mui/material';
import { LocalContext } from '../context/LocalContext'
import { useContext, useState, useEffect } from 'react'
import ComplainsTable from '../components/ComplainsTable';
import TableSection from '../components/TableSection';
import { COMPLAINS_COUNT } from '../api/Api';
import { Axios } from '../api/Axios';
import ToastContext from '../context/ToastProvider'

function ComplainsPage() {
  const { locale, setLocale } = useContext(LocalContext);
  const [count, setCount] = useState([]);
  const { showHideToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  //  ====== get all counts ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${COMPLAINS_COUNT}`,)
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "complains"].join(" ")}>
      <Container maxWidth="xl">
        <TableSection
          first="Total Complaints"
          firstLink={count.total_complaints_count}
          second="Complaints Added Last 7 Days"
          secondLink={count.complaints_added_last_seven_days_count}
          third="Complaints Added This Month"
          thirdLink={count.complaints_added_this_month_count}
          forth="Total Users Complaints"
          forthLink={count.total_users_complaints_count}
          fifth="Users Complaints Last 7 Days"
          fifthLink={count.users_complaints_last_seven_days_count}
          sixth="Users Complaints This Month"
          sixthLink={count.users_complaints_this_month_count}
          icon1="octicon:project-roadmap-24"
          icon2="healthicons:i-schedule-school-date-time"
          icon3="iwwa:month"
          icon4="mage:users"
          icon5="hugeicons:complaint"
          icon6="quill:user-sad"
           />
        <ComplainsTable />
      </Container>
    </div>
  )
}

export default ComplainsPage