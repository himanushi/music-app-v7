import { PluginListenerHandle } from "@capacitor/core";
import { CapacitorMusicKit, PlaybackStateDidChangeListener } from "capacitor-plugin-musickit";
import { Sender, assign, createMachine, interpret } from "xstate";
import { LibraryTracksAttributes } from "~/graphql/appleMusicClient";
import { getApolloData } from "~/lib";

type Track = {
  appleMusicId: string;
  name: string;
};

const schema = {
  events: {} as
    | { type: "REPLACE_AND_PLAY", tracks: Track[], currentPlaybackNo: number }
    | { type: "NEXT_PLAY" }
    | { type: "PLAY_OR_PAUSE" }
    | { type: "PLAY" }
    | { type: "PLAYING" }
    | { type: "PAUSE" }
    | { type: "PAUSED" }
    | { type: "STOP" }
    | { type: "STOPPED" }
    | { type: "WAITING" },

  context: {} as {
    tracks: Track[];
    currentTrack?: Track;
    currentPlaybackNo: number;
    repeat: boolean;
  },
} as const;

const machine = createMachine(
  {
    id: "musicPlayer",

    context: {
      tracks: [],
      currentPlaybackNo: 0,
      repeat: false,
    },

    initial: "ready",

    states: {
      ready: {},

      loading: {
        on: {
          PLAYING: "playing",
          PAUSED: "paused",
          STOPPED: "stopped",
        },
        states: {
          waiting: {
            invoke: {
              src: () => (callback) => setEvents(callback, [["playing", { type: "PLAYING" }]]),
            },
          },

          loadingPlay: {
            invoke: {
              src: ({ currentTrack }) => (callback) => {
                if (!currentTrack) {
                  // callback("NEXT_PLAY");
                  return;
                }

                let appleMusicId = currentTrack.appleMusicId;

                // ライブラリの曲の場合
                if (!currentTrack.appleMusicId.startsWith("l.")) {
                  const catalogTrack = getApolloData<MusicKit.LibrarySongs>({
                    typeName: "CatalogTrack",
                    id: currentTrack.appleMusicId,
                    attributes: LibraryTracksAttributes,
                  });

                  appleMusicId = catalogTrack?.attributes?.playParams?.id ?? currentTrack.appleMusicId
                }

                console.log("appleMusicId", appleMusicId);

                (async () => {
                  await CapacitorMusicKit.stop();
                  await CapacitorMusicKit.setQueue({ ids: [appleMusicId] });
                  await CapacitorMusicKit.play({});
                })()

                return setEvents(callback, [["playing", { type: "PLAYING" }]]);
              }
            }
          }
        }
      },

      playing: {
        invoke: {
          src: () => (callback) => setEvents(callback, [
            ["paused", { type: "PAUSED" }],
            ["waiting", { type: "WAITING" }],
            ["completed", { type: "STOPPED" }],
          ])
        },

        on: {
          PLAY_OR_PAUSE: { actions: "pause" },
          WAITING: "loading.waiting",
          STOPPED: "stopped",
        },
      },

      paused: {
        invoke: {
          src: () => (callback) => setEvents(callback, [
            ["stopped", { type: "STOPPED" }],
            ["ended", { type: "STOPPED" }],
            ["playing", { type: "PLAYING" }],
            ["loading", { type: "WAITING" }],
          ]),
        },
        on: {
          PLAY_OR_PAUSE: { actions: "play" },
          PLAYING: "playing",
          WAITING: "loading.waiting",
          STOPPED: "stopped",
        },
      },

      stopped: {
        invoke: {
          src: () => (callback) => setEvents(callback, [
            ["completed", { type: "NEXT_PLAY" }],
            ["playing", { type: "PLAYING" }],
            ["loading", { type: "WAITING" }],
          ]),
        },
        on: {
          PLAY: {
            target: "playing",
            actions: "play",
          },
        },
      },
    },

    on: {
      REPLACE_AND_PLAY: {
        actions: ["setTracks", "setCurrentPlaybackNo", "changeCurrentTrack"],
        target: "loading.loadingPlay"
      },
      NEXT_PLAY: [
        {
          actions: ["nextPlaybackNo", "changeCurrentTrack"],
          cond: "canNextPlay",
          target: "loading.loadingPlay",
        },
        {
          actions: ["nextPlaybackNo", "changeCurrentTrack", "stop", "changeCurrentTrack"],
        },
      ],
    },

    schema,
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import("./musicPlayerMachine.typegen").Typegen0,
  },
  {
    actions: {
      setTracks: assign({ tracks: (_, event) => event.tracks.map((track) => ({ name: track.name, appleMusicId: track.appleMusicId })) }),

      setCurrentPlaybackNo: assign({ currentPlaybackNo: (_, event) => event.currentPlaybackNo }),

      changeCurrentTrack: assign(({ tracks, currentPlaybackNo }) => ({ currentTrack: tracks[currentPlaybackNo] })),

      nextPlaybackNo: assign({
        currentPlaybackNo: ({ tracks, currentPlaybackNo }) => currentPlaybackNo + 1 === tracks.length ? 0 : currentPlaybackNo + 1,
      }),

      play: (context, event) => CapacitorMusicKit.play({}),
      pause: (context, event) => CapacitorMusicKit.pause(),
      stop: (context, event) => CapacitorMusicKit.stop(),
    },
    services: {},
    guards: {
      canNextPlay: ({ repeat, tracks, currentPlaybackNo }) => repeat || currentPlaybackNo + 1 !== tracks.length,
    },
    delays: {},
  }
);

export const musicPlayerService = interpret(machine).start();

const setEvents = (callback: Sender<typeof schema.events>, events: [string, typeof schema.events][]) => {
  const didChange: PlaybackStateDidChangeListener = (state) => {
    console.log("state", state);
    events.forEach((event) => state.state === event[0] && callback(event[1]));
  }

  let listener: PluginListenerHandle;
  CapacitorMusicKit.addListener("playbackStateDidChange", didChange).then((cleaner) => listener = cleaner);

  return () => listener?.remove();
};

window.musicPlayerService = musicPlayerService;

// musicPlayerService.send({ type: "REPLACE_AND_PLAY", tracks: [{ appleMusicId: "i.LVkmBa6tk3baXJ", name: "ダイナフォー" }], currentPlaybackNo: 0 });
// musicPlayerService.send({ type: "PLAY" });
