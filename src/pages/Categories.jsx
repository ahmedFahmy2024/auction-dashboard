import { Container } from '@mui/material';
import { LocalContext } from '../context/LocalContext'
import { useContext, useState, useEffect } from 'react'
import CategoriesTable from '../components/CategoriesTable';
import TableSection from '../components/TableSection';
import { CATEGORIES_COUNT } from '../api/Api';
import {Axios} from '../api/Axios';
import ToastContext from '../context/ToastProvider'

function Categories() {
  const { locale, setLocale } = useContext(LocalContext);
  const [count, setCount] = useState([]);
  const { showHideToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);


      //  ====== get all counts ========
      useEffect(() => {
        setLoading(true);
        Axios.get(`${CATEGORIES_COUNT}`,)
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "categories"].join(" ")}>
      <Container maxWidth="xl">
      <TableSection 
      first="Total Categories" 
      firstLink={count.total_categories_count} 
      second="Categories Added Last 7 Days" 
      secondLink={count.categories_added_last_seven_days_count} 
      third="Categories Added This Month" 
      thirdLink={count.categories_added_this_month_count}
      icon1="octicon:project-roadmap-24"
      icon2="healthicons:i-schedule-school-date-time"
      icon3="iwwa:month"
      />
        <CategoriesTable />
      </Container>
    </div>
  )
}

export default Categories