
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import ReactDom from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./componenets/UserContext.jsx";
import{Provider} from "react-redux"
import { store } from "./redux/store.js";


createRoot(document.getElementById("root")).render(
  <Provider store={store}>
  <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserProvider>
  </Provider>
);
