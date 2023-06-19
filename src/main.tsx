import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { setupIonicReact } from "@ionic/react";

setupIonicReact();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
