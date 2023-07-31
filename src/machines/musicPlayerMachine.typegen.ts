
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "changeCurrentTrack": "NEXT_PLAY" | "REPLACE_AND_PLAY";
"nextPlaybackNo": "NEXT_PLAY";
"pause": "PLAY_OR_PAUSE";
"play": "PLAY" | "PLAY_OR_PAUSE";
"setCurrentPlaybackNo": "REPLACE_AND_PLAY";
"setTracks": "REPLACE_AND_PLAY";
"stop": "NEXT_PLAY";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "canNextPlay": "NEXT_PLAY";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "loading" | "loading.loadingPlay" | "loading.waiting" | "paused" | "playing" | "ready" | "stopped" | { "loading"?: "loadingPlay" | "waiting"; };
        tags: never;
      }
  