import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import { Albums } from "~/pages/Albums";
import { Album } from "~/pages/Album";
import { setupIonicReact } from "@ionic/react";

import "@ionic/react/css/core.css";
import "~/theme/variables.css";
import "~/theme/custom.css";
import { FooterModal } from "./components";

setupIonicReact({ mode: "ios" });

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/albums" component={Albums} />
          <Route path="/albums/:albumId" component={Album} />
          <Route exact path="/" component={Albums} />
        </IonRouterOutlet>
      </IonReactRouter>
      <FooterModal />
    </IonApp>
  );
}

export default App;
