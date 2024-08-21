import { Container } from '@mui/material';
import { LocalContext } from '../context/LocalContext'
import { useContext, useEffect, useState } from 'react'
import SupplierRegistrationTable from '../components/SupplierRegistrationTable';
import ToastContext from '../context/ToastProvider';
import { SUPPLIER_COUNT } from '../api/Api';
import { Axios } from '../api/Axios';
import TableSection from '../components/TableSection';


function SupplierRegistration() {
  const { locale, setLocale } = useContext(LocalContext);
  const [count, setCount] = useState([]);
  const { showHideToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  //  ====== get all counts ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${SUPPLIER_COUNT}`,)
      .then(function (response) {
        console.log(response.data);
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
    <div style={{ marginBottom: "50px" }} dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "supplierRegistration"].join(" ")}>
      <Container maxWidth="xl">
      <TableSection
          first="Total Supplier Registrations"
          firstLink={count.total_supplier_registrations_count}
          second="Supplier Registrations Added Last 7 Days"
          secondLink={count.supplier_registrations_added_last_seven_days_count}
          third="Supplier Registrations Added This Month"
          thirdLink={count.supplier_registrations_added_this_month_count}
          forth="Total Users Supplier Registrations"
          forthLink={count.total_users_supplier_registrations_count}
          fifth="Users Supplier Registrations Last 7 Days"
          fifthLink={count.users_supplier_registrations_last_seven_days_count}
          sixth="Users Supplier Registrations This Month"
          sixthLink={count.users_supplier_registrations_this_month_count}
          icon1="octicon:project-roadmap-24"
          icon2="healthicons:i-schedule-school-date-time"
          icon3="iwwa:month"
          icon4="mage:users"
          icon5="hugeicons:complaint"
          icon6="quill:user-sad"
           />
        <SupplierRegistrationTable />
      </Container>
    </div>
  )
}

export default SupplierRegistration