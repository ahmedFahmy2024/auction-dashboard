import { Container } from '@mui/material';
import { LocalContext } from '../context/LocalContext'
import { useContext, useState, useEffect } from 'react'
import RequestsTable from '../components/RequestsTable';
import TableSection from '../components/TableSection';
import { REQUESTS_COUNT } from '../api/Api';
import { Axios } from '../api/Axios';
import ToastContext from '../context/ToastProvider'

function Requests() {
  const { locale, setLocale } = useContext(LocalContext);
  const [count, setCount] = useState([]);
  const { showHideToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  //  ====== get all counts ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${REQUESTS_COUNT}`,)
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "requests"].join(" ")}>
      <Container maxWidth="xl">
        <TableSection 
        first="Total Requests" 
        firstLink={count.total_requests_count} 
        second="Requests Added Last 7 Days" 
        secondLink={count.requests_added_last_seven_days_count} 
        third="Requests Added This Month" 
        thirdLink={count.requests_added_this_month_count} 
        icon1="bi:file-text"
        icon2="healthicons:i-schedule-school-date-time"
        icon3="iwwa:month"
        />
        <RequestsTable />
      </Container>
    </div>
  )
}

export default Requests