  import "./App.css";
  import { Route, Routes } from "react-router-dom";
  import Dashboard from "./pages/Dashboard";
  import AllLeads from "./pages/AllLeads";
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

  function App() {
    return (
      <>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          //layout route
          <Route path="/" element={<Layout />}>
            //Child Route
            <Route index element={<Dashboard />} />
            <Route path="/leads" element={<LeadMangement />} />
            <Route path="/followups" element={<FollowupsList />} />
            <Route path="/add" element={<AddLead />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/team" element={<Team />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/addfollowups" element={<AddFollowUps />} />
          </Route>
        </Routes>
      </>
    );
  }

  export default App;
