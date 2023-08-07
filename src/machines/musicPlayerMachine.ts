import { gql } from "@apollo/client";
import { PluginListenerHandle } from "@capacitor/core";
import { ApiResult, CapacitorMusicKit, PlaybackStateDidChangeListener } from "capacitor-plugin-musickit";
import { Sender, assign, createMachine, interpret, raise, send, sendTo } from "xstate";
import { CatalogTracksDocument, LibraryTracksAttributes, applyDefaultFields, libraryTracksFields, } from "~/graphql/appleMusicClient";
import { client } from "~/graphql/client";
import { replaceName } from "~/hooks";
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
            // 3秒間再生できない音楽はスキップ
            after: { 3000: { actions: raise({ type: "NEXT_PLAY" }) } },
            invoke: {
              src: ({ currentTrack }) => (callback) => {
                if (!currentTrack) {
                  callback({ type: "NEXT_PLAY" });
                  return;
                }

                const cleaner = setEvents(callback, [["playing", { type: "PLAYING" }]]);

                (async () => {
                  if (!client.current) {
                    callback({ type: "NEXT_PLAY" });
                    return;
                  }

                  await CapacitorMusicKit.stop();

                  let appleMusicId = currentTrack.appleMusicId;

                  // ライブラリの曲ではない場合は、カタログから取得する
                  if (!appleMusicId.startsWith("l.")) {
                    // 1. キャッシュから取得
                    const catalogTrack = getApolloData<MusicKit.LibrarySongs>({
                      typeName: "CatalogTrack",
                      id: appleMusicId,
                      attributes: LibraryTracksAttributes,
                    });

                    let catalogAppleMusicId = catalogTrack?.attributes?.playParams?.id;

                    if (!catalogAppleMusicId && (await CapacitorMusicKit.hasMusicSubscription()).result) {
                      // 2. キャッシュから取得できなかった場合は、カタログから取得する
                      const result = await client.current.query<ApiResult<MusicKit.Songs>>({ query: CatalogTracksDocument, variables: { ids: [appleMusicId] } })
                      if ("data" in result.data) {
                        const catalogTrack = result.data.data[0];
                        catalogAppleMusicId = catalogTrack?.attributes?.playParams?.id;
                      }

                      // 3. カタログから取得できなかった場合(購入していて現在は非公開になっているなど)は、ライブラリから検索してキャッシュする
                      if (!catalogAppleMusicId) {
                        const track = await recursionSearchTrack({ track: currentTrack, appleMusicId: appleMusicId, offset: 0 })
                        if (track) {
                          const data = {
                            __typename: "CatalogTrack",
                            ...track,
                            attributes: applyDefaultFields({ ...track.attributes }, libraryTracksFields),
                          };

                          data.attributes.playParams.id = track.id;

                          client.current.writeFragment({
                            id: `CatalogTrack:${appleMusicId}`,
                            fragment: gql`
                              fragment Fragment on CatalogTrack {
                                ${LibraryTracksAttributes}
                              }
                            `,
                            data,
                          });

                          catalogAppleMusicId = track.id;
                        }
                      }
                    }

                    if (catalogAppleMusicId) appleMusicId = catalogAppleMusicId;
                  }

                  await CapacitorMusicKit.setQueue({ ids: [appleMusicId] });
                  await CapacitorMusicKit.play({});
                })();

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
            ["stopped", { type: "NEXT_PLAY" }],
            ["ended", { type: "NEXT_PLAY" }],
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

const searchTrack = async ({ track, appleMusicId, offset = 0 }: { track: Track, appleMusicId: string, offset: number }) => {
  const result = await CapacitorMusicKit.api<any>({
    url: "/v1/me/library/search",
    params: {
      types: "library-songs",
      limit: 25,
      offset,
      term: replaceName(track.name),
    },
  });

  let findTrack = undefined;
  let hasNext = false;
  const tracks =
    "results" in result
      ? result.results["library-songs"]
      : undefined;
  if (tracks) {
    findTrack = tracks.data.find(
      (track) => track.attributes.playParams?.purchasedId === appleMusicId
    );
    hasNext = tracks.next !== undefined;
  }

  return { track: findTrack, hasNext };
}

const recursionSearchTrack =
  async ({ track, appleMusicId, offset }: { track: Track, appleMusicId: string, offset: number }):
    Promise<MusicKit.LibraryAlbums | undefined> => {
    const { track: findTrack, hasNext } = await searchTrack({ track, appleMusicId, offset });

    if (findTrack) {
      return findTrack;
    } else if (hasNext) {
      return await recursionSearchTrack({ track, appleMusicId, offset: offset + 25 });
    } else {
      return undefined;
    }
  };

// musicPlayerService.subscribe((state) => {
//   console.log(state)
// });

// window.musicPlayerService = musicPlayerService;
