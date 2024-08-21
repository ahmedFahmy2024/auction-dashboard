import './App.css';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { useState } from 'react';
import { ToastProvider } from './context/ToastProvider';
import { LocalContext } from './context/LocalContext';

import {
  LiveChat,
  Dashboard,
  NotificationPage,
  Bids,
  Users,
  Scraps,
  Projects,
  Requests,
  Packages,
  Portfolio,
  Categories,
  Transcations,
  Subscribtions,
  Home,
  SupplierUsers,
  IndividualUsers,
  CorporateUsers,
  EngineeringUsers,
  ComplainsPage,
  PromoCode,
  SupplierRegistration,
  DigitalTransformation
} from "./pages";
import Login from './pages/Login';
import RequireAuth from './auth/RequireAuth';
import {
  ProjectsAdd,
  ProjectsEdit,
  ProjectsView,
  CategoriesAdd,
  CategoriesEdit,
  CategoriesView,
  UsersAdd,
  UsersEdit,
  UsersView,
  UserBids,
  UserScraps,
  UserMessages,
  UserPortfolio,
  UserComplains,
  UserSubscribtion,
  UserTranscation,
  UserProfile,
  UserRequest,
  UserActivity,
  PackagesEdit,
  PackagesView,
  SubscribtionsAdd,
  SubscribtionsEdit,
  SubscribtionsView,
  TranscationsAdd,
  TranscationsEdit,
  TranscationsView,
  RequestAdd,
  RequestEdit,
  RequestView,
  PortfoliosAdd,
  PortfoliosEdit,
  PortfoliosView,
  ScrapsAdd,
  ScrapsEdit,
  ScrapsView,
  BidsAdd,
  BidsEdit,
  BidsView,
  ComplainsEdit,
  PromoCodeAdd,
  PromoCodeEdit,
  PromoCodeView,
  SupplierRegistrationEdit,
  DigitalTransformationEdit

} from './fullpage';



function App() {
  const [locale, setLocale] = useState("en");
  const [theme, colorMode] = useMode();

  // direction right and left
  const rtlCache = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });
  const ltrCache = createCache({
    key: 'mui',
  });

  const isRtl = locale === "ar" || locale === "ur";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className={[isRtl  ? "rtl" : "ltr", "ahmed"]}>
    <CacheProvider value={isRtl ? rtlCache : ltrCache}>
        <LocalContext.Provider value={{ locale, setLocale, isRtl }}>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <ToastProvider>
                <CssBaseline />

                <Routes>

                  <Route path="/Login" element={<Login />} />

                  <Route element={<RequireAuth allowedRoles={[1]} />}>
                    <Route path="/" element={<Dashboard />} >

                      <Route element={<RequireAuth allowedRoles={[1]} />}>
                        <Route index element={<Home />} />

                        <Route path="Users" element={<Users />} />
                        <Route path="Users/New" element={<UsersAdd />} />
                        <Route path="Users/:id/Edit" element={<UsersEdit />} />
                        <Route path="Users/:id/View" element={<UsersView />} >
                          <Route index element={<UserProfile />} />
                          <Route path="user-subscriptions" element={<UserSubscribtion />} />
                          <Route path="user-transcations" element={<UserTranscation />} />
                          <Route path="user-requests" element={<UserRequest />} />
                          <Route path="user-portfolio" element={<UserPortfolio />} />
                          <Route path="user-scraps" element={<UserScraps />} />
                          <Route path="user-bids" element={<UserBids />} />
                          <Route path="user-messages" element={<UserMessages />} />
                          <Route path="user-activity" element={<UserActivity />} />
                          <Route path="user-complains" element={<UserComplains />} />
                        </Route>

                        <Route path="SupplierUsers" element={<SupplierUsers />} />
                        <Route path="IndividualUsers" element={<IndividualUsers />} />
                        <Route path="CorporateUsers" element={<CorporateUsers />} />
                        <Route path="EngineeringUsers" element={<EngineeringUsers />} />

                        <Route path="Packages" element={<Packages />} />
                        <Route path="Packages/:id/Edit" element={<PackagesEdit />} />
                        <Route path="Packages/:id/Details" element={<PackagesView />} />

                        <Route path="Subscriptions" element={<Subscribtions />} />
                        <Route path="Subscriptions/New" element={<SubscribtionsAdd />} />
                        <Route path="Subscriptions/:id/Edit" element={<SubscribtionsEdit />} />
                        <Route path="Subscriptions/:id/Details" element={<SubscribtionsView />} />

                        <Route path="Transcations" element={<Transcations />} />
                        <Route path="Transcations/New" element={<TranscationsAdd />} />
                        <Route path="Transcations/:id/Edit" element={<TranscationsEdit />} />
                        <Route path="Transcations/:id/Details" element={<TranscationsView />} />

                        <Route path="Categories" element={<Categories />} />
                        <Route path="Categories/New" element={<CategoriesAdd />} />
                        <Route path="Categories/:id/Edit" element={<CategoriesEdit />} />
                        <Route path="Categories/:id/Details" element={<CategoriesView />} />

                        <Route path="Projects" element={<Projects />} />
                        <Route path="Projects/New" element={<ProjectsAdd />} />
                        <Route path="Projects/:id/Edit" element={<ProjectsEdit />} />
                        <Route path="Projects/:id/Details" element={<ProjectsView />} />

                        <Route path="Requests" element={<Requests />} />
                        <Route path="Requests/New" element={<RequestAdd />} />
                        <Route path="Requests/:id/Edit" element={<RequestEdit />} />
                        <Route path="Requests/:id/Details" element={<RequestView />} />

                        <Route path="Portfolio" element={<Portfolio />} />
                        <Route path="Portfolio/New" element={<PortfoliosAdd />} />
                        <Route path="Portfolio/:id/Edit" element={<PortfoliosEdit />} />
                        <Route path="Portfolio/:id/Details" element={<PortfoliosView />} />

                        <Route path="Scraps" element={<Scraps />} />
                        <Route path="Scraps/New" element={<ScrapsAdd />} />
                        <Route path="Scraps/:id/Edit" element={<ScrapsEdit />} />
                        <Route path="Scraps/:id/Details" element={<ScrapsView />} />

                        <Route path="Bids" element={<Bids />} />
                        <Route path="Bids/New" element={<BidsAdd />} />
                        <Route path="Bids/:id/Edit" element={<BidsEdit />} />
                        <Route path="Bids/:id/Details" element={<BidsView />} />

                        <Route path="PromoCode" element={<PromoCode />} />
                        <Route path="PromoCode/New" element={<PromoCodeAdd />} />
                        <Route path="PromoCode/:id/Edit" element={<PromoCodeEdit />} />
                        <Route path="PromoCode/:id/Details" element={<PromoCodeView />} />

                        <Route path="Notifications" element={<NotificationPage />} />

                        <Route path="Chat" element={<LiveChat />} />

                        <Route path="Complains" element={<ComplainsPage />} />
                        <Route path="Complains/:id/Edit" element={<ComplainsEdit />} />

                        <Route path="SupplierRegistration" element={<SupplierRegistration />} />
                        <Route path="SupplierRegistration/:id/Edit" element={<SupplierRegistrationEdit />} />

                        <Route path="DigitalTransformation" element={<DigitalTransformation />} />
                        <Route path="DigitalTransformation/:id/Edit" element={<DigitalTransformationEdit />} />

                      </Route>

                    </Route>
                  </Route>

                </Routes>

              </ToastProvider>
            </ThemeProvider>
          </ColorModeContext.Provider>
        </LocalContext.Provider>
    </CacheProvider>
    </div>
  );
}

export default App;
