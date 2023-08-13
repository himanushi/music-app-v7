import { IonButton, IonContent, IonItem } from "@ionic/react"
import { Icon } from "."
import { useMenu } from "~/hooks"

export const ShareButton = ({ path, text, hashtags }: { path: string, text: string, hashtags: string[] }) => {
  const { open } = useMenu({
    component: ({ onDismiss }) => (
      <IonContent onClick={() => onDismiss()}>
        <XItem path={path} text={text} hashtags={hashtags} />
      </IonContent>
    ),
    side: "right"
  });

  return <IonButton onClick={(event) => open(event)}>
    <Icon color="main" size="s" name="share" slot="icon-only" />
  </IonButton >
}

const XItem = ({ path, text, hashtags }: { path: string, text: string, hashtags: string[] }) => {
  // ref: https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/overview
  const url = `https://video-game-music.net${path}`;
  let twitterUrl = "https://twitter.com/intent/tweet";
  twitterUrl += `?text=${text}%0A`;
  twitterUrl += `&url=${url}%20%0A`;
  twitterUrl += `&hashtags=${hashtags.join(",")}`;

  return <IonItem href={twitterUrl} target="_blank" color="dark-gray">
    X で共有
  </IonItem>
}
