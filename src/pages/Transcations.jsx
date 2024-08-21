import { Container } from '@mui/material';
import { LocalContext } from '../context/LocalContext'
import { useContext, useState, useEffect } from 'react'
import TranscationsTable from '../components/TranscationsTable';
import TableSection from '../components/TableSection';
import { TRANSCATIONS_COUNT } from '../api/Api';
import { Axios } from '../api/Axios';
import ToastContext from '../context/ToastProvider'

function Transcations() {
  const { locale, setLocale } = useContext(LocalContext);
  const [count, setCount] = useState([]);
  const { showHideToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  //  ====== get all counts ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${TRANSCATIONS_COUNT}`,)
      .then(function (response) {
        // console.log(response.data);
        setCount(response?.data);
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "transcations"].join(" ")}>
      <Container maxWidth="xl">
      <TableSection 
      first="Total Transactions" 
      firstLink={count.total_transactions_count} 
      second="Transactions Added Last 7 Days" 
      secondLink={count.transactions_last_seven_days_count} 
      third="Transactions Added This Month" 
      thirdLink={count.transactions_this_month_count} 
      icon1="ep:money"
      icon2="icons8:todo-list"
      icon3="iwwa:month" 
      />
        <TranscationsTable />
      </Container>
    </div>
  )
}

export default Transcations