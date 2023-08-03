
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
          "changeCurrentTrack": "NEXT_PLAY" | "PREVIOUS_PLAY" | "REPLACE_AND_PLAY";
"changeRepeat": "CHANGE_REPEAT";
"moveTracks": "REORDER";
"nextPlaybackNo": "NEXT_PLAY";
"pause": "PLAY_OR_PAUSE";
"play": "PLAY_OR_PAUSE";
"previousPlaybackNo": "PREVIOUS_PLAY";
"setCurrentPlaybackNo": "REPLACE_AND_PLAY";
"setTracks": "REPLACE_AND_PLAY";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "canNextPlay": "NEXT_PLAY";
"canPreviousPlay": "PREVIOUS_PLAY";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "loading" | "loading.loadingPlay" | "loading.waiting" | "paused" | "playing" | "ready" | "stopped" | { "loading"?: "loadingPlay" | "waiting"; };
        tags: never;
      }
  