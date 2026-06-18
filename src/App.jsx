import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddLead from "./pages/AddLead";
import Reminders from "./pages/Reminders";

import Layout from "./componenets/Layout";
import Analytics from "./componenets/Analytics";
import Team from "./componenets/Team";
import Setting from "./componenets/Setting";
import LeadMangement from "./componenets/LeadMangement";
import FollowupsList from "./componenets/FollowupsList";
import AddFollowUps from "./componenets/AddFollowUps";

import Register from "./componenets/Register";
import Login from "./componenets/Login";
import ForgotPassword from "./componenets/ForgotPassword";

import { Toaster } from "react-hot-toast";
import Pricing from "./componenets/Pricing";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            zIndex: 99999,
          },
        }}
        containerStyle={{
          zIndex: 99999,
        }}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="pricing" element={<Pricing />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<LeadMangement />} />
          <Route path="followups" element={<FollowupsList />} />
          <Route path="add" element={<AddLead />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="team" element={<Team />} />
          <Route path="settings" element={<Setting />} />
          <Route path="addfollowups" element={<AddFollowUps />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;