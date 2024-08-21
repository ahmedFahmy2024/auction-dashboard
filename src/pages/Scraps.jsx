import { Container } from '@mui/material';
import { LocalContext } from '../context/LocalContext'
import { useContext, useState, useEffect } from 'react'
import ScrapsTable from '../components/ScrapsTable';
import TableSection from '../components/TableSection';
import { SCRAP_COUNT } from '../api/Api';
import { Axios } from '../api/Axios';
import ToastContext from '../context/ToastProvider'

function Scraps() {
  const { locale, setLocale } = useContext(LocalContext);
  const [count, setCount] = useState([]);
  const { showHideToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  //  ====== get all counts ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${SCRAP_COUNT}`,)
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "scraps"].join(" ")}>
      <Container maxWidth="xl">
        <TableSection 
        first="Total Scraps" 
        firstLink={count.total_scraps_count} 
        second="Scraps Added Last 7 Days" 
        secondLink={count.scraps_added_last_seven_days_count} 
        third="Scraps Added This Month" 
        thirdLink={count.scraps_added_this_month_count} 
        icon1="hugeicons:crane"
        icon2="healthicons:i-schedule-school-date-time"
        icon3="iwwa:month"
        />
        <ScrapsTable />
      </Container>
    </div>
  )
}

export default Scraps