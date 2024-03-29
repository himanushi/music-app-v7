import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonRange,
  IonReorderGroup,
  IonRow,
  IonSegmentButton,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  ItemReorderEventDetail,
  RangeKnobMoveStartEventDetail,
} from "@ionic/react";
import { FavoriteButton, Icon, SquareImage } from ".";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  IonModalCustomEvent,
  ModalBreakpointChangeEventDetail,
} from "@ionic/core";
import { useHistory, useLocation } from "react-router-dom";
import {
  useApp,
  useMusicKit,
  useStartedServiceContext,
  useStartedServiceState,
} from "~/hooks";
import { musicPlayerService } from "~/machines/musicPlayerMachine";
import { convertImageUrl } from "~/lib";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { TrackItem } from "~/pages";

const max = 1;
const min = 0.001;

export const Footer = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [open, setOpen] = useState(false);

  const switchBreakpoint = useCallback(() => {
    modal.current?.setCurrentBreakpoint(open ? min : max);
    setOpen((prevOpen) => !prevOpen);
  }, [open]);

  const breakpointDidChange = useCallback(
    (event: IonModalCustomEvent<ModalBreakpointChangeEventDetail>) => {
      setOpen(event.detail.breakpoint === max);
    },
    []
  );

  return (
    <IonFooter translucent className="pc-safe-area">
      <ClosePlayer switchBreakpoint={switchBreakpoint} />
      <Tab />
      <IonModal
        ref={modal}
        isOpen={true}
        initialBreakpoint={min}
        breakpoints={[min, max]}
        backdropBreakpoint={0.5}
        onIonBreakpointDidChange={breakpointDidChange}
      >
        <OpenModal switchBreakpoint={switchBreakpoint} />
      </IonModal>
    </IonFooter>
  );
};

const ClosePlayer = ({
  switchBreakpoint,
}: {
  switchBreakpoint: () => void;
}) => {
  const { state } = useStartedServiceState(musicPlayerService);
  const { currentTrack: track } = useStartedServiceContext(musicPlayerService);
  const isLoading = state?.matches("loading");

  return (
    <IonToolbar
      onClick={() => track && switchBreakpoint()}
      color="dark-gray"
      class="clickable"
    >
      <IonThumbnail>
        <SquareImage
          key={track?.artworkUrl}
          src={convertImageUrl({ url: track?.artworkUrl, px: 300 })}
        />
      </IonThumbnail>
      <IonTitle className="label-long-text">{track?.name}</IonTitle>
      {isLoading ? (
        <IonButtons slot="end">
          <IonButton disabled={true}>
            <Icon size="s" color="white" slot="icon-only" name="sync" />
          </IonButton>
        </IonButtons>
      ) : (
        <IonButtons onClick={(event) => event.stopPropagation()} slot="end">
          <IonButton
            disabled={!track}
            onClick={() => musicPlayerService.send("PLAY_OR_PAUSE")}
          >
            <Icon
              size="s"
              color="white"
              slot="icon-only"
              name={state?.matches("playing") ? "pause" : "play_arrow"}
            />
          </IonButton>
          <IonButton
            disabled={!track}
            onClick={() => musicPlayerService.send("NEXT_PLAY")}
          >
            <Icon size="s" color="white" slot="icon-only" name="fast_forward" />
          </IonButton>
        </IonButtons>
      )}
    </IonToolbar>
  );
};

const pathMap = [
  {
    title: "見つける",
    path: "/music",
    icon: "music_note",
    locations: ["", "music", "albums", "artists", "playlists", "tracks"],
    color: "main",
  },
  {
    title: "ライブラリ",
    path: "/library",
    icon: "library_music",
    locations: [
      "library",
      "library-albums",
      "library-artists",
      "library-playlists",
      "library-tracks",
    ],
    color: "red",
  },
  {
    title: "設定",
    path: "/settings",
    icon: "settings",
    locations: [
      "settings",
      "me",
      "login",
      "about",
      "teams",
      "privacy",
      "cookie-policy",
      "cache",
    ],
    color: "main",
  },
];

const Tab = () => {
  const history = useHistory();
  const location = useLocation();
  return (
    <IonToolbar color="dark-gray">
      <IonButtons>
        {pathMap.map(({ title, path, icon, locations, color }) => {
          const isSelected = locations.includes(
            location.pathname.split("/")[1]
          );
          return (
            <IonSegmentButton
              onClick={() =>
                history.location.pathname !== path && history.push(path)
              }
              key={path}
            >
              <IonButton>
                <Icon
                  name={icon as any}
                  slot="start"
                  color={isSelected ? color : "white"}
                />
              </IonButton>
              <IonLabel color={isSelected ? color : "white"}>{title}</IonLabel>
            </IonSegmentButton>
          );
        })}
      </IonButtons>
    </IonToolbar>
  );
};

const OpenModal = ({ switchBreakpoint }: { switchBreakpoint: () => void }) => {
  const { isReady } = useMusicKit();
  const [page, setPage] = useState<"player" | "queue">("player");

  if (!isReady) return <></>;

  return (
    <>
      <IonHeader>
        <IonToolbar style={{ "--border-width": 0 }} color="dark-gray" />
      </IonHeader>
      <IonContent color="dark-gray" forceOverscroll={false}>
        {page === "player" ? <Player /> : <Queue />}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons>
            <IonSegmentButton onClick={() => setPage("player")}>
              <IonButton>
                <Icon
                  name="music_note"
                  slot="start"
                  color={page === "player" ? "main" : "white"}
                />
              </IonButton>
              <IonLabel color={page === "player" ? "main" : "white"}>
                プレイヤー
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton onClick={() => setPage("queue")}>
              <IonButton>
                <Icon
                  name="playlist_play"
                  slot="start"
                  color={page === "queue" ? "main" : "white"}
                />
              </IonButton>
              <IonLabel color={page === "queue" ? "main" : "white"}>
                リスト
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton onClick={() => switchBreakpoint()}>
              <IonButton>
                <Icon name="close" slot="start" />
              </IonButton>
              <IonLabel>閉じる</IonLabel>
            </IonSegmentButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar style={{ height: "10px" }} />
      </IonFooter>
    </>
  );
};

const Player = () => {
  return (
    <IonGrid style={{ height: "100%" }}>
      <PlayerInfo />
      <div style={{ height: "13%" }}>
        <PlayerSeekBar />
      </div>
      <PlayerController />
    </IonGrid>
  );
};

const PlayerInfo = () => {
  useStartedServiceState(musicPlayerService);
  const track = musicPlayerService.getSnapshot().context.currentTrack;

  return (
    <>
      <IonRow style={{ height: "50%", maxHeight: "500px" }} class="ion-padding">
        <SquareImage
          key={track?.artworkUrl}
          src={convertImageUrl({ url: track?.artworkUrl, px: 500 })}
        />
      </IonRow>
      <IonRow>
        <IonItem color="dark-gray" lines="none">
          <IonLabel class="ion-text-wrap">{track?.name}</IonLabel>
        </IonItem>
      </IonRow>
    </>
  );
};

const PlayerSeekBar = () => {
  const { state } = useStartedServiceState(musicPlayerService);
  const { currentTrack: track } = useStartedServiceContext(musicPlayerService);
  const { isActive } = useApp();
  const isPlaying = state.matches("playing");

  const [seek, setSeek] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    CapacitorMusicKit.getCurrentPlaybackDuration().then((result) => {
      setDuration(result.time * 1000);
    });
  }, [track?.id, state.value]);

  // デフォルト値
  useEffect(() => {
    CapacitorMusicKit.getCurrentPlaybackTime().then((result) => {
      setSeek(result.time * 1000);
    });
  }, []);

  useEffect(() => {
    if (!isPlaying || !isActive) return;
    const interval = setInterval(async () => {
      if (seeking) return;
      const result = await CapacitorMusicKit.getCurrentPlaybackTime();
      setSeek(result.time * 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [seeking, isPlaying, isActive]);

  useEffect(() => {
    if (seeking) return;
    setSeekValue(seek);
  }, [seeking, seek]);

  const onStart = useCallback(
    (event: CustomEvent<RangeKnobMoveStartEventDetail>) => {
      setSeeking(true);

      if (typeof event.detail.value === "number") {
        setSeekValue(event.detail.value);
      }
    },
    []
  );

  const onStop = useCallback(
    (event: CustomEvent<RangeKnobMoveStartEventDetail>) => {
      setSeeking(false);

      if (typeof event.detail.value === "number") {
        CapacitorMusicKit.seekToTime({ time: event.detail.value / 1000 });
      }
    },
    []
  );

  return (
    <>
      <IonItem color="dark-gray" lines="none">
        <IonNote slot="start">{toMMSS(seek)}</IonNote>
        <IonNote slot="end">{toMMSS(duration)}</IonNote>
      </IonItem>
      <IonRange
        pinFormatter={toMMSS}
        class="player-seek-bar ion-no-padding"
        value={seekValue}
        max={duration}
        min={0}
        pin
        onIonKnobMoveStart={onStart}
        onIonKnobMoveEnd={onStop}
      />
    </>
  );
};

const toMMSS = (duration: number) => {
  const sec = Math.floor(duration / 1000);
  const minutes = Math.floor(sec / 60);
  const seconds = sec - minutes * 60;

  const padding = (num: number) => `0${num}`.slice(-2);

  return `${padding(minutes)}:${padding(seconds)}`;
};

const PlayerController = () => {
  const { state } = useStartedServiceState(musicPlayerService);
  const { repeat } = useStartedServiceContext(musicPlayerService);
  const playing = state?.matches("playing");
  const loading = state?.matches("loading");

  return (
    <>
      <IonRow style={{ height: "13%" }} class="ion-text-center">
        <IonCol>
          <IonButton
            color="dark-gray"
            size="large"
            onClick={() => musicPlayerService.send("PREVIOUS_PLAY")}
          >
            <Icon name="fast_rewind" size="l" slot="icon-only" color="white" />
          </IonButton>
        </IonCol>
        <IonCol>
          <IonButton
            color="dark-gray"
            size="large"
            onClick={() => musicPlayerService.send("PLAY_OR_PAUSE")}
            disabled={loading}
          >
            <Icon
              name={loading ? "sync" : playing ? "pause" : "play_arrow"}
              size="l"
              slot="icon-only"
            />
          </IonButton>
        </IonCol>
        <IonCol>
          <IonButton
            color="dark-gray"
            size="large"
            onClick={() => musicPlayerService.send("NEXT_PLAY")}
          >
            <Icon name="fast_forward" size="l" slot="icon-only" />
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow class="ion-text-center">
        <IonCol>
          {state?.context.currentTrack?.id && (
            <FavoriteButton
              id={state?.context.currentTrack?.id || ""}
              size="l"
              type="trackIds"
            />
          )}
        </IonCol>
        <IonCol>
          <IonButton
            color="dark-gray"
            size="large"
            onClick={() => musicPlayerService.send("CHANGE_REPEAT")}
          >
            <Icon
              color={["all", "one"].includes(repeat) ? "main" : "white"}
              name={repeat === "one" ? "repeat_one" : "repeat"}
              size="l"
              slot="icon-only"
            />
          </IonButton>
        </IonCol>
      </IonRow>
    </>
  );
};

const Queue = () => {
  const { tracks } = useStartedServiceContext(musicPlayerService);

  const reorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    musicPlayerService.send({
      type: "REORDER",
      from: event.detail.from,
      to: event.detail.to,
    });
    event.detail.complete();
  };

  return (
    <>
      <IonList>
        <IonReorderGroup disabled={false} onIonItemReorder={reorder}>
          {tracks.map((track, index) => (
            <TrackItem
              displayThumbnail
              reorder
              index={index}
              track={track}
              tracks={tracks}
              key={track.id}
            />
          ))}
        </IonReorderGroup>
      </IonList>
    </>
  );
};
