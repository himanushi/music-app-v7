import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import { Albums } from "~/pages/Albums";
import { Album } from "~/pages/Album";
import { setupIonicReact } from "@ionic/react";
import { FooterModal } from "./components";

/* Ionic Framework css */
/* Core css */
import "@ionic/react/css/core.css";

/* Recommended css */
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/normalize.css";

/* Optional css */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "~/theme/variables.css";
import "~/theme/custom.css";

setupIonicReact({ mode: "ios", animated: false });

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
