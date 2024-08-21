import { Container } from '@mui/material';
import { LocalContext } from '../context/LocalContext'
import { useContext, useState, useEffect } from 'react'
import PackagesTable from '../components/PackagesTable';
import TableSection from '../components/TableSection';
import { SUBSCRIPTIONS_COUNT } from '../api/Api';
import { Axios } from '../api/Axios';
import ToastContext from '../context/ToastProvider'

function Packages() {
  const { locale, setLocale } = useContext(LocalContext);
  const [count, setCount] = useState([]);
  const { showHideToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  //  ====== get all counts ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${SUBSCRIPTIONS_COUNT}`,)
      .then(function (response) {
        // console.log(response.data.subscriptions_by_package);
        setCount(response?.data?.subscriptions_by_package);
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "packages"].join(" ")}>
      <Container maxWidth="xl">
      <TableSection 
          first="3 Months Gold Subscriptions" 
          firstLink={count["الباقة الذهبية 3 شهور"]} 
          second="6 Months Gold Subscriptions" 
          secondLink={count["الباقة الذهبية 6 شهور"]}
          third="12 Months Gold Subscriptions" 
          thirdLink={count["الباقة الذهبية 12 شهور"]}

          forth="3 Months Silver Subscriptions" 
          forthLink={count["الباقة الفضية 3 شهور"]}
          fifth="6 Months Silver Subscriptions" 
          fifthLink={count["الباقة الفضية 6 شهور"]}
          sixth="12 Months Silver Subscriptions" 
          sixthLink={count["الباقة الفضية 12 شهور"]} 

          seventh="3 Months Scrap Subscriptions" 
          seventhLink={count["الباقة سكراب 3 شهور"]}
          eighth="6 Months Scrap Subscriptions" 
          eighthLink={count["الباقة سكراب 6 شهور"]}
          ninth="12 Months Scrap Subscriptions" 
          ninthLink={count["الباقة سكراب 12 شهور"]}

          icon1="streamline:subscription-cashflow"
          icon2="streamline:subscription-cashflow"
          icon3="streamline:subscription-cashflow"
          icon4="streamline:subscription-cashflow"
          icon5="streamline:subscription-cashflow"
          icon6="streamline:subscription-cashflow"
          icon7="streamline:subscription-cashflow"
          icon8="streamline:subscription-cashflow"
          icon9="streamline:subscription-cashflow"

          gold="#FFF1D3"
          silver="#EBF5F6"
          scrap="#FFEAE2"

        />
        <PackagesTable />
      </Container>
    </div>
  )
}

export default Packages