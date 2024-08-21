import Container from '@mui/material/Container';
import '../css/dashboard.css'
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

function Dashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <div className="dashboard">
      <Container maxWidth="xl">
        <Header onMenuIconClick={toggleDrawer}/>
        <Sidebar open={isDrawerOpen} onClose={toggleDrawer} />
        <Outlet />
      </Container>
    </div>
  )
}

export default Dashboard