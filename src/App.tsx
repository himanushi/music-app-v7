import { IonApp, IonPage, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import { Albums } from "@/pages/albums/albums";
import { Album } from "./pages/album/album";

function App() {
  return (
    <IonApp>
      <IonPage>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/albums" component={Albums} />
            <Route path="/albums/:albumId" component={Album} />
            <Route exact path="/" component={Albums} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonPage>
    </IonApp>
  );
}

export default App;
