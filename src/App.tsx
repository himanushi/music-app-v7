import { IonApp, IonContent, IonPage, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import {
  Music,
  Albums,
  Album,
  Artists,
  Artist,
  Tracks,
  Track,
  Playlists,
  Settings,
  Me,
  Login,
  About,
  Teams,
  Privacy,
  CookiePolicy,
  Playlist,
  Library,
  LibraryAlbums,
  Cache,
  LibraryAlbum,
} from "~/pages";
import { setupIonicReact } from "@ionic/react";
import { Footer } from "~/components";
import { ApolloProvider } from "@apollo/client";
import { client, initializeApollo } from "./graphql/client";
import { useInitialize } from "~/hooks";
import { useEffect, useState } from "react";

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

import "./machines/musicPlayerMachine";

setupIonicReact({ mode: "ios" });

const Initialize = () => {
  useInitialize();
  return <></>;
};

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      client.current = await initializeApollo();
      setReady(true);
    })();
  }, []);

  if (!ready || !client.current) return;

  return (
    <ApolloProvider client={client.current}>
      <IonApp>
        <IonReactRouter>
          <IonPage id="page">
            <Initialize />
            <IonContent scrollY={false} scrollX={false} fullscreen>
              <IonRouterOutlet>
                <Route path="/artists/:id" component={Artist} />
                <Route path="/artists" exact component={Artists} />
                <Route path="/albums/:id" component={Album} />
                <Route path="/albums" exact component={Albums} />
                <Route path="/tracks/:id" component={Track} />
                <Route path="/tracks" exact component={Tracks} />
                <Route path="/playlists" exact component={Playlists} />
                <Route path="/playlists/:id" component={Playlist} />
                <Route path="/music" component={Music} />

                <Route path="/library-albums/:id" component={LibraryAlbum} />
                <Route path="/library-albums" exact component={LibraryAlbums} />
                <Route path="/library" component={Library} />

                <Route path="/me" component={Me} />
                <Route path="/login" component={Login} />
                <Route path="/about" component={About} />
                <Route path="/teams" component={Teams} />
                <Route path="/privacy" component={Privacy} />
                <Route path="/cookie-policy" component={CookiePolicy} />
                <Route path="/cache" component={Cache} />
                <Route path="/settings" component={Settings} />

                <Route exact path="/" component={Albums} />
              </IonRouterOutlet>
            </IonContent>
            <Footer />
          </IonPage>
        </IonReactRouter>
      </IonApp>
    </ApolloProvider>
  );
}

export default App;
