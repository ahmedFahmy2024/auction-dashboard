import { Container } from '@mui/material';
import { LocalContext } from '../context/LocalContext'
import { useContext, useState, useEffect } from 'react'
import PortfolioTable from '../components/PortfolioTable';
import TableSection from '../components/TableSection';
import { PORTFOLIOS_COUNT } from '../api/Api';
import { Axios } from '../api/Axios';
import ToastContext from '../context/ToastProvider'

function Portfolio() {
  const { locale, setLocale } = useContext(LocalContext);
  const [count, setCount] = useState([]);
  const { showHideToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  //  ====== get all counts ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${PORTFOLIOS_COUNT}`,)
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "portfolio"].join(" ")}>
      <Container maxWidth="xl">
        <TableSection 
        first="Total Portfolios" 
        firstLink={count.total_portfolios_count} 
        second="Portfolios Added Last 7 Days" 
        secondLink={count.portfolios_added_last_seven_days_count} 
        third="Portfolios Added This Month" 
        thirdLink={count.portfolios_added_this_month_count} 
        icon1="iconamoon:profile-circle-light"
        icon2="healthicons:i-schedule-school-date-time"
        icon3="iwwa:month"
        />
        <PortfolioTable />
      </Container>
    </div>
  )
}

export default Portfolio