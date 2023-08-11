import { IonContent, IonHeader, IonToolbar } from "@ionic/react";
import { Page } from "~/components";
import { markdown } from "~/lib";

export const About = () => {
  const html = markdown(content({ version: "0.0.1" }));

  return (
    <Page>
      <IonHeader class="ion-no-border">
        <IonToolbar />
      </IonHeader>
      <IonContent fullscreen>
        {typeof html === "string" && (
          <div
            className="ion-padding"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </IonContent>
    </Page>
  );
};

const content = ({ version }: { version: string }) => `
# このアプリについて
## 概要
Apple Music で配信中のゲーム音楽を検索できるアプリです。Apple Music とライブラリの曲を再生することができます。

## 目的
ユーザー同士でゲーム音楽を楽しく共有できるよう開発を進めています。

## SNS, 開発プロジェクトなど
* [Twitter](https://twitter.com/vgm_net)
* [Treads](https://www.threads.net/@himanushi777)
* [note](https://note.com/himanushi/n/nd598a3d92a15)
* [Github](https://github.com/himanushi?tab=repositories)

## 問い合わせ
* [Q & A](https://note.com/himanushi/n/na2e56d4ee4d6)
* [Twitter にてダイレクトメッセージをお願いします](https://twitter.com/vgm_net)

#### ファイルバージョン
${version}
`;
