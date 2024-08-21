import { Container } from '@mui/material';
import { LocalContext } from '../context/LocalContext'
import { useContext, useEffect, useState } from 'react'
import DigitalTransformationTable from '../components/DigitalTransformationTable';
import ToastContext from '../context/ToastProvider';
import { Digital_COUNT } from '../api/Api';
import { Axios } from '../api/Axios';
import TableSection from '../components/TableSection';



function DigitalTransformation() {
  const { locale, setLocale } = useContext(LocalContext);
  const [count, setCount] = useState([]);
  const { showHideToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  //  ====== get all counts ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${Digital_COUNT}`,)
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
    <div style={{ marginBottom: "50px"}} dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "digitalTransformation"].join(" ")}>
      <Container maxWidth="xl">
      <TableSection
          first="Total Digital Transformation"
          firstLink={count.total_digital_transformations_count}
          second="Digital Transformation Added Last 7 Days"
          secondLink={count.digital_transformations_added_last_seven_days_count}
          third="Digital Transformation Added This Month"
          thirdLink={count.digital_transformations_added_this_month_count}
          forth="Total Users Digital Transformation"
          forthLink={count.total_users_digital_transformations_count}
          fifth="Users Digital Transformation Last 7 Days"
          fifthLink={count.users_digital_transformations_last_seven_days_count}
          sixth="Users Digital Transformation This Month"
          sixthLink={count.users_digital_transformations_this_month_count}
          icon1="octicon:project-roadmap-24"
          icon2="healthicons:i-schedule-school-date-time"
          icon3="iwwa:month"
          icon4="mage:users"
          icon5="hugeicons:complaint"
          icon6="quill:user-sad"
           />
        <DigitalTransformationTable />
      </Container>
    </div>
  )
}

export default DigitalTransformation