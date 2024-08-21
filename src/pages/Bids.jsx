import { Container } from '@mui/material';
import { LocalContext } from '../context/LocalContext'
import { useContext, useState, useEffect } from 'react'
import BidsTable from '../components/BidsTable';
import TableSection from '../components/TableSection';
import { BIDS_COUNT } from '../api/Api';
import { Axios } from '../api/Axios';
import ToastContext from '../context/ToastProvider'

function Bids() {
  const { locale, setLocale } = useContext(LocalContext);
  const [count, setCount] = useState([]);
  const { showHideToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  //  ====== get all counts ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${BIDS_COUNT}`,)
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "bids"].join(" ")}>
      <Container maxWidth="xl">
        <TableSection 
        first="Total Bids" 
        firstLink={count.total_bids_count} 
        second="Bids Added Last 7 Days" 
        secondLink={count.bids_added_last_seven_days_count} 
        third="Bids Added This Month" 
        thirdLink={count.bids_added_this_month_count} 
        icon1="streamline:justice-hammer"
        icon2="healthicons:i-schedule-school-date-time"
        icon3="iwwa:month"
        />
        <BidsTable />
      </Container>
    </div>
  )
}

export default Bids