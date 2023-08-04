import { PluginListenerHandle } from "@capacitor/core";
import { CapacitorMusicKit, PlaybackStateDidChangeListener } from "capacitor-plugin-musickit";
import { Sender, assign, createMachine, interpret } from "xstate";
import { LibraryTracksAttributes } from "~/graphql/appleMusicClient";
import { getApolloData } from "~/lib";

export type Track = {
  id: string;
  appleMusicId: string;
  name: string;
  artworkUrl?: string;
  trackNumber: number;
  durationMs: number;
};

const schema = {
  events: {} as
    | { type: "REPLACE_AND_PLAY", tracks: Track[], currentPlaybackNo: number }
    | { type: "NEXT_PLAY" }
    | { type: "PREVIOUS_PLAY" }
    | { type: "PLAY_OR_PAUSE" }
    | { type: "CHANGE_REPEAT" }
    | { type: "REORDER"; from: number; to: number; }
    | { type: "REMOVE_TRACK"; index: number }

    | { type: "PLAYING" }
    | { type: "PAUSED" }
    | { type: "STOPPED" }
    | { type: "WAITING" },

  context: {} as {
    tracks: Track[];
    currentTrack?: Track;
    currentPlaybackNo: number;
    repeat: "none" | "all" | "one";
  },
} as const;

const machine = createMachine(
  {
    id: "musicPlayer",

    context: {
      tracks: [],
      currentPlaybackNo: 0,
      repeat: "none",
    },

    initial: "ready",

    states: {
      ready: {},

      loading: {
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
                  callback({ type: "NEXT_PLAY" });
                  return;
                }

                let appleMusicId = currentTrack.appleMusicId;

                // ライブラリの曲ではない場合は、カタログから取得する
                if (!currentTrack.appleMusicId.startsWith("l.")) {
                  const catalogTrack = getApolloData<MusicKit.LibrarySongs>({
                    typeName: "CatalogTrack",
                    id: currentTrack.appleMusicId,
                    attributes: LibraryTracksAttributes,
                  });

                  appleMusicId = catalogTrack?.attributes?.playParams?.id ?? currentTrack.appleMusicId
                }

                console.log("appleMusicId", appleMusicId);

                const cleaner = setEvents(callback, [["playing", { type: "PLAYING" }]]);

                (async () => {
                  await CapacitorMusicKit.stop();
                  await CapacitorMusicKit.setQueue({ ids: [appleMusicId] });
                  await CapacitorMusicKit.play({});
                })()

                return cleaner;
              }
            }
          }
        }
      },

      playing: {
        invoke: {
          src: () => (callback) => setEvents(callback, [
            ["completed", { type: "NEXT_PLAY" }],
            ["paused", { type: "PAUSED" }],
            ["waiting", { type: "WAITING" }],
          ])
        },

        on: {
          PLAY_OR_PAUSE: { actions: "pause" },
        },
      },

      paused: {
        invoke: {
          src: () => (callback) => setEvents(callback, [
            ["completed", { type: "NEXT_PLAY" }],
            ["stopped", { type: "STOPPED" }],
            ["ended", { type: "STOPPED" }],
            ["playing", { type: "PLAYING" }],
            ["loading", { type: "WAITING" }],
          ]),
        },
        on: {
          PLAY_OR_PAUSE: { actions: "play" },
        },
      },

      stopped: {
        on: {
          PLAY_OR_PAUSE: "loading.loadingPlay",
        },
        invoke: {
          src: () => (callback) => setEvents(callback, [
            ["completed", { type: "NEXT_PLAY" }],
            ["playing", { type: "PLAYING" }],
            ["paused", { type: "PAUSED" }],
            ["loading", { type: "WAITING" }],
          ]),
        },
      },
    },

    on: {
      PLAYING: "playing",
      PAUSED: "paused",
      WAITING: "loading.waiting",
      STOPPED: "stopped",

      CHANGE_REPEAT: { actions: "changeRepeat" },

      REPLACE_AND_PLAY: {
        actions: ["setTracks", "setCurrentPlaybackNo", "changeCurrentTrack"],
        target: "loading.loadingPlay"
      },

      REORDER: { actions: "moveTracks" },

      REMOVE_TRACK: { actions: "removeTrack" },

      NEXT_PLAY: [
        {
          actions: ["nextPlaybackNo", "changeCurrentTrack"],
          cond: "canNextPlay",
          target: "loading.loadingPlay",
        },
        {
          actions: ["nextPlaybackNo", "changeCurrentTrack"],
          target: "stopped",
        },
      ],

      PREVIOUS_PLAY: [
        {
          actions: ["previousPlaybackNo", "changeCurrentTrack"],
          cond: "canPreviousPlay",
          target: "loading.loadingPlay",
        },
        {
          actions: ["previousPlaybackNo", "changeCurrentTrack"],
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
      setTracks: assign({ tracks: (_, event) => event.tracks }),

      setCurrentPlaybackNo: assign({ currentPlaybackNo: (_, event) => event.currentPlaybackNo }),

      changeCurrentTrack: assign(({ tracks, currentPlaybackNo }) => ({ currentTrack: tracks[currentPlaybackNo] })),

      nextPlaybackNo: assign({
        currentPlaybackNo: ({ repeat, tracks, currentPlaybackNo }) =>
          repeat === "one" ? currentPlaybackNo : currentPlaybackNo + 1 === tracks.length ? 0 : currentPlaybackNo + 1
      }),

      previousPlaybackNo: assign({
        currentPlaybackNo: ({ repeat, currentPlaybackNo }) =>
          repeat === "one" ? currentPlaybackNo : currentPlaybackNo === 0 ? 0 : currentPlaybackNo - 1,
      }),

      changeRepeat: assign({
        repeat: ({ repeat }) => {
          switch (repeat) {
            case "none":
              return "all";
            case "all":
              return "one";
            case "one":
              return "none";
          }
        }
      }),

      moveTracks: assign({
        currentPlaybackNo: ({ currentPlaybackNo }, event) => {
          if (currentPlaybackNo === event.from) {
            return event.to;
          } else if (
            event.from < currentPlaybackNo &&
            currentPlaybackNo <= event.to
          ) {
            return currentPlaybackNo - 1;
          } else if (
            event.from > currentPlaybackNo &&
            currentPlaybackNo >= event.to
          ) {
            return currentPlaybackNo + 1;
          } else {
            return currentPlaybackNo;
          }
        },
        tracks: ({ tracks }, event) => move(tracks, event.from, event.to)
      }),

      removeTrack: assign({
        currentPlaybackNo: (context, event) =>
          context.currentPlaybackNo > event.index ? context.currentPlaybackNo - 1 : context.currentPlaybackNo,
        tracks: (context, event) => context.tracks.filter((_, index) => index !== event.index),
      }),

      play: (context, event) => CapacitorMusicKit.play({}),
      pause: (context, event) => CapacitorMusicKit.pause(),
      // stop: (context, event) => CapacitorMusicKit.stop(),
    },
    services: {},
    guards: {
      canNextPlay: ({ repeat, tracks, currentPlaybackNo }) => ["all", "one"].includes(repeat) || currentPlaybackNo + 1 !== tracks.length,
      canPreviousPlay: ({ currentPlaybackNo }) => currentPlaybackNo !== 0,
    },
    delays: {},
  }
);

export const musicPlayerService = interpret(machine).start();

const setEvents = (callback: Sender<typeof schema.events>, events: [string, typeof schema.events][]) => {
  const didChange: PlaybackStateDidChangeListener = (state) => {
    events.forEach((event) => state.state === event[0] && callback(event[1]));
  }

  let listener: PluginListenerHandle;
  CapacitorMusicKit.addListener("playbackStateDidChange", didChange).then((cleaner) => listener = cleaner);

  return () => listener?.remove();
};

const move = (arr: any[], from: number, to: number) => {
  const result = [...arr];

  if (from !== to) {
    const element = result.splice(from, 1)[0];
    result.splice(to, 0, element);
  }

  return result;
}

window.musicPlayerService = musicPlayerService;
