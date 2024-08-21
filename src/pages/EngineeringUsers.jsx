import { Container } from '@mui/material';
import { LocalContext } from '../context/LocalContext'
import { useContext, useState, useEffect } from 'react'
import TableSection from '../components/TableSection';
import UsersTypesTables from '../components/UsersTypesTables';
import { USERS_COUNT } from '../api/Api';
import { Axios } from '../api/Axios';
import ToastContext from '../context/ToastProvider'

function EngineeringUsers() {
  const { locale, setLocale } = useContext(LocalContext);
  const [count, setCount] = useState([]);
  const { showHideToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  //  ====== get all counts ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${USERS_COUNT}`,)
      .then(function (response) {
        // console.log(response.data);
        setCount(response.data.user_counts.engineering_office);
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "users"].join(" ")}>
      <Container maxWidth="xl">
        <TableSection 
        first="Total Users" 
        firstLink={count.total_users_count} 
        second="Users Added Last 7 Days" 
        secondLink={count.users_added_last_seven_days_count} 
        third="Users Added This Month" 
        thirdLink={count.users_added_this_month_count} 
        icon1="mage:users"
        icon2="icons8:todo-list"
        icon3="iwwa:month" 
        />
        <UsersTypesTables type="engineering_office" Title="Engineering Office" link="https://construction.site-pocket.com/api/export-filtered-users?type=engineering_office" />
      </Container>
    </div>
  )
}

export default EngineeringUsers