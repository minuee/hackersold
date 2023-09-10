import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { Dashboard } from "layout";
import { OnBoarding,Starting, Main,Profile, Search, PhotoReference, VideoReference, Reservation,Reservation2, ReservationComplete,Contactus } from "./page";
import { ServiceList, HomeStyling, PersonalShopper, GroupPurchasing, PersonalStylist } from "./page/Service";

export const Routes = () => {
  const is_onboarding = !(window.localStorage.getItem("sdd_onboarding2") === "false");

  return <BrowserRouter>{is_onboarding ? <OnBoardingRoutes /> : <MainRoutes />}</BrowserRouter>;
};

const OnBoardingRoutes = () => {
  return (
    <Switch>
      <Route exact path="/" component={OnBoarding} />
      <Redirect to="/" />
    </Switch>
  );
};

const MainRoutes = () => {
  return (
    <Dashboard>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/search" component={Search} />
        <Route path="/profile" component={Profile} />
        <Route path="/photo" component={PhotoReference} />
        <Route path="/video" component={VideoReference} />
        <Route path="/contact" component={Contactus} />

        <Route path="/start" component={Starting} />

        <Route exact path="/service" component={ServiceList} />
        <Route path="/service/home_styling" component={HomeStyling} />
        <Route path="/service/personal_shopper" component={PersonalShopper} />
        <Route path="/service/group_purchasing" component={GroupPurchasing} />
        <Route path="/service/personal_stylist" component={PersonalStylist} />

        <Route path="/reservation" component={Reservation2} />
        <Route path="/reservation_complete" component={ReservationComplete} />

        <Redirect to="/" />
      </Switch>
    </Dashboard>
  );
};
