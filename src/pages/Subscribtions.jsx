import { Container } from '@mui/material';
import { LocalContext } from '../context/LocalContext'
import { useContext, useState, useEffect } from 'react'
import TableSection from '../components/TableSection';
import SubscriptionTable from '../components/SubscriptionTable';
import { SUBSCRIPTIONS_COUNT } from '../api/Api';
import { Axios } from '../api/Axios';
import ToastContext from '../context/ToastProvider'

function Subscribtions() {
  const { locale, setLocale } = useContext(LocalContext);
  const [count, setCount] = useState([]);
  const { showHideToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  //  ====== get all counts ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${SUBSCRIPTIONS_COUNT}`,)
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "subscription"].join(" ")}>
      <Container maxWidth="xl">
        <TableSection 
        first="Total Subscriptions" 
        firstLink={count.total_subscriptions_count} 
        second="Subscriptions Added Last 7 Days" 
        secondLink={count.subscriptions_added_last_seven_days_count} 
        third="Subscriptions Added This Month" 
        thirdLink={count.subscriptions_added_this_month_count} 
        forth="Subscriptions Ends Next 7 Days" 
        forthLink={count.subscriptions_ending_next_seven_days_count} 
        fifth="Subscriptions Ends This Month" 
        fifthLink={count.subscriptions_ending_this_month} 
        icon1="octicon:project-roadmap-24"
        icon2="icons8:todo-list"
        icon3="iwwa:month"
        icon4="healthicons:i-schedule-school-date-time"
        icon5="clarity:date-outline-badged"
        />
        <SubscriptionTable />
      </Container>
    </div>
  )
}

export default Subscribtions